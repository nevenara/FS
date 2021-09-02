import { ConfigService } from "../common/config-service";
import { ICountryIsoCodeProvider } from "../common/country-iso-code-provider";
import { ValidationError } from "../common/errors/validation-error";
import { IUserContext } from "../common/user-context";
import { LocalisationKey } from "../localisation/localisation-key";
import { ILocalisationProvider } from "../localisation/localisation-provider";
import { TicketTransactionType } from "../models/ticket-transaction-type";
import { UserStatus } from "../models/user-status";
import { UserType } from "../models/user-type";
import { IOrganizerRepository } from "../organizer/organizer-repository";
import { IRepersonalizeTicketFlow } from "../payment/repersonalize-ticket-flow";
import { SearchUsersAdminPanelRepoRequest } from "../user-profile/models/search-users-admin-panel-repo-request";
import { SearchUsersRepoRequest } from "../user-profile/models/search-users-repo-request";
import { IUserRepository } from "../user/user-repository";
import { CompleteTicketRepersonalizationRequest } from "./model/complete-ticket-repersonalization-request";
import { CompleteTicketPersonalizationResponse } from "./model/complete-ticket-repersonalization-response";
import { DoorsOpenTimeFormat } from "./model/doors-open-time-format";
import { GetTicketDetailsForRepersonalizationResponse } from "./model/get-ticket-details-for-repersonalization-response";
import { GetTicketDetailsRequest } from "./model/get-ticket-details-request";
import { GetUsernamesAndEmailsRepersonalizationRequest } from "./model/get-usernames-and-emails-repersonalization-request";
import { GetUsernamesAndEmailsResponse, UsernameAndEmail } from "./model/get-usernames-and-emails-repersonalization-response";
import { InputDateParameterParseUtil } from "./model/input-date-parameter-parse";
import { RepersonalizeTicketRequest } from "./model/re-personalize-ticket-request";
import { RepersonalizeTicketResponse } from "./model/re-personalize-ticket-response";
import { TicketDbObject } from "./model/ticket-db-object";
import { TicketStatus } from "./model/ticket-status";
import { ITicketRepository } from "./ticket-repository";
import { ITicketService } from "./ticket-service";
import { ITicketValidator } from "./ticket-validator";

const moment = require('moment-timezone');

export interface IRepersonalizeTicketController {
    repersonalizeTicket(request: RepersonalizeTicketRequest): Promise<RepersonalizeTicketResponse>;
    completeTicketRepersonalization(request: CompleteTicketRepersonalizationRequest): Promise<CompleteTicketPersonalizationResponse>;
    getTicketDetailsForRepersonalization(request: GetTicketDetailsRequest): Promise<GetTicketDetailsForRepersonalizationResponse>;
    getUsernamesAndEmails(request: GetUsernamesAndEmailsRepersonalizationRequest): Promise<GetUsernamesAndEmailsResponse>;
}

export class RepersonalizeTicketController implements IRepersonalizeTicketController {
    constructor(
        private context: IUserContext,
        private userRepository: IUserRepository,
        private ticketRepository: ITicketRepository,
        private organizerRepository: IOrganizerRepository,
        private ticketValidator: ITicketValidator,
        private ticketService: ITicketService,
        private configService: ConfigService,
        private repersonalizeTicketFlow: IRepersonalizeTicketFlow,
        private isoCodeProvider: ICountryIsoCodeProvider,
        private localisationProvider: ILocalisationProvider
    ) {
    }

