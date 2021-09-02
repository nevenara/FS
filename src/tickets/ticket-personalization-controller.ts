import { IUserContext } from "../common/user-context";
import { ITicketRepository } from "./ticket-repository";
import { GetNonPersonalizedTicketsResponse, NonPersonalizedGroupedTickets } from "./model/get-non-personalized-tickets-response";
import { SearchTicketRepoRequest } from "./model/search-ticket-repo-request";
import { TicketStatus } from "./model/ticket-status";
import { GetNonPersonalizedTicketsByEventRequest } from "./model/get-non-personalized-tickets-by-event-request";
import { GetNonPersonalizedTicketsByEventResponse, NonPersonalizedTicketDetails } from "./model/get-non-personalized-tickets-by-event-response";
import { ValidationError } from "../common/errors/validation-error";
import { LocalisationKey } from "../localisation/localisation-key";
import { IOrganizerRepository } from "../organizer/organizer-repository";
import { IOrganizerValue } from "../organizer/organizer-value";
import { ITicketValue } from "./model/ticket";
import { TicketDbObject } from "./model/ticket-db-object";
import { ChangeFirstNameAndLastnameRequest } from "./model/change-firstname-and-lastname-request";
import { ChangeFirstnameAndLastnameResponse } from "./model/change-firstname-and-lastname-response";
import { ITicketService } from "./ticket-service";
import { SendEmailChangeFirstAndLastNameRequest } from "./model/send-email-change-first-and-lastname-request";
import { SendEmailChangeFirstAndLastNameResponse } from "./model/send-email-change-first-and-lastname-response";
import { IEmailSender } from "../common/email-service/email-sender";
import { SetNewTicketHolderTemplate } from "../common/email-service/models/set-new-ticket-holder-template";
import { IUserRepository } from "../user/user-repository";
import { AssignTicketRequest } from "./model/assign-ticket-request";
import { AssignTicketResponse } from "./model/assign-ticket-response";
import { IUserValue } from "../user/user-value";
import { UserStatus } from "../models/user-status";
import { UserType } from "../models/user-type";
import { TicketTransactionType } from "../models/ticket-transaction-type";
import { ConfigService } from "../common/config-service";
import { GetNonPersonalizedTicketsRequest } from "./model/get-non-personalized-tickets-request";
import { GetNonPersonalizedTicketsRepoRequest } from "./model/get-non-personalized-tickets-repo-request";
import { ITicketPlaceholderImageRepository } from "../ticket-placeholder-image/ticket-placeholder-image-repository";
import { GetTicketByEventAndSyncDateRepoRequest } from "./model/get-ticket-by-event-and-sync-date-repo-request";
import { ITicketPlaceholderImageValue } from "../ticket-placeholder-image/ticket-placeholder-image-value";
import { DoorsOpenTimeFormat } from "./model/doors-open-time-format";
import { ChangeTicketHolderRequest } from "./model/change-ticket-holder-request";
import { ChangeTicketHolderResponse } from "./model/change-ticket-holder-response";
import { AssignTicketAdminPanelRequest } from "./model/assign-ticket-admin-panel-request";
import { AssignTicketAdminPanelResponse } from "./model/assign-ticket-admin-panel-response";
import { SearchByFirstAndLastNameRequest } from "./model/search-by-firstname-and-lastname-request";
import { SearchByFirstAndLastNameResponse } from "./model/search-by-firstname-and-lastname-response";
import { Guard } from "../common/errors/guard";
import { Environment } from "../environment";
import { ExpressAppWrapper } from "../http/express-app-wrapper";
import { TicketsRouter } from "./tickets-router";
import { GenerateQrCodeRequest } from "./model/generate-qr-code-request";
import { GetQRCodeResponse } from "./model/get-qr-code-response";
import { IQRUrlParamsRepository } from "../qr-url-params/qr-url-params-repository";
import { QRUrlParamsDbObject } from "../qr-url-params/qr-url-params-db-object";
import { InputDateParameterParseUtil } from "./model/input-date-parameter-parse";
import { ImplementationLocation } from "typescript";
import { ILocalisationController } from "../localisation/localisation-controller";
import { ILocalisationProvider } from "../localisation/localisation-provider";
const moment = require('moment-timezone');
const QRCode = require('qrcode'); 

