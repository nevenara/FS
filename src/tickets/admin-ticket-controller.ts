import { ConfigService } from "../common/config-service";
import { ValidationError } from "../common/errors/validation-error";
import { IUserContext } from "../common/user-context";
import { IEventRepository } from "../events/event-repository";
import { LocalisationKey } from "../localisation/localisation-key";
import { ILocalisationProvider } from "../localisation/localisation-provider";
import { UserType } from "../models/user-type";
import { IOrganizerRepository } from "../organizer/organizer-repository";
import { IUserRepository } from "../user/user-repository";
import { IUserValue } from "../user/user-value";
import { DoorsOpenTimeFormat } from "./model/doors-open-time-format";
import { GetAdminTicketDetailsRequest, GetAdminTicketDetailsResponse } from "./model/get-admin-ticket-details-request";
import { InputDateParameterParseUtil } from "./model/input-date-parameter-parse";
import { TicketStatus } from "./model/ticket-status";
import { TicketStatusAdminPanel } from "./model/ticket-status-admin-panel";
import { ITicketRepository } from "./ticket-repository";
const moment = require('moment-timezone');

export class AdminTicketController {
    constructor(
        private context: IUserContext,
        private ticketRepository: ITicketRepository,
        private configService: ConfigService,
        private eventRepository: IEventRepository,
        private userRepository: IUserRepository,
        private organizerRepository: IOrganizerRepository,
        private localisationProvider: ILocalisationProvider) {

    }

    public async getTicketDetails(request: GetAdminTicketDetailsRequest): Promise<GetAdminTicketDetailsResponse> {

        this.context.validateIfAuthenticated();
        this.context.validateAuthorization([UserType.Admin, UserType.SuperAdmin, UserType.SupportLevel1, UserType.SupportLevel2, UserType.EventManager]);

        const timeZone = await this.configService.getConfig("timeZone", "Europe/Vienna");

        const ticket = await this.ticketRepository.getTicketById(request.ticketId);

        if (!ticket) {
            throw new ValidationError(this.localisationProvider.translate(LocalisationKey.TicketDoesNotExist));
        }

        // const event: Event this.eventRepository.getById(ticket.eventId);

        const response = new GetAdminTicketDetailsResponse();

        response.status = null;
        const user = ticket.userId ? await this.userRepository.getUserById(ticket.userId) : null;


        if(ticket.status == TicketStatus.ForSale || ticket.status == TicketStatus.Personalized || 
            ticket.status == TicketStatus.RePersonalisationWaiting || ticket.status == TicketStatus.WaitingForPaymentStatus) {
            response.status = TicketStatusAdminPanel.Personalized;
        }
        else if(ticket.status == TicketStatus.CheckedIn) {
            response.status = TicketStatusAdminPanel.CheckedIn;
        }
        else if (ticket.status == TicketStatus.NonPersonalized){
            if(user && user.stripeErrors && user.stripeErrors.length ) {
                response.status = TicketStatusAdminPanel.PersonalizationFailed;
            }
            else if(ticket.pendingUsername){
                response.status = TicketStatusAdminPanel.PersonalizationPending;
            }
            else if(this.isBlocked(ticket.syncDate)) {
                response.status = TicketStatusAdminPanel.BlockedForPickup;
            }
            else {
                response.status = TicketStatusAdminPanel.PrePersonalized;
            }

            
        }

        response.eventName = ticket.eventName;
        response.date = InputDateParameterParseUtil.getDateInTimeZone(ticket.date, timeZone);
        response.beginTime = InputDateParameterParseUtil.getDateInTimeZone(ticket.date, timeZone);
        response.doorsOpen = DoorsOpenTimeFormat.format(ticket.doorsOpen);
        response.seat = ticket.seat;
        response.locationAddress = ticket.locationAddress;
        response.locationName = ticket.locationName;

       

        const ticketHolderUser: IUserValue = ticket.userId ?
            /*await this.userRepository.getUserByFirstAndLastName(ticket.firstName, ticket.lastName) :*/
            await this.userRepository.getUserById(ticket.userId) : null;
        
        response.ticketHolder = ticketHolderUser ?
                                ticketHolderUser.username + (ticketHolderUser.email ? ' / ' + ticketHolderUser.email : '') :  
                                ticket.firstName + ' ' + ticket.lastName;

        response.ticketHolderUsername = ticketHolderUser ? ticketHolderUser.username : '';

        response.ticketId = ticket.ticketId;
        response.bookingId = ticket.bookingId;
        response.priceForSale = ticket.priceForSale;
        response.organizerId = ticket.organizerId;
        const organizer =
            await this.organizerRepository.getOrganizerById(ticket.organizerId);

        response.organizerAddress = organizer.address;
        response.organizerName = organizer.companyName;

        //pre-personalized to
        response.firstName = ticket.firstName;
        response.lastName = ticket.lastName;

        response.eventId = ticket.eventId;
        response.originalPrice = ticket.originalPrice;
        response.ticketHolderId = ticketHolderUser ? ticketHolderUser._id : null;
        response.possibleUsernamesAndEmails = await this.userRepository.searchByFirstnameAndLastname(ticket.firstName, ticket.lastName, null);

        response.prePersonalizationAllowed = ticket.status == TicketStatus.NonPersonalized || 
                                             ticket.status == TicketStatus.RePersonalisationWaiting;
        return response;
    }
    
    private isBlocked(syncDate: Date): boolean {
        const diff = moment().diff(syncDate, 'hours');

        return diff > 48;
    }
}