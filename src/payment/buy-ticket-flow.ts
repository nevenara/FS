import { ValidationError } from "../common/errors/validation-error";
import { IUserContext } from "../common/user-context";
import { SessionStore } from "../http/session/session-store";
import { LocalisationKey } from "../localisation/localisation-key";
import { IStripeFactory } from "../stripe/stripe-factory";
import { PayTicketsRequest } from "../tickets/model/pay-tickets-request";
import { ITicketValue } from "../tickets/model/ticket";
import { TicketDbObject } from "../tickets/model/ticket-db-object";
import { TicketStatus } from "../tickets/model/ticket-status";
import { ITicketRepository } from "../tickets/ticket-repository";
import { IUserRepository } from "../user/user-repository";
import { CreatePaymentIntentRequest } from "./model/create-payment-intent-request";
import { PaymentIntentMetadata, PaymentIntentMetadataKey } from "./model/payment-intent-metadata";
import { ShoppingCart, ShoppingCartTicket } from "./model/shopping-cart";
import { ShoppingCartHelper } from "./model/shopping-cart-helper";
import { ShoppingCartDbModel } from "./model/shopping-cart-db-model";
import { IShoppingCartValue } from "./model/shopping-cart-value";
import { IShoppingCartFactory } from "./shopping-cart-factory";
import { IShoppingCartRepository } from "./shopping-cart-repository";
import { PaymentMethod } from "./payment-method";

export interface IBuyTicketFlow {
    startFlow(request: PayTicketsRequest);
}

export class BuyTicketFlow implements IBuyTicketFlow {

    constructor(
        private stripeFactory: IStripeFactory,
        private context: IUserContext,
        private userRepository: IUserRepository,
        private ticketRepository: ITicketRepository,
        private shoppingCartFactory: IShoppingCartFactory,
        private shoppingCartRepository: IShoppingCartRepository) {
    }


    //Flow starts with shopping cart creation
    //(maybe it will be created prior to this but for now we do it here)
    public async startFlow(request: PayTicketsRequest) {
        request.validate(this.context.lang);

        const shoppingCart: IShoppingCartValue =
            await this.shoppingCartFactory.createForPayTicketRequest(request);

        const paymentIntent =
            await this.createPaymentIntent(shoppingCart);

        shoppingCart.paymentIntentId = paymentIntent.id;
        shoppingCart.paymentIntentClientSecret = paymentIntent.client_secret;

        //TODO UPDATE shopping cart in db 
        this.shoppingCartRepository.updateObjectById(shoppingCart._id, shoppingCart);


        for (let i = 0; i < shoppingCart.tickets.length; i++) {
            const ticket: ShoppingCartTicket = shoppingCart.tickets[i];
            const dbTicket: ITicketValue = await this.ticketRepository.getTicketById(ticket.ticketId);

            dbTicket.status = TicketStatus.WaitingForPaymentStatus;

            await this.ticketRepository.updateObjectById(dbTicket._id, new TicketDbObject(dbTicket));
        }

        return shoppingCart;
    }


    public async createPaymentIntent(shoppingCart: IShoppingCartValue) {

        //https://stripe.com/docs/payments/connected-accounts
        //1. One approach is a direct charge,
        // in which the connected account is responsible for the cost of the Stripe fees, refunds, and chargebacks. To perform a direct charge with a PaymentIntent,
        // supply the ID of the connected account while creating the PaymentIntent:


        //2. Additionally, the Payment Intents API supports creating a transfer 
        // to a connected account automatically and setting a connected account as the business of record for the payment.
        // The transfer_data[destination] is the ID of the connected account that should receive the transfer.    

        //3. https://stripe.com/docs/payments/intents
        // this shows the full flow..

        //todo all tickets must be from one seller...

        const stripe = this.stripeFactory.createStripe();

        const metadata = {
            integration_check: 'fansafe_accept_a_payment',
            buyerId: this.context.userId
        }

        const intentMetadata = new PaymentIntentMetadata();
        intentMetadata.shoppingCartId = shoppingCart._id.toString();

        metadata[PaymentIntentMetadataKey.buyerId] = this.context.userId;
        metadata[PaymentIntentMetadataKey.shoppingCart] = JSON.stringify(intentMetadata);

        const paymentIntent = await stripe.paymentIntents.create({
            amount: ShoppingCartHelper.getPriceInCents(shoppingCart.price), //https://stripe.com/docs/currencies#zero-decimal
            currency: 'eur',
            payment_method_types: [shoppingCart.paymentMethod == PaymentMethod.sofort ? PaymentMethod.sofort : PaymentMethod.card],
            // application_fee_amount: 5, we will not use this with transfer group approach
            // Verify your integration in this guide by including this parameter
            metadata: metadata,
            transfer_group: shoppingCart._id.toString()
        });

        //THIS NEEDS TO BE DONE AFTER WEB HOOK PAYMENT SUCCEDDED EVENT IS RECEIVED..
        // const ticketSellers = ShoppingCartHelper.getTicketSellers(shoppingCart.tickets);

        // for (let index = 0; index < ticketSellers.length; index++) {
        //     const seller = ticketSellers[index];
        //     // Create a Transfer to the connected account (later):
        //     const transfer = await stripe.transfers.create({
        //         amount: seller.totalPrice * 100,
        //         currency: 'eur',
        //         destination: seller.stripeAccountId,
        //         transfer_group: shoppingCart._id.toString(),
        //     });
        // }

        return paymentIntent;
    }

    public async createCheckoutSession(ticket: any) {
        const stripe = this.stripeFactory.createStripe();

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            customer_email: this.context.email,
            line_items: [
                {
                    price_data: {
                        currency: 'eur',
                        product_data: {
                            name: 'Ticket for the {EventName}',
                        },
                        unit_amount: 50,
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: 'http://localhost:4200/fansafe/success',
            cancel_url: 'http://localhost:4200/fansafe/cancel',
        });

        return session;
    }
}