export interface ITicketPersonalizationController {
    generateQRCode(request:GenerateQrCodeRequest): Promise<GetQRCodeResponse>;
    searchByFirstAndLastName(request: SearchByFirstAndLastNameRequest): Promise<SearchByFirstAndLastNameResponse>;
    assignTicketAdminPanel(request: AssignTicketAdminPanelRequest): Promise<AssignTicketResponse>;
    getNonPersonalizedTickets(request: GetNonPersonalizedTicketsRequest): Promise<GetNonPersonalizedTicketsResponse>;
    getNonPersonalizedTicketsByEvent(request: GetNonPersonalizedTicketsByEventRequest): Promise<GetNonPersonalizedTicketsByEventResponse>;
    changeFirstnameAndLastname(request: ChangeFirstNameAndLastnameRequest): Promise<ChangeFirstnameAndLastnameResponse>;
    sendEmailChangeFirstAndLastname(request: SendEmailChangeFirstAndLastNameRequest): Promise<SendEmailChangeFirstAndLastNameResponse>;
    assignTicket(request: AssignTicketRequest): Promise<AssignTicketResponse>;
    changeTicketHolder(request: ChangeTicketHolderRequest): Promise<ChangeTicketHolderResponse>;
}

export class TicketPersonalizationController implements ITicketPersonalizationController {

    constructor(
        private context: IUserContext,
        private ticketRepository: ITicketRepository,
        private ticketService: ITicketService,
        private organizerRepository: IOrganizerRepository,
        private userRepository: IUserRepository,
        private emailSender: IEmailSender,
        private configService: ConfigService,
        private ticketPlaceholderImagesRepository: ITicketPlaceholderImageRepository,
        private qrUrlParamsRepository: IQRUrlParamsRepository,
        private localisationProvider: ILocalisationProvider
    ) { }
    
    public async generateQRCode(request: GenerateQrCodeRequest): Promise<GetQRCodeResponse> {
        this.context.validateIfAuthenticated();
    
        Guard.isTruthy(request.pageType, 'pageType is required');
        Guard.isTruthy(request.selectedId, 'selectedId is required');
        Guard.isTruthy(request.urlParams, 'urlParams is required');

        const response: GetQRCodeResponse = new GetQRCodeResponse();

        const url = new URL(Environment.getProtocol() + Environment.getAppHost() + ExpressAppWrapper.urlPrefix + 
                            TicketsRouter.CONTINUE_ID_VERIFICATION_ON_MOBILE );
        

        const qrUrlParamsDb = new QRUrlParamsDbObject();
        qrUrlParamsDb.pageType = request.pageType;
        qrUrlParamsDb.selectedId = request.selectedId;
        qrUrlParamsDb.urlParams = request.urlParams;

        const createResponse = await this.qrUrlParamsRepository.create(qrUrlParamsDb);

        url.searchParams.append("sessionId", this.context.sessionId);
        url.searchParams.append("uuid", createResponse["_id"]);

        response.qrCode = await QRCode.toDataURL(url.toString());
        console.log(url)
        return response;
    }

    public async searchByFirstAndLastName(request: SearchByFirstAndLastNameRequest): Promise<SearchByFirstAndLastNameResponse> {
        this.context.validateIfAuthenticated();
        this.context.validateAuthorization([UserType.Admin, UserType.SuperAdmin, UserType.SupportLevel1, UserType.SupportLevel2, UserType.EventManager])

        const usernamesAndEmails = await this.userRepository.searchByFirstnameAndLastname(request.firstname.trim(), request.lastname.trim(), null);
        const response = new SearchByFirstAndLastNameResponse();
        response.data = usernamesAndEmails;

        return response;
    }

