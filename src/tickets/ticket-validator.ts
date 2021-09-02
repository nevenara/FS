import { Validator } from "../common/validator";
import { SyncTicketRequest } from "./model/sync-ticket-request";
import { ValidationError } from "../common/errors/validation-error";
import { LocalisationKey } from "../localisation/localisation-key";
import { TicketOnSaleRequest } from "./model/ticket-on-sale-request";
import { ITicketValue } from "./model/ticket";
import { TicketStatus } from "./model/ticket-status";
import { IUserRepository } from "../user/user-repository";
import { UserType } from "../models/user-type";
import { use } from "chai";
import moment = require("moment");
import { IUserValue } from "../user/user-value";
import { UserStatus } from "../models/user-status";
import { ILocalisationProvider } from "../localisation/localisation-provider";
import { IUserContext } from "../common/user-context";

export interface ITicketValidator {
    validateSyncTicketRequest(request: SyncTicketRequest);
    validateTicketOnSale(userId: string, request: TicketOnSaleRequest, ticket: ITicketValue);
    validateDeleteSaleTicket(userId: string, ticket: ITicketValue);
    validateTicketOwner(userId: string, ticket: ITicketValue):void;
    validateReturnTicket(ticketReturn: boolean):void;
    validatePerformedIdCheck(user: IUserValue):void;
    validateTicketReservation(ticket: ITicketValue, userId: string): void;
    validateTicketPay(ticket: ITicketValue, userId: string): void;
}

export class TicketValidator extends Validator implements ITicketValidator {
    constructor(private userRepository: IUserRepository, protected localisationProvider: ILocalisationProvider, protected context: IUserContext) {
        super(context, localisationProvider);
    }

    public validateSyncTicketRequest(request: SyncTicketRequest) {
        if (request.placeholderImages) {
            const MAX_PLACEHOLDER_IMAGES = 4;

            if (request.placeholderImages.length > MAX_PLACEHOLDER_IMAGES) {
                throw new ValidationError(this.localisationProvider.translate(LocalisationKey.MaxNumberOfPlaceholderImagesExceeded));
            }

            request.placeholderImages.forEach(image => {
                //TODO add validate placeholder image
                this.validateProfileImage(image);
            });
        }
    }

    public async validateTicketOnSale(userId: string, request: TicketOnSaleRequest, ticket: ITicketValue) {
        if (!ticket) {
            throw new ValidationError(this.localisationProvider.translate(LocalisationKey.TicketDoesNotExist));
        }

        await this.validateTicketOwner(userId, ticket);

        if (ticket.status != TicketStatus.Personalized && ticket.status != TicketStatus.ForSale) {
            throw new ValidationError(this.localisationProvider.translate(LocalisationKey.TicketNotPersonalized));
        }

        if (ticket.originalPrice < request.price) {
            throw new ValidationError(this.localisationProvider.translate(LocalisationKey.TicketSalePriceNotValid));
        }
    }

    public async validateDeleteSaleTicket(userId: string, ticket: ITicketValue) {
        if (!ticket) {
            throw new ValidationError(this.localisationProvider.translate(LocalisationKey.TicketDoesNotExist));
        }

        await this.validateTicketOwner(userId, ticket);

        if (ticket.status != TicketStatus.ForSale) {
            throw new ValidationError(this.localisationProvider.translate(LocalisationKey.TicketNotForSale));
        }

        if (ticket.reservationExpirationDate && ticket.reservationExpirationDate > moment().toDate()) {
            throw new ValidationError(this.localisationProvider.translate(LocalisationKey.TicketAlreadyReserved));
        }
    }

    public async validateTicketOwner(userId: string, ticket: ITicketValue) {
        if (!ticket.userId) {
            throw new ValidationError(this.localisationProvider.translate(LocalisationKey.ActionNotAllowed));
        }

        if (ticket.userId != userId) {
            let user = await this.userRepository.getUserById(ticket.userId);

            if (user.usertype != UserType.LinkedAccount || !user.mainAccountId || user.mainAccountId != userId) {
                throw new ValidationError(this.localisationProvider.translate(LocalisationKey.ActionNotAllowed));
            }
        }
    }

    public validateReturnTicket(ticketReturn: boolean){
        if(!ticketReturn){
            throw new ValidationError(this.localisationProvider.translate(LocalisationKey.ActionNotAllowed));
        }
    }

    public validatePerformedIdCheck(user: IUserValue){
        if(user.status != UserStatus.IdVerified) {
            throw new ValidationError(this.localisationProvider.translate(LocalisationKey.UserIsNotIdVerified));
        }
    }

    public validateTicketReservation(ticket: ITicketValue, userId: string) {
        if (ticket.status != TicketStatus.ForSale) {
            throw new ValidationError(this.localisationProvider.translate(LocalisationKey.TicketNotForSale));
        }

        if (ticket.userId == userId) {
            throw new ValidationError(this.localisationProvider.translate(LocalisationKey.CannotBuyYourOwnTicket));
        }

        if (ticket.reservationExpirationDate && ticket.reservationExpirationDate > moment().toDate() 
            && ticket.reservedOn && ticket.reservedOn != userId
        ) {
            throw new ValidationError(this.localisationProvider.translate(LocalisationKey.TicketAlreadyReserved));
        }
    }

    public validateTicketPay(ticket: ITicketValue, userId: string) {
        if (!ticket) {
            throw new ValidationError(this.localisationProvider.translate(LocalisationKey.TicketDoesNotExist));
        }
        
        if (!ticket.userId) {
            throw new ValidationError(this.localisationProvider.translate(LocalisationKey.TicketNotAssignedToUser));
        }

        if (ticket.status !== TicketStatus.ForSale) {
            throw new ValidationError(this.localisationProvider.translate(LocalisationKey.TicketNotForSale));
        }

        if (!ticket.reservedOn || ticket.reservedOn != userId) {
            throw new ValidationError(this.localisationProvider.translate(LocalisationKey.TicketAlreadyReserved));
        }

        if (!ticket.reservationExpirationDate || ticket.reservationExpirationDate <= moment().toDate()) {
            throw new ValidationError(this.localisationProvider.translate(LocalisationKey.TicketReservationExpired));
        }
    }
}