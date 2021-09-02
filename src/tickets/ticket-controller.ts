import { IUserAdditionalEmailsRepository } from "../additional-emails/user-additional-emails-repository";
import { IUserContext } from "../common/user-context";
import { IUserRepository } from "../user/user-repository";
import { ITicketRepository } from "./ticket-repository";
import { ITicketValidator } from "./ticket-validator";
import { SyncTicketRequest } from "./model/sync-ticket-request";
import { SyncTicketResponse } from "./model/sync-ticket-response";
import { UserDbObject } from "../user/user-db-object";
import { TicketDbObject } from "./model/ticket-db-object";
import { TicketPlaceholderImageDbObject } from "../ticket-placeholder-image/ticket-placeholder-image-db-object";
import { ITicketPlaceholderImageRepository } from "../ticket-placeholder-image/ticket-placeholder-image-repository";
import { TicketStatus } from "./model/ticket-status";
import { UserStatus } from "../models/user-status";
import { SearchTicketRepoRequest } from "./model/search-ticket-repo-request";
import { ReturnTicketResponse } from "./model/return-ticket-response";
import { ReturnTicketRequest } from "./model/return-ticket-request";
import { ITicketValue } from "./model/ticket";
import { IUserValue } from "../user/user-value";
import { IOrganizerRepository } from "../organizer/organizer-repository";
import { IEmailSender } from "../common/email-service/email-sender";
import { ReturnTicketTemplate } from "../common/email-service/models/return-ticket-template";
import { GetTicketDetailsRequest } from "./model/get-ticket-details-request";
import { GetTicketDetailsResponse } from "./model/get-ticket-details-response";
import { TicketTransactionType } from "../models/ticket-transaction-type";
import { ITicketService } from "./ticket-service";
import { ITicketAssignmentDeadlineRepository } from "../ticket-assignment-deadlines/ticket-assignment-deadline-repository";
import { GetCategoryResponse, GetTicketCategoriesResponse } from "./model/get-ticket-categories-response";
import { TicketCategory } from "../models/ticket-category";
import { ConfigService } from "../common/config-service";
import { ITicketSyncEventCreationProcess } from "../events/ticket-sync-event-creation-process";
import { IEventValue } from "../events/event-value";
import { EventDbObject } from "../events/event-db-object";
import { IOrganizerValue } from "../organizer/organizer-value";
import { ValidationError } from "../common/errors/validation-error";
import { LocalisationKey } from "../localisation/localisation-key";
import { DoorsOpenTimeFormat } from "./model/doors-open-time-format";
import { GetChangeHistoryRequest } from "./model/get-change-history-request";
import { ChangeRecordResponse, GetChangeHistoryResponse } from "./model/get-change-history-response";
import { UserPermissionsUtil, UserType } from "../models/user-type";
import { ITicketTransactionRepository } from "../ticket-transactions/ticket-transaction-repository";
import { GetChangeHistoryRepoResponse } from "./model/get-change-history-repo-response";
import { IImageCompressor } from "../common/image-helper";
import { InputDateParameterParseUtil } from "./model/input-date-parameter-parse";
import { getUUID } from "../db/uuid";
import { ILocalisationProvider } from "../localisation/localisation-provider";
const moment = require('moment-timezone');
const QRCode = require('qrcode'); 

export interface ITicketController {
    getChangeHistory(request: GetChangeHistoryRequest): Promise<GetChangeHistoryResponse>;
    syncTicket(request: SyncTicketRequest): Promise<SyncTicketResponse>;
    returnTicket(request: ReturnTicketRequest): Promise<ReturnTicketResponse>;
    getTicketDetails(request: GetTicketDetailsRequest): Promise<GetTicketDetailsResponse>;
    getTicketCategories(): Promise<GetTicketCategoriesResponse>;
}