    public async getTicketDetailsForRepersonalization(request: GetTicketDetailsRequest): Promise<GetTicketDetailsForRepersonalizationResponse> {
        this.context.validateIfAuthenticated();
        const timeZone = await this.configService.getConfig("timeZone", "Europe/Vienna");

        const response: GetTicketDetailsForRepersonalizationResponse = new GetTicketDetailsForRepersonalizationResponse();
        const ticket = await this.ticketRepository.getTicketById(request.ticketId);

        response.id = ticket._id;
        response.ticketId = ticket.ticketId;
        response.bookingId = ticket.bookingId;
        response.originalPrice = ticket.originalPrice;
        response.eventName = ticket.eventName;
        response.eventId = ticket.eventId;
        response.locationName = ticket.locationName;
        response.locationAddress = ticket.locationAddress;
        response.date = InputDateParameterParseUtil.getDateInTimeZone(ticket.date, timeZone);
        response.beginTime = InputDateParameterParseUtil.getDateInTimeZone(ticket.beginTime, timeZone);
        response.doorsOpen = DoorsOpenTimeFormat.format(ticket.doorsOpen);
        response.seat = ticket.seat;
        response.organizer = await (await this.organizerRepository.getOrganizerById(ticket.organizerId)).companyName;

        const ticketHolder = await this.userRepository.getUserById(ticket.userId);
        response.ticketHolderFirstName = ticketHolder.firstname;
        response.ticketHolderLastName = ticketHolder.lastname;
        response.ticketHolderUsername = ticketHolder.username;

        return response;
    }

    public async repersonalizeTicket(request: RepersonalizeTicketRequest): Promise<RepersonalizeTicketResponse> {
        this.context.validateIfAuthenticated();

        const shoppingCart = await this.repersonalizeTicketFlow.startFlow(request);

        const response = new RepersonalizeTicketResponse();
        response.paymentIntentId = shoppingCart ? shoppingCart.paymentIntentId : null;
        response.paymentIntentClientSecret = shoppingCart ? shoppingCart.paymentIntentClientSecret : null;
        response.shoppingCartId = shoppingCart ? shoppingCart._id.toString() : null;
        response.country =  this.isoCodeProvider.getIsoCode(this.context.country);
        return response;
    }

    public async completeTicketRepersonalization(
        request: CompleteTicketRepersonalizationRequest): Promise<CompleteTicketPersonalizationResponse> {
        //this.context.validateIfAuthenticated();
        //TODO check payment

        
        let newOwner = await this.userRepository.getUserById(request.userId);
        let ticket = await this.ticketRepository.getTicketById(request.ticketId);
        let oldOwner = await this.userRepository.getUserById(ticket.userId);

        if (ticket.status != TicketStatus.RePersonalisationWaiting) {
            throw new ValidationError(this.localisationProvider.translate(LocalisationKey.TicketNotWaitingForPersonalization));
        }

        let prevousTicketStatus: TicketStatus = ticket.status;

        ticket.userId = newOwner._id;
        ticket.firstName = newOwner.firstname;
        ticket.lastName = newOwner.lastname;
        ticket.email = newOwner.email;
        ticket.status = TicketStatus.Personalized;
        ticket.pendingUsername = null;
        await this.ticketRepository.updateObjectById(request.ticketId, new TicketDbObject(ticket));

        await this.ticketService.insertTicketTransaction(
            ticket._id,
            oldOwner._id,
            new Date(),
            oldOwner._id,
            newOwner._id,
            prevousTicketStatus,
            ticket.status,
            TicketTransactionType.TicketRepersonalized
        );

        const response = new CompleteTicketPersonalizationResponse();
        return response;
    }

    public async getUsernamesAndEmails(request: GetUsernamesAndEmailsRepersonalizationRequest): Promise<GetUsernamesAndEmailsResponse> {
        this.context.validateIfAuthenticated();
        
        let searchRequest: SearchUsersRepoRequest = new SearchUsersRepoRequest();
        searchRequest.accountType = [UserType.MainAccount, UserType.LinkedAccount];
        searchRequest.usernameOrEmail = request.usernameOrEmail;

        let repoResponse = await this.userRepository.search(searchRequest);

        let response: GetUsernamesAndEmailsResponse = new GetUsernamesAndEmailsResponse();
        response.users = [];

        for (let i = 0; i < repoResponse.users.length; i++) {
            let user: UsernameAndEmail = new UsernameAndEmail();
            user.userId = repoResponse.users[i]._id;
            user.usernameAndEmail = repoResponse.users[i].username;

            if (repoResponse.users[i].email) {
                user.usernameAndEmail += ' (' + repoResponse.users[i].email + ')';
            }

            response.users.push(user);
        }

        return response;
    }

}