    public async assignTicketAdminPanel(request: AssignTicketAdminPanelRequest): Promise<AssignTicketResponse> {
        this.context.validateIfAuthenticated();
        this.context.validateAuthorization([UserType.Admin, UserType.SuperAdmin, UserType.SupportLevel1, UserType.SupportLevel2])
        request.validate(this.context.lang);

        const user = await this.userRepository.getUserById(request.userId);

        if (user.firstname != request.firstname.trim() || user.lastname != request.lastname.trim()) {
            throw new ValidationError(this.localisationProvider.translate(LocalisationKey.UserNotFound));
        }

        const ticket = await this.ticketRepository.getTicketById(request.ticketId);

        if (ticket.status == TicketStatus.Blocked) {
            throw new ValidationError(this.localisationProvider.translate(LocalisationKey.TicketIsBlocked));
        }

        if (ticket.status == TicketStatus.Personalized) {
            throw new ValidationError(this.localisationProvider.translate(LocalisationKey.TicketAlreadyPersonalized));
        }

        
        let searchRequest: SearchTicketRepoRequest = new SearchTicketRepoRequest();
        searchRequest.userId = user._id;
        searchRequest.status = [TicketStatus.Personalized, TicketStatus.ForSale, TicketStatus.RePersonalisationWaiting];
        searchRequest.eventName = ticket.eventName;
        searchRequest.beginTime = ticket.beginTime;
        searchRequest.date = ticket.date;
        searchRequest.notInTicketIds = [ticket._id];

        let ticketsFromSameEvent = await this.ticketRepository.search(searchRequest);

        if (ticketsFromSameEvent && ticketsFromSameEvent.tickets.length > 0) {
            throw new ValidationError(this.localisationProvider.translate(LocalisationKey.MaxNumberOfTicketForEventExceeded));
        }

        ticket.firstName = request.firstname.trim();
        ticket.lastName = request.lastname.trim();

        const previousStatus = ticket.status;
        ticket.status = user.status == UserStatus.IdVerified ? TicketStatus.Personalized : TicketStatus.NonPersonalized;
        
        // personalization pending
        if(ticket.status == TicketStatus.NonPersonalized) {
            ticket.pendingUsername = user.username;
        }
        else{
            ticket.pendingUsername = null;
        }

        const previousOwnerId = ticket.userId;
        ticket.userId = user._id;

        await this.ticketRepository.updateObjectById(ticket._id, new TicketDbObject(ticket));

        await this.ticketService.insertTicketTransaction(
            ticket._id,
            this.context.userId,
            new Date(),
            previousOwnerId,
            user._id,
            previousStatus,
            ticket.status,
            TicketTransactionType.TicketRepersonalized
        );

        const response = new AssignTicketAdminPanelResponse();
        return response;
    }

    public async changeTicketHolder(request: ChangeTicketHolderRequest): Promise<ChangeTicketHolderResponse> {
        this.context.validateIfAuthenticated();
        request.validate(this.context.lang);

        const ticket = await this.ticketRepository.getTicketById(request.ticketId);
        if (moment(ticket.syncDate).add(24, 'hours') < moment()) {
            throw new ValidationError(this.localisationProvider.translate(LocalisationKey.ChangingTicketHolderDueIsPassed));
        }


        if (ticket.userId != this.context.userId) {
            throw new ValidationError(this.localisationProvider.translate(LocalisationKey.ActionNotAllowed));
        }

        if (ticket.status == TicketStatus.NonPersonalized || ticket.status == TicketStatus.RePersonalisationWaiting) {
            ticket.firstName = request.firstname.trim();
            ticket.lastName = request.lastname.trim();
            await this.ticketRepository.updateObjectById(ticket._id, new TicketDbObject(ticket));
        }
        else {
            throw new ValidationError(this.localisationProvider.translate(LocalisationKey.ActionNotAllowed));
        }

        const response = new ChangeTicketHolderResponse();
        return response;

    }

