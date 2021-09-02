import { createEmitAndSemanticDiagnosticsBuilderProgram } from "typescript";
import { ValidationError } from "../common/errors/validation-error";
import { IUserContext } from "../common/user-context";
import { LocalisationKey } from "../localisation/localisation-key";
import { ILocalisationProvider } from "../localisation/localisation-provider";
import { TicketTransactionType } from "../models/ticket-transaction-type";
import { UserStatus } from "../models/user-status";
import { IOrganizerRepository } from "../organizer/organizer-repository";
import { IStripeFactory } from "../stripe/stripe-factory";
import { RepersonalizeTicketRequest } from "../tickets/model/re-personalize-ticket-request";
import { SearchTicketRepoRequest } from "../tickets/model/search-ticket-repo-request";
import { TicketDbObject } from "../tickets/model/ticket-db-object";
import { TicketStatus } from "../tickets/model/ticket-status";
import { ITicketRepository } from "../tickets/ticket-repository";
import { ITicketService } from "../tickets/ticket-service";
import { ITicketValidator } from "../tickets/ticket-validator";
import { IUserRepository } from "../user/user-repository";
import { IUserValue } from "../user/user-value";
import { PaymentIntentMetadata, PaymentIntentMetadataKey } from "./model/payment-intent-metadata";
import { ShoppingCartHelper } from "./model/shopping-cart-helper";
import { IShoppingCartValue } from "./model/shopping-cart-value";
import { SPRepersonalizeTicketRequest } from "./model/sp-repersonalize-ticket-request";
import { PaymentMethod } from "./payment-method";
import { IShoppingCartFactory } from "./shopping-cart-factory";
import { IShoppingCartRepository } from "./shopping-cart-repository";



export interface IRepersonalizeTicketFlow {
    startFlow(request: RepersonalizeTicketRequest): Promise<IShoppingCartValue>;
}

export class RepersonalizeTicketFlow implements IRepersonalizeTicketFlow {

    constructor(
        private context: IUserContext,
        private userRepository: IUserRepository,
        private ticketRepository: ITicketRepository,
        private ticketValidator: ITicketValidator,
        private ticketService: ITicketService,
        private shoppingCartFactory: IShoppingCartFactory,
        private stripeFactory: IStripeFactory,
        private shoppingCartRepository: IShoppingCartRepository,
        private localisationProvider: ILocalisationProvider
    ) {
    }

    public async startFlow(request: RepersonalizeTicketRequest): Promise<IShoppingCartValue> {
        const user = await this.userRepository.getUserById(this.context.userId);
        this.ticketValidator.validatePerformedIdCheck(user);

        let ticket = await this.ticketRepository.getTicketById(request.ticketId);

        this.ticketValidator.validateTicketOwner(this.context.userId, ticket);

        const newOwner: IUserValue = await this.userRepository.getUserByUserNameOrEmail(request.usernameOrEmail);

        if (!newOwner) {
            throw new ValidationError(this.localisationProvider.translate(LocalisationKey.UserNotFound));
        }

        if (newOwner._id == user._id) {
            throw new ValidationError(this.localisationProvider.translate(LocalisationKey.ActionNotAllowed));
        }

        if (newOwner.status !== UserStatus.RegistrationCompleted && newOwner.status !== UserStatus.IdVerified) {
            throw new ValidationError(this.localisationProvider.translate(LocalisationKey.NewOwnerInvalidStatus));
        }

        // Check if user already has ticket for same event
        let searchRequest: SearchTicketRepoRequest = new SearchTicketRepoRequest();
        searchRequest.userId = newOwner._id;
        searchRequest.status = [TicketStatus.Personalized, TicketStatus.ForSale, TicketStatus.RePersonalisationWaiting];
        searchRequest.eventName = ticket.eventName;
        searchRequest.beginTime = ticket.beginTime;
        searchRequest.date = ticket.date;
        searchRequest.notInTicketIds = [ticket._id];

        let ticketsFromSameEvent = await this.ticketRepository.search(searchRequest);

        if (ticketsFromSameEvent && ticketsFromSameEvent.tickets.length > 0) {
            throw new ValidationError(this.localisationProvider.translate(LocalisationKey.MaxNumberOfTicketForEventExceeded));
        }


        let previousTicketStatus: TicketStatus = ticket.status;
        // ticket.email = request.usernameOrEmail; WE SHOULD NOT DO THIS..
        ticket.status = TicketStatus.RePersonalisationWaiting;
        await this.ticketRepository.updateObjectById(request.ticketId, new TicketDbObject(ticket));

        await this.ticketService.insertTicketTransaction(
            ticket._id,
            user._id,
            new Date(),
            user._id,
            user._id, // newOwner did not change on ticket -> newOwner._id,
            previousTicketStatus,
            ticket.status,
            TicketTransactionType.TicketInRepersonalizationProcess
        );

        const createShopingCartRequest = new SPRepersonalizeTicketRequest();

        createShopingCartRequest.ticket = ticket;
        createShopingCartRequest.newOwner = newOwner;
        createShopingCartRequest.paymentMethod = request.paymentMethod;

        const shoppingCart: IShoppingCartValue =
            await this.shoppingCartFactory.createForRepersonalizeTicketRequest(createShopingCartRequest);

        const paymentIntent =
            await this.createPaymentIntent(shoppingCart);

        shoppingCart.paymentIntentId = paymentIntent.id;
        shoppingCart.paymentIntentClientSecret = paymentIntent.client_secret;

        //TODO UPDATE shopping cart in db 
        this.shoppingCartRepository.updateObjectById(shoppingCart._id, shoppingCart);

        return shoppingCart;
    }

    public async createPaymentIntent(shoppingCart: IShoppingCartValue) {

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
            payment_method_types: [shoppingCart.paymentMethod === PaymentMethod.card ? PaymentMethod.card : PaymentMethod.sofort],
            metadata: metadata,
            transfer_group: shoppingCart._id.toString()
        });

        return paymentIntent;
    }
}