export class TicketController implements ITicketController {
    constructor(
        private context: IUserContext,
        private ticketRepository: ITicketRepository,
        private userRepository: IUserRepository,
        private additionalEmailsRepository: IUserAdditionalEmailsRepository,
        private ticketPlaceholderImageRepository: ITicketPlaceholderImageRepository,
        private organizerRepository: IOrganizerRepository,
        private ticketAssignmentDeadlineRepository: ITicketAssignmentDeadlineRepository,
        private ticketTransactionRepository: ITicketTransactionRepository,
        private ticketService: ITicketService,
        private ticketValidator: ITicketValidator,
        private emailSender: IEmailSender,
        private configService: ConfigService,
        private ticketSyncEventCreationProcess: ITicketSyncEventCreationProcess,
        private imageCompressor: IImageCompressor,
        private localisationProvider: ILocalisationProvider
    ) { }
    
    public async getChangeHistory(request: GetChangeHistoryRequest): Promise<GetChangeHistoryResponse> {
        this.context.validateIfAuthenticated();
        this.context.validateAuthorization([UserType.Admin, UserType.SuperAdmin, UserType.SupportLevel1, UserType.SupportLevel2, UserType.EventManager]);
        request.validate(this.context.lang);

        const timeZone = await this.configService.getConfig("timeZone", "Europe/Vienna");

        request.limit = request.limit || await this.configService.getConfig('pageLimit', 10);
        request.page = request.page || 1;

        const response: GetChangeHistoryResponse = new GetChangeHistoryResponse();
        const repoResponse: GetChangeHistoryRepoResponse = await this.ticketTransactionRepository.getChangeHistory(request);
        
        response.data = [];
        for (let i = 0; i < repoResponse.data.length; i++) {
            const res = new ChangeRecordResponse();
            res.date = repoResponse.data[i].date ? moment.tz(repoResponse.data[i].date, timeZone).format() : null;
            
            const editor: IUserValue = repoResponse.data[i].editor;

            res.editor = editor ? UserPermissionsUtil.getPermissions(editor.usertype) + ' (' + editor.email + ')' : 'System';
            res.newValue = repoResponse.data[i].newValue;
            res.originalValue = repoResponse.data[i].originalValue;

            response.data.push(res);

        }

        response.totalPages = repoResponse.totalPages;
        response.totalRecords = repoResponse.totalRecords;
        return response;
    }