    public async getNonPersonalizedTickets(request: GetNonPersonalizedTicketsRequest): Promise<GetNonPersonalizedTicketsResponse> {
        this.context.validateIfAuthenticated();
        const timeZone = await this.configService.getConfig("timeZone", "Europe/Vienna");
        const repoRequest = new GetNonPersonalizedTicketsRepoRequest();

        const LIMIT = await this.configService.getConfig('pageLimit', 6);
        repoRequest.limit = LIMIT;
        repoRequest.page = request.page;
        repoRequest.userId = this.context.userId;

        let groupedTickets = await this.ticketRepository.getNonPersonalizedGroupedTicketsByEventAndSyncDate(repoRequest);
        //TODO check 24 limit	

        let response: GetNonPersonalizedTicketsResponse = new GetNonPersonalizedTicketsResponse();
        response.tickets = new Array<NonPersonalizedGroupedTickets>();
        for (let i = 0; i < groupedTickets.tickets.length; i++) {
            let nonPersonalizedTicket = new NonPersonalizedGroupedTickets();
            nonPersonalizedTicket.beginTime = InputDateParameterParseUtil.getDateInTimeZone(groupedTickets.tickets[i]._id.time, timeZone);
            nonPersonalizedTicket.date = InputDateParameterParseUtil.getDateInTimeZone(groupedTickets.tickets[i]._id.date, timeZone);
            nonPersonalizedTicket.doorsOpen = DoorsOpenTimeFormat.format(groupedTickets.tickets[i]._id.doorsOpen);
            nonPersonalizedTicket.eventName = groupedTickets.tickets[i]._id.event;
            nonPersonalizedTicket.locationAddress = groupedTickets.tickets[i]._id.locationAddress;
            nonPersonalizedTicket.locationName = groupedTickets.tickets[i]._id.locationName;
            nonPersonalizedTicket.amountOfTickets = groupedTickets.tickets[i].amountOfTickets;

            nonPersonalizedTicket.eventId = groupedTickets.tickets[i]._id.eventId;
            const syncDate = groupedTickets.tickets[i]._id.syncDate;
            nonPersonalizedTicket.syncDate = moment.tz(syncDate, timeZone).format()

            const ticketRepoRequest: GetTicketByEventAndSyncDateRepoRequest = new GetTicketByEventAndSyncDateRepoRequest();
            ticketRepoRequest.eventId = nonPersonalizedTicket.eventId;
            ticketRepoRequest.syncDate = syncDate;


            response.tickets.push(nonPersonalizedTicket);
        }

        response.totalPages = groupedTickets.totalPages;
        return response;
    }

    public async getNonPersonalizedTicketsByEvent(request: GetNonPersonalizedTicketsByEventRequest): Promise<GetNonPersonalizedTicketsByEventResponse> {
        this.context.validateIfAuthenticated();

        request.validate(this.context.lang);

        const timeZone = await this.configService.getConfig("timeZone", "Europe/Vienna");

        let user: IUserValue = await this.userRepository.getUserById(this.context.userId);

        if(!user) {
            throw new ValidationError(this.localisationProvider.translate(LocalisationKey.UserNotFound));
        }

        // not personalized
        let searchRequest: SearchTicketRepoRequest = new SearchTicketRepoRequest();
        searchRequest.status = new Array<TicketStatus>();
        searchRequest.status.push(TicketStatus.NonPersonalized);
        searchRequest.eventId = request.eventId;
        searchRequest.userId = this.context.userId;
        searchRequest.syncDate = request.syncDate;

        let repoResponse = await this.ticketRepository.search(searchRequest);

        

        const tickets = repoResponse.tickets;

        let response: GetNonPersonalizedTicketsByEventResponse = new GetNonPersonalizedTicketsByEventResponse();
        response.idVerified = user.status == UserStatus.IdVerified;

        for (let i = 0; i < tickets.length; i++) {
            let t: ITicketValue = tickets[i];

            let nonPersonalizedTicket = new NonPersonalizedTicketDetails();

            nonPersonalizedTicket.id = t._id;
            nonPersonalizedTicket.beginTime = InputDateParameterParseUtil.getDateInTimeZone(t.beginTime, timeZone);
            nonPersonalizedTicket.bookingId = t.bookingId;
            nonPersonalizedTicket.date = InputDateParameterParseUtil.getDateInTimeZone(t.date, timeZone);
            nonPersonalizedTicket.doorsOpen = DoorsOpenTimeFormat.format(t.doorsOpen);
            nonPersonalizedTicket.syncDate = InputDateParameterParseUtil.getDateInTimeZone(t.syncDate, timeZone);
            nonPersonalizedTicket.eventName = t.eventName;
            nonPersonalizedTicket.locationName = t.locationName;
            nonPersonalizedTicket.locationAddress = t.locationAddress;
            nonPersonalizedTicket.originalPrice = t.originalPrice;
            nonPersonalizedTicket.priceCurrency = t.priceCurrency;
            nonPersonalizedTicket.seat = t.seat;
            nonPersonalizedTicket.ticketId = t.ticketId;
            nonPersonalizedTicket.placeholderImages = await this.ticketService.getTicketPlaceholderImages(t._id);
            nonPersonalizedTicket.organizer = await this.getOrganizerName(t.organizerId);
            nonPersonalizedTicket.prePersonalizedTo = t.firstName + ' ' + t.lastName;
            nonPersonalizedTicket.prePersonalizedToFirstName = t.firstName;
            nonPersonalizedTicket.prePersonalizedToLastName = t.lastName;
            nonPersonalizedTicket.isPrePersEditable = moment(t.syncDate).add(1, 'days').isAfter(moment()) && !t.pendingUsername;
            nonPersonalizedTicket.possibleUsernamesAndEmails = await this.userRepository.searchByFirstnameAndLastname(t.firstName, t.lastName, user._id);

            nonPersonalizedTicket.isBuyer = false;
            nonPersonalizedTicket.usernameAndEmail = null;

            // Check if ticket is pre-personalized to buyer
            if(user.firstname == t.firstName && user.lastname == t.lastName) {
                let searchRequest: SearchTicketRepoRequest = new SearchTicketRepoRequest();
                searchRequest.userId = user._id;
                searchRequest.firstName = t.firstName;
                searchRequest.lastName = t.lastName;
                searchRequest.status = [TicketStatus.Personalized, TicketStatus.ForSale, TicketStatus.RePersonalisationWaiting];
                searchRequest.eventName = t.eventName;
                searchRequest.beginTime = t.beginTime;
                searchRequest.date = t.date;
                searchRequest.notInTicketIds = [t._id];
        
                let ticketsFromSameEvent = await this.ticketRepository.search(searchRequest);

                // Check if there are more users with same Firstname Lastname
                let usersSameName = await this.userRepository.getUserByFirstAndLastName(user.firstname, user.lastname);
                
                if (!(ticketsFromSameEvent && ticketsFromSameEvent.tickets.length > 0) && usersSameName && usersSameName.length == 1) {
                    nonPersonalizedTicket.isBuyer = true;
                    nonPersonalizedTicket.usernameAndEmail = user.email && user.username ? user.username + ' (' + user.email + ')' :
                                                             !user.email ? user.username : null;
                }
            }

            if(t.pendingUsername){
                nonPersonalizedTicket.usernameAndEmail = user.email && user.username ? user.username + ' (' + user.email + ')' :
                !user.email ? user.username : null;
            }

            response.tickets.push(nonPersonalizedTicket);
        }

        return response;
    }

