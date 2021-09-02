import { ValidationError } from "../common/errors/validation-error";
import { IUserContext } from "../common/user-context";
import { ShoppingCartType } from "../db/schemas/shopping-cart-type";
import { LocalisationKey } from "../localisation/localisation-key";
import { UserStatus } from "../models/user-status";
import { UserType } from "../models/user-type";
import { PayTicketsRequest } from "../tickets/model/pay-tickets-request";
import { ITicketValue } from "../tickets/model/ticket";
import { TicketStatus } from "../tickets/model/ticket-status";
import { ITicketRepository } from "../tickets/ticket-repository";
import { ITicketValidator } from "../tickets/ticket-validator";
import { IUserRepository } from "../user/user-repository";
import { IUserValue } from "../user/user-value";
import { ShoppingCart, ShoppingCartTicket } from "./model/shopping-cart";
import { ShoppingCartStatus } from "./model/shopping-cart-status";
import { ShoppingCartDbModel } from "./model/shopping-cart-db-model";
import { IShoppingCartValue } from "./model/shopping-cart-value";
import { SPRepersonalizeTicketRequest } from "./model/sp-repersonalize-ticket-request";
import { IShoppingCartRepository } from "./shopping-cart-repository";
import { ITicketPriceCalculator } from "./ticket-price-calculator";
import { ILocalisationProvider } from "../localisation/localisation-provider";

export interface IShoppingCartFactory {
    createForRepersonalizeTicketRequest(request: SPRepersonalizeTicketRequest): Promise<IShoppingCartValue>;
    createForPayTicketRequest(request: PayTicketsRequest): Promise<IShoppingCartValue>;
}

export class ShoppingCartFactory implements IShoppingCartFactory {

    constructor(
        private ticketRepository: ITicketRepository,
        private ticketValidator: ITicketValidator,
        private context: IUserContext,
        private userRepository: IUserRepository,
        private priceCalculator: ITicketPriceCalculator,
        private shoppingCartRepository: IShoppingCartRepository,
        private localisationProvider: ILocalisationProvider) {
    }

    public async createForRepersonalizeTicketRequest(request: SPRepersonalizeTicketRequest): Promise<IShoppingCartValue> {
        const cart = new ShoppingCart();
        cart.createdOn = new Date();
        cart.stype = ShoppingCartType.Repersonalization;
        cart.status = ShoppingCartStatus.active;
        cart.paymentMethod = request.paymentMethod;
        
        let tickets: Array<ShoppingCartTicket> = [];
        cart.tickets = tickets;

        let shoppingTicket = new ShoppingCartTicket();
        shoppingTicket.ticketId = request.ticket._id
        shoppingTicket.ticketId = request.ticket._id.toString();
        shoppingTicket.previousOwner = request.ticket.userId;
        shoppingTicket.previousStatus = request.ticket.status;

        // ticket.reservationExpirationDate = null;
        // ticket.reservedOn = null;
        shoppingTicket.newOwner = request.newOwner._id.toString();
        shoppingTicket.newStatus = request.newOwner.status == UserStatus.IdVerified ? TicketStatus.Personalized : TicketStatus.NonPersonalized;
        tickets.push(shoppingTicket);

        cart.price = this.priceCalculator.getRepersonalizationFee(request.newOwner.country);

        const dbCart = new ShoppingCartDbModel(cart);

        await this.shoppingCartRepository.create(dbCart);

        return dbCart;
    }

    public async createForPayTicketRequest(request: PayTicketsRequest): Promise<IShoppingCartValue> {
        const cart = new ShoppingCart();
        cart.createdOn = new Date();
        cart.stype = ShoppingCartType.BuyTicket;
        cart.status = ShoppingCartStatus.active;
        cart.paymentMethod = request.paymentMethod;

        let tickets: Array<ShoppingCartTicket> = [];
        cart.tickets = tickets;
        let ticketSellerStripeIds = {};

        for (let i = 0; i < request.tickets.length; i++) {
            let shoppingTicket = new ShoppingCartTicket();

            tickets.push(shoppingTicket);

            let ticket: ITicketValue = await this.ticketRepository.getTicketById(request.tickets[i].ticketId);

            this.ticketValidator.validateTicketPay(ticket, this.context.userId);

            let user: IUserValue = await this.userRepository.getUserById(request.tickets[i].userId);

            if (!user
                || (user.usertype == UserType.LinkedAccount && (!user.mainAccountId || user.mainAccountId != this.context.userId))
                || (user.usertype != UserType.LinkedAccount && user._id != this.context.userId)
            ) {
                throw new ValidationError(this.localisationProvider.translate(LocalisationKey.InvalidUser));
            }

            shoppingTicket.ticketId = ticket._id.toString();
            shoppingTicket.previousOwner = ticket.userId;
            shoppingTicket.previousStatus = ticket.status;

            // ticket.reservationExpirationDate = null;
            // ticket.reservedOn = null;
            shoppingTicket.newOwner = request.tickets[i].userId;
            shoppingTicket.newStatus = user.status == UserStatus.IdVerified ? TicketStatus.Personalized : TicketStatus.NonPersonalized;

            //we are selecting ticket seller id from first ticket 
            //because user can buy only from one seller in one checkout
            let ticketSeller: IUserValue =
                ticketSellerStripeIds[shoppingTicket.previousOwner] || await this.userRepository.getUserById(tickets[0].previousOwner);

            ticketSellerStripeIds[shoppingTicket.previousOwner] = ticketSeller;

            
            if (ticketSeller.usertype == UserType.LinkedAccount) {
                ticketSeller = await this.userRepository.getUserById(ticketSeller.mainAccountId);
            }

            if (!ticketSeller.stripeAccountId) {
                throw new ValidationError(this.localisationProvider.translate(LocalisationKey.TicketSellerDoesNotHaveStripeAccount));
            }

            shoppingTicket.stripeAccountId = ticketSeller.stripeAccountId;
            shoppingTicket.priceForSale = ticket.priceForSale;

            cart.price = (cart.price || 0) + this.priceCalculator.calculateAdditionalFee(ticket.priceForSale, this.context.country);
        }

        const dbCart = new ShoppingCartDbModel(cart);

        await this.shoppingCartRepository.create(dbCart);

        return dbCart;
    }
}