    public async syncTicket(request: SyncTicketRequest): Promise<SyncTicketResponse> {
        request.validate(this.context.lang);

        this.ticketValidator.validateSyncTicketRequest(request);
        request.email = request.email.toLowerCase();
        
        let user =
            await this.userRepository.getUserByField(UserDbObject.EmailFieldName, request.email);

        if (!user) {
            let additionalEmail = await this.additionalEmailsRepository.getAdditionalEmailByEmail(request.email);

            if (additionalEmail) {
                user = await this.userRepository.getUserById(additionalEmail.userId);
            }
        }

        const ticket: TicketDbObject = new TicketDbObject();

        ticket.status = TicketStatus.NonPersonalized;

        //user is main account
        if (user) {
            ticket.userId =
                user._id;

            ticket.originalUserId =
                user._id;

            const searchTicketRequest = new SearchTicketRepoRequest();
            searchTicketRequest.eventName = request.eventName;
            searchTicketRequest.locationName = request.locationName;
            searchTicketRequest.date = request.date;
            searchTicketRequest.beginTime = request.date;
            searchTicketRequest.userId = user._id;
            let otherTickets = await this.ticketRepository.search(searchTicketRequest);

            if (otherTickets && otherTickets.tickets.length >= 4) {
                ticket.status = TicketStatus.NotAvailable;
            }
            else {
                if (request.firstName.trim() == user.firstname && request.lastName.trim() == user.lastname) {

                    if (user.status == UserStatus.IdVerified) {
                        searchTicketRequest.firstName = request.firstName.trim();
                        searchTicketRequest.lastName = request.lastName.trim();
                        otherTickets = await this.ticketRepository.search(searchTicketRequest);

                        if (!otherTickets || otherTickets.tickets.length == 0) {
                            ticket.status = TicketStatus.Personalized;
                        }
                        else {
                            ticket.status = TicketStatus.NonPersonalized;
                        }
                    }
                    else {
                        ticket.status = TicketStatus.NonPersonalized;
                    }
                } else {
                    ticket.status = TicketStatus.NonPersonalized;
                }
            }
        }

        ticket.email = request.email;
        ticket.additionalInfo = request.additionalInfo;
        ticket.barcode = request.barcode;
        ticket.beginTime = request.date;
        ticket.bookingId = request.bookingId;
        ticket.date = request.date;
        ticket.doorsOpen = request.doorsOpen;
        ticket.eventName = request.eventName;
        ticket.locationAddress = request.locationAddress;
        ticket.locationName = request.locationName;

        const organizer: IOrganizerValue = await this.organizerRepository.getOrganizerByCompanyName(request.organizer);
        if (!organizer) {
            throw new ValidationError(this.localisationProvider.translate(LocalisationKey.OrganizerDoesntExist));
        }

        const userOrganizer = await this.userRepository.getUserByOrganizerId(organizer._id);
        if(userOrganizer.status == UserStatus.Deleted) {
            throw new ValidationError(this.localisationProvider.translate(LocalisationKey.OrganizerDoesntExist));   
        }

        ticket.organizerId = organizer._id;
        ticket.originalPrice = request.price;


        const qrUuid = getUUID();
        ticket.qrCode = await QRCode.toDataURL(request.qrCode || qrUuid); // image in base64 format or toString
        ticket.qrUuid = qrUuid;

        ticket.seat = request.seat;
        ticket.termsOfEvent = request.termsOfEvent;
        ticket.ticketId = request.ticketId;
        ticket.category = request.category;
        ticket.firstName = request.firstName.trim();
        ticket.lastName = request.lastName.trim();
        ticket.syncDate = moment().set({
            hour: 0,
            minute: 0,
            second: 0,
            millisecond: 0
        });

        const event: EventDbObject =
            await this.ticketSyncEventCreationProcess.checkSyncTicket(ticket, request.eventImage);

        ticket.eventId = event.id;

        const createTicketResponse = await this.ticketRepository.create(ticket);

        await this.ticketService.insertTicketTransaction(
            createTicketResponse['_id'],
            null,
            new Date(),
            ticket.userId,
            ticket.userId,
            ticket.status,
            ticket.status,
            TicketTransactionType.TicketCreatedFromExternalSystem
        );

        if (request.placeholderImages) {
            for (let index = 0; index < request.placeholderImages.length; index++) {
                await this.savePlaceholderImage(request.placeholderImages[index], createTicketResponse['_id']);
            }
        }

        //send email notification
        if (ticket.status === TicketStatus.NonPersonalized && user) {
            await this.ticketService.insertTicketAssignmentDeadline(user, ticket);
        }

        return new SyncTicketResponse();
    }

    public async returnTicket(request: ReturnTicketRequest): Promise<ReturnTicketResponse> {
        this.context.validateIfAuthenticated();
        request.validate(this.context.lang);
        const timeZone = await this.configService.getConfig("timeZone", "Europe/Vienna");

        const ticket: ITicketValue = await this.ticketRepository.getTicketById(request.id);
        this.ticketValidator.validateTicketOwner(this.context.userId, ticket);

        const organizer = await this.organizerRepository.getOrganizerById(ticket.organizerId);
        this.ticketValidator.validateReturnTicket(organizer.ticketReturn);

        //TODO insert in transactions before deletion
        //await this.ticketRepository.deleteObjectById(request.id);
        const user: IUserValue = await this.userRepository.getUserById(this.context.userId);

        //send email to organizer
        let response = new ReturnTicketResponse();

        let returnedTicketInformation = new ReturnTicketTemplate();
        returnedTicketInformation.companyName = organizer.companyName;
        returnedTicketInformation.firstName = user.firstname;
        returnedTicketInformation.lastName = user.lastname;
        returnedTicketInformation.fanSafeUsername = user.username;
        returnedTicketInformation.email = user.email;
        returnedTicketInformation.eventName = ticket.eventName;
        returnedTicketInformation.eventDate = InputDateParameterParseUtil.getDateInTimeZone(ticket.date, timeZone);
        returnedTicketInformation.location = ticket.locationAddress;
        returnedTicketInformation.locationName = ticket.locationName;
        returnedTicketInformation.seat = ticket.seat;
        returnedTicketInformation.ticketId = ticket.ticketId;
        returnedTicketInformation.bookingId = ticket.bookingId;
        returnedTicketInformation.ticketPrice = ticket.originalPrice;
        returnedTicketInformation.acceptedReturnPolicy = request.acceptedReturnPolicy;
        returnedTicketInformation.lang = this.context.lang;
        await this.emailSender.sendReturnTicketEmail(organizer.email, returnedTicketInformation);

        let previousTicketStatus: TicketStatus = ticket.status;
        ticket.status = TicketStatus.Returned;

        await this.ticketRepository.updateObjectById(ticket._id, new TicketDbObject(ticket));

        await this.ticketService.insertTicketTransaction(
            ticket._id,
            null,
            new Date(),
            ticket.userId,
            ticket.userId,
            previousTicketStatus,
            ticket.status,
            TicketTransactionType.TicketCreatedFromExternalSystem,
            request.reasonTicketReturn
        );

        return response;
    }