    public async changeFirstnameAndLastname(request: ChangeFirstNameAndLastnameRequest): Promise<ChangeFirstnameAndLastnameResponse> {
        this.context.validateIfAuthenticated();
        request.validate(this.context.lang);

        //TODO check logs for 24 h limit and if this modification has been already performed
        //AND block ticket

        const ticket = await this.ticketRepository.getTicketById(request.ticketId);
        if (ticket.userId != this.context.userId) {
            throw new ValidationError(this.localisationProvider.translate(LocalisationKey.ActionNotAllowed));
        }

        if (ticket.status == TicketStatus.NonPersonalized || ticket.status == TicketStatus.RePersonalisationWaiting) {
            ticket.firstName = request.firstName.trim();
            ticket.lastName = request.lastName.trim();
            await this.ticketRepository.updateObjectById(ticket._id, new TicketDbObject(ticket));
        }
        else {
            throw new ValidationError(this.localisationProvider.translate(LocalisationKey.ActionNotAllowed));
        }

        const response = new ChangeFirstnameAndLastnameResponse();
        return response;
    }

    public async sendEmailChangeFirstAndLastname(request: SendEmailChangeFirstAndLastNameRequest): Promise<SendEmailChangeFirstAndLastNameResponse> {
        this.context.validateIfAuthenticated();
        request.validate(this.context.lang);

        //TODO check logs for 48 h limit
        const ticket = await this.ticketRepository.getTicketById(request.ticketId);
        if (ticket.userId != this.context.userId) {
            throw new ValidationError(this.localisationProvider.translate(LocalisationKey.ActionNotAllowed));
        }
        const user = await this.userRepository.getUserById(this.context.userId);

        const attributes = new SetNewTicketHolderTemplate();
        attributes.ticketId = request.ticketId;
        attributes.ticketHolderFirstname = request.firstName.trim();
        attributes.ticketHolderLastName = request.lastName.trim();
        attributes.ticketHolderUsername = request.username;
        attributes.firstName = user.firstname;
        attributes.lastName = user.lastname;

        //TODO check this email
        //await this.emailSender.sendSetNewTicketHolderEmail(user.email, attributes);
        const response = new SendEmailChangeFirstAndLastNameResponse();
        return response;
    }

