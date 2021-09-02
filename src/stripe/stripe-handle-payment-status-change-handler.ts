import { IAppLogger } from "../common/app-logger";
import { ValidationError } from "../common/errors/validation-error";
import { ShoppingCartType } from "../db/schemas/shopping-cart-type";
import { LocalisationKey } from "../localisation/localisation-key";
import { TicketTransactionType } from "../models/ticket-transaction-type";
import { PaymentIntentMetadataKey } from "../payment/model/payment-intent-metadata";
import { ShoppingCartStatus } from "../payment/model/shopping-cart-status";
import { ShoppingCartHelper } from "../payment/model/shopping-cart-helper";
import { ShoppingCartDbModel } from "../payment/model/shopping-cart-db-model";
import { IShoppingCartValue } from "../payment/model/shopping-cart-value";
import { PaymentController } from "../payment/payment-controller";
import { IShoppingCartRepository } from "../payment/shopping-cart-repository";
import { TicketDbObject } from "../tickets/model/ticket-db-object";
import { ITicketRepository } from "../tickets/ticket-repository";
import { ITicketService } from "../tickets/ticket-service";
import { IUserRepository } from "../user/user-repository";
import { IStripeFactory } from "./stripe-factory";
import { IRepersonalizeTicketController } from "../tickets/re-personalize-ticket-controller";
import { CompleteTicketRepersonalizationRequest } from "../tickets/model/complete-ticket-repersonalization-request";
import { ILocalisationProvider } from "../localisation/localisation-provider";


export class StripePaymentIntentStatusChangeHandler {
    constructor(
        private logger: IAppLogger,
        private paymentController: PaymentController,
        private shoppingCartRepository: IShoppingCartRepository,
        private stripeFactory: IStripeFactory,
        private ticketRepository: ITicketRepository,
        private ticketService: ITicketService,
        private userRepository: IUserRepository,
        private repersonalizeTicketController: IRepersonalizeTicketController,
        private localisationProvider: ILocalisationProvider) {

    }

    public async handlePaymentIntentFailed(paymentIntent: any) {

        await this.paymentController.onPaymentFailed(paymentIntent.id, paymentIntent.status);

        const shoppingCart: IShoppingCartValue =
            await this.shoppingCartRepository.getByPaymentIntentId(paymentIntent.id);

        if (!shoppingCart) {
            throw new ValidationError(this.localisationProvider.translate(LocalisationKey.InvalidShoppingCartForGivenPaymentId + paymentIntent.id));
        }

        shoppingCart.paymentIntentStatus = paymentIntent.status;
        shoppingCart.status = ShoppingCartStatus.failed;
        shoppingCart.statusChangedOn = new Date();
        
        await this.shoppingCartRepository.updateObjectById(shoppingCart._id, new ShoppingCartDbModel(shoppingCart));
    }

    public async handleChargeSucceded(charge: any) {

        const shoppingCart: IShoppingCartValue =
            await this.shoppingCartRepository.getByPaymentIntentId(charge.payment_intent);

        if (!shoppingCart) {
            throw new ValidationError(this.localisationProvider.translate(LocalisationKey.InvalidShoppingCartForGivenPaymentId + charge.payment_intent));
        }

        const shoppingCartType = shoppingCart.stype || ShoppingCartType.BuyTicket;

        switch (shoppingCartType) {
            case ShoppingCartType.BuyTicket:
                await this.OnChargeSuccessForBuyTicket(charge, shoppingCart);
                break;
            case ShoppingCartType.Repersonalization:
                await this.OnChargeSuccessForRepersonalization(charge, shoppingCart);
                break;
        }

        shoppingCart.paymentIntentStatus = 'succeeded';
        shoppingCart.status = ShoppingCartStatus.success;
        shoppingCart.statusChangedOn = new Date();

        await this.shoppingCartRepository.updateObjectById(shoppingCart._id, new ShoppingCartDbModel(shoppingCart));
    }

    private async OnChargeSuccessForRepersonalization(charge: any, shoppingCart: IShoppingCartValue) {
        const req = new CompleteTicketRepersonalizationRequest(); 
        
        const ticket = shoppingCart.tickets[0];

        req.userId = ticket.newOwner;
        req.ticketId = ticket.ticketId;

        await this.repersonalizeTicketController.completeTicketRepersonalization(req);
    }

    private async OnChargeSuccessForBuyTicket(charge: any, shoppingCart: IShoppingCartValue) {
        await this.paymentController.confirmPaymentIntent({ paymentIntentId: charge.payment_intent });

        const stripe = this.stripeFactory.createStripe();

        const ticketSellers = ShoppingCartHelper.getTicketSellers(shoppingCart.tickets);

        for (let index = 0; index < ticketSellers.length; index++) {
            const seller = ticketSellers[index];

            try {
                // Create a Transfer to the connected account (later):
                const transfer = await stripe.transfers.create({
                    amount: ShoppingCartHelper.getPriceInCents(seller.totalPrice),
                    currency: 'eur',
                    destination: seller.stripeAccountId,
                    transfer_group: shoppingCart._id.toString(),
                    source_transaction: charge.id
                });
            } catch (error) {
                this.logger.error(error);
                this.logger.log(error);
                throw error;
            }
        }

        shoppingCart.tickets.forEach(async (ticketEl) => {

            const previousOwner = ticketEl.previousOwner;

            const newOwnerId = ticketEl.newOwner;

            const newStatus = ticketEl.newStatus;

            const ticket = await this.ticketRepository.getTicketById(ticketEl.ticketId);

            ticket.userId = newOwnerId;
            ticket.status = newStatus;

            const newOwner = await this.userRepository.getUserById(ticket.userId);

            ticket.firstName = newOwner.firstname;
            ticket.lastName = newOwner.lastname;
            ticket.email = newOwner.email;

            await this.ticketService.insertTicketTransaction(
                ticket._id,
                ticketEl.newOwner,
                new Date(),
                previousOwner,
                newOwnerId,
                ticket.status,
                newStatus,
                TicketTransactionType.TicketBought
            );

            await this.ticketRepository.updateObjectById(ticket._id, new TicketDbObject(ticket));
        });
    }
}