    public async getTicketDetails(request: GetTicketDetailsRequest): Promise<GetTicketDetailsResponse> {
        this.context.validateIfAuthenticated();
        const timeZone = await this.configService.getConfig("timeZone", "Europe/Vienna");

        const ticket = await this.ticketRepository.getTicketById(request.ticketId);
        const response = new GetTicketDetailsResponse();
        response.placeholderImages = await this.ticketService.getTicketPlaceholderImages(request.ticketId);

        const ticketHolderUser: IUserValue = ticket.userId ?
        await this.userRepository.getUserById(ticket.userId) : null;
    
        response.ticketHolder = ticketHolderUser ?
                            ticketHolderUser.firstname + ' ' + ticketHolderUser.lastname + ' / ' + ticketHolderUser.username : 
                            ticket.firstName + ' ' + ticket.lastName;


        response.ticketId = ticket.ticketId;
        response.bookingId = ticket.bookingId;
        response.originalPrice = ticket.originalPrice;
        response.category = ticket.category;
        response.priceCurrency = ticket.priceCurrency;
        response.eventName = ticket.eventName;
        response.eventId = ticket.eventId;
        response.locationName = ticket.locationName;
        response.locationAddress = ticket.locationAddress;
        response.date = InputDateParameterParseUtil.getDateInTimeZone(ticket.date, timeZone);
        response.beginTime = InputDateParameterParseUtil.getDateInTimeZone(ticket.beginTime, timeZone);
        response.doorsOpen = DoorsOpenTimeFormat.format(ticket.doorsOpen);
        response.termsOfEvent = ticket.termsOfEvent;
        response.seat = ticket.seat;

        response.qrCode = this.isQRAvailable(ticket.doorsOpen) ? ticket.qrCode : null;

        response.barcode = ticket.barcode;
        response.organizer = await (await this.organizerRepository.getOrganizerById(ticket.organizerId)).companyName;
        response.additionalInfo = ticket.additionalInfo;
        response.status = ticket.status;
        response.firstName = ticket.firstName;
        response.lastName = ticket.lastName;
        response.priceForSale = ticket.priceForSale;
        response.id = ticket._id;

        return response;
    }
    private isQRAvailable(doorsOpen: Date): boolean {
        const diff = moment(doorsOpen).diff(moment(), 'hours');
        console.log(diff, 'hours')
        return diff <= 1;
    }

    public async getTicketCategories(): Promise<GetTicketCategoriesResponse> {
        const response = new GetTicketCategoriesResponse();
        response.categories = [];

        const keys = Object.keys(TicketCategory).filter(k => typeof TicketCategory[k as any] === "number");
        const values = keys.map(k => TicketCategory[k as any]);

        for (let i = 0; i < keys.length; i++) {
            const categoryResponse = new GetCategoryResponse();
            categoryResponse.categoryName = keys[i];
            categoryResponse.categoryId = values[i].toString();

            response.categories.push(categoryResponse);
        }

        return response;
    }

    private async savePlaceholderImage(placeholderImage: Object, ticketId: string) {
        let image = new TicketPlaceholderImageDbObject();

        const smallImage = await this.imageCompressor.compressImage(placeholderImage['buffer']);

        image.ticketId = ticketId;
        image.image = smallImage || placeholderImage['buffer'];
        image.originalname = placeholderImage['originalname'];
        image.mimetype = placeholderImage['mimetype'];
        image.size = placeholderImage['size'];

        await this.ticketPlaceholderImageRepository.create(image);
    }
}