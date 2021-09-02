import { ValidationError } from "../common/errors/validation-error";
import { IUserContext } from "../common/user-context";
import { LocalisationKey } from "../localisation/localisation-key";
import { TicketTransactionType } from "../models/ticket-transaction-type";
import { UserStatus } from "../models/user-status";
import { IStripeFactory } from "../stripe/stripe-factory";
import { ITicketTransactionRepository } from "../ticket-transactions/ticket-transaction-repository";
import { ITicketValue } from "../tickets/model/ticket";
import { TicketStatus } from "../tickets/model/ticket-status";
import { ITicketRepository } from "../tickets/ticket-repository";
import { ITicketService } from "../tickets/ticket-service";
import { TicketsRouter } from "../tickets/tickets-router";
import { IUserRepository } from "../user/user-repository";
import { BuyTicketFlow } from "./buy-ticket-flow";
import { ConfirmPaymentIntentRequest, ConfirmPaymentIntentResponse } from "./model/confirm-payment-intent-request";
import { CreatePaymentIntentRequest } from "./model/create-payment-intent-request";
import { PaymentIntentMetadata, PaymentIntentMetadataKey } from "./model/payment-intent-metadata";
import { ShoppingCart, ShoppingCartTicket } from "./model/shopping-cart";
import { ShoppingCartStatus } from "./model/shopping-cart-status";
import { ShoppingCartHelper } from "./model/shopping-cart-helper";
import { ShoppingCartDbModel } from "./model/shopping-cart-db-model";
import { IShoppingCartValue } from "./model/shopping-cart-value";
import { IShoppingCartRepository } from "./shopping-cart-repository";
import { Guard } from "../common/errors/guard";
import { ShoppingCartType } from "../db/schemas/shopping-cart-type";
import { TicketDbObject } from "../tickets/model/ticket-db-object";
import { ILocalisationProvider } from "../localisation/localisation-provider";

export class PaymentController {
    constructor(
        private buyTicketFlow: BuyTicketFlow,
        private stripeFactory: IStripeFactory,
        private shoppingCartRepository: IShoppingCartRepository,
        private ticketRepository: ITicketRepository,
        private localisationProvider: ILocalisationProvider) {
    }

    public async onPaymentFailed(paymentIntentId: string, paymentIntentStatus: string) {

        Guard.isTruthy(paymentIntentId, 'paymentIntentId is required.');

        const shoppingCart = await this.shoppingCartRepository.getByPaymentIntentId(paymentIntentId);

        if (!shoppingCart) {
            throw new ValidationError(this.localisationProvider.translate(LocalisationKey.InvalidShoppingCartForGivenPaymentId + paymentIntentId));
        }

        switch (shoppingCart.stype) {
            case ShoppingCartType.Repersonalization:
                this.onRepersonalizationFailed(shoppingCart);
                break;
            case ShoppingCartType.BuyTicket:
                this.onBuyTicketFailed(shoppingCart);
                break;
        }

        shoppingCart.paymentIntentStatus = paymentIntentStatus;
        shoppingCart.status = ShoppingCartStatus.failed;

        await this.shoppingCartRepository.updateObjectById(shoppingCart._id, new ShoppingCartDbModel(shoppingCart));
    }

    private async onBuyTicketFailed(shoppingCart: IShoppingCartValue) {
        shoppingCart.tickets.forEach(async (ticket) => {
            const ticketDb = await this.ticketRepository.getTicketById(ticket.ticketId);

            //put back to personalized
            ticketDb.status = TicketStatus.ForSale;

            await this.ticketRepository.updateObjectById(ticketDb._id, new TicketDbObject(ticketDb));
        });
    }

    private async onRepersonalizationFailed(shoppingCart: IShoppingCartValue) {
        const ticket = shoppingCart.tickets[0];

        const ticketDb = await this.ticketRepository.getTicketById(ticket.ticketId);

        //put back to personalized
        ticketDb.status = TicketStatus.Personalized;
        ticketDb.pendingUsername = null;

        await this.ticketRepository.updateObjectById(ticketDb._id, new TicketDbObject(ticketDb));
    }

    public async confirmPaymentIntent(request: ConfirmPaymentIntentRequest): Promise<ConfirmPaymentIntentResponse> {
        const response = new ConfirmPaymentIntentResponse();

        const shoppingCart: IShoppingCartValue =
            await this.shoppingCartRepository.getByPaymentIntentId(request.paymentIntentId);

        if (!shoppingCart) {
            throw new ValidationError(this.localisationProvider.translate(LocalisationKey.InvalidShoppingCartForGivenPaymentId + request.paymentIntentId));
        }

        response.shoppingCartStatus = shoppingCart.status;

        if (shoppingCart.status !== ShoppingCartStatus.active) {
            //this means that staus is either failed or success. 
            //In any case this is finished shopping cart
            return response;
        }

        //RETREIVE PAYMENT INTENT FROM THE STRIPE API...
        const stripe = this.stripeFactory.createStripe();

        const paymentIntent =
            await stripe.paymentIntents.retrieve(request.paymentIntentId);

        if (!paymentIntent) {
            throw new ValidationError(this.localisationProvider.translate(LocalisationKey.InvalidPaymentIntentId));
        }

        // response.paymentIntentStatus = paymentIntent.status;

        if (paymentIntent.status === 'canceled') {
            // throw new ValidationError(LocalisationKey.PaymentIsStillNotSucceeded)

            shoppingCart.paymentIntentStatus = paymentIntent.status;
            shoppingCart.status = ShoppingCartStatus.failed;

            await this.shoppingCartRepository.updateObjectById(shoppingCart._id, new ShoppingCartDbModel(shoppingCart));

            return response;
        }

        return response;
    }

    public async createPaymentIntent(request: CreatePaymentIntentRequest) {

        //throw new Error('Call BuyTicketFlow StartFlow instead of this.')
        // const paymentIntent = await this.buyTicketFlow.createPaymentIntent(request);

        const shoppingCart = new ShoppingCartDbModel();
        shoppingCart.tickets = [];
        let t = new ShoppingCartTicket()
        t.previousStatus = TicketStatus.ForSale
        t.ticketId = '5f8556932b773728bc50357f'
        shoppingCart.tickets.push(t);
        this.shoppingCartRepository.create(shoppingCart)
        // return paymentIntent;
    }

    public async createSession() {
        const session = await this.buyTicketFlow.createCheckoutSession({});

        return session;
    }
}