    public async assignTicket(request: AssignTicketRequest): Promise<AssignTicketResponse> {
        this.context.validateIfAuthenticated();

        // let mainUser: IUserValue = await this.userRepository.getUserById(this.context.userId);

        // if (mainUser.status != UserStatus.IdVerified) {
        //     throw new ValidationError(LocalisationKey.UserIsNotIdVerified);
        // }

        request.validate(this.context.lang);

        let tickets: Array<ITicketValue> = [];
        let previousOwners: Array<string> = [];
        let previousStatuses: Array<TicketStatus> = [];

        for (let i = 0; i < request.tickets.length; i++) {
            let ticketToAssign = request.tickets[i];

            let user: IUserValue = await this.userRepository.getUserById(ticketToAssign.userId);

            if (!user) {
                throw new ValidationError(this.localisationProvider.translate(LocalisationKey.UserNotFound));
            }

            let ticket: ITicketValue = await this.ticketRepository.getTicketById(ticketToAssign.ticketId);

            if (ticket.status == TicketStatus.Blocked) {
                throw new ValidationError(this.localisationProvider.translate(LocalisationKey.TicketIsBlocked));
            }

            if (ticket.status == TicketStatus.Personalized) {
                throw new ValidationError(this.localisationProvider.translate(LocalisationKey.TicketAlreadyPersonalized));
            }

            if (ticket.userId != this.context.userId) {
                throw new ValidationError(this.localisationProvider.translate(LocalisationKey.TicketIsNotAvailable));
            }

            if (user.firstname != ticket.firstName || user.lastname != ticket.lastName) {
                throw new ValidationError(this.localisationProvider.translate(LocalisationKey.InvalidUsernameOrEmailProvided));
            }

            let searchRequest: SearchTicketRepoRequest = new SearchTicketRepoRequest();
            searchRequest.userId = user._id;
            searchRequest.status = [TicketStatus.Personalized, TicketStatus.ForSale, TicketStatus.RePersonalisationWaiting];
            searchRequest.eventName = ticket.eventName;
            searchRequest.beginTime = ticket.beginTime;
            searchRequest.date = ticket.date;
            searchRequest.notInTicketIds = [ticket._id];

            let ticketsFromSameEvent = await this.ticketRepository.search(searchRequest);

            if (ticketsFromSameEvent && ticketsFromSameEvent.tickets.length > 0) {
                console.log(ticketsFromSameEvent);
                throw new ValidationError(this.localisationProvider.translate(LocalisationKey.MaxNumberOfTicketForEventExceeded));
            }

            previousOwners.push(ticket.userId);
            previousStatuses.push(ticket.status);

            ticket.userId = user._id;
            ticket.status = user.status == UserStatus.IdVerified ? TicketStatus.Personalized : TicketStatus.NonPersonalized;

            if (ticket.status == TicketStatus.NonPersonalized) {
                ticket.pendingUsername = user.username;
            }

            tickets.push(ticket);
        }

        for (let i = 0; i < tickets.length; i++) {
            await this.ticketRepository.updateObjectById(tickets[i]._id, new TicketDbObject(tickets[i]));

            let ticketTransactionType =
                tickets[i].status == TicketStatus.Personalized
                    ? TicketTransactionType.TicketAssignedAndPersonalized
                    : TicketTransactionType.TicketAssigned;

            await this.ticketService.insertTicketTransaction(
                tickets[i]._id,
                this.context.userId,
                new Date(),
                previousOwners[i],
                tickets[i].userId,
                previousStatuses[i],
                tickets[i].status,
                ticketTransactionType
            );
        }

        return new AssignTicketResponse();
    }

    private async getOrganizerName(organizerId: string): Promise<string> {
        let organizer: IOrganizerValue = await this.organizerRepository.getOrganizerById(organizerId);
        return organizer ? organizer.companyName : '';
    }
}