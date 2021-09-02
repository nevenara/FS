import { IAppLogger } from "../common/app-logger";
import { ConfigService } from "../common/config-service";
import { IEmailSender } from "../common/email-service/email-sender";
import { TicketAssignmentDeadlineTemplate, TicketAssignmentDeadlineType } from "../common/email-service/models/ticket-assignment-deadline-template";
import { ValidationError } from "../common/errors/validation-error";
import { LocalisationKey } from "../localisation/localisation-key";
import { ILocalisationProvider } from "../localisation/localisation-provider";
import { TicketAssignmentDeadlineStatus } from "../models/ticket-assignment-deadline-status";
import { TicketTransactionType } from "../models/ticket-transaction-type";
import { UserStatus } from "../models/user-status";
import { UserType } from "../models/user-type";
import { TicketAssignmentDeadlineDbObject } from "../ticket-assignment-deadlines/ticket-assignment-deadline-db-object";
import { ITicketAssignmentDeadlineRepository } from "../ticket-assignment-deadlines/ticket-assignment-deadline-repository";
import { ITicketPlaceholderImageRepository } from "../ticket-placeholder-image/ticket-placeholder-image-repository";
import { ITicketPlaceholderImageValue } from "../ticket-placeholder-image/ticket-placeholder-image-value";
import { TicketTransactionDbObject } from "../ticket-transactions/ticket-transaction-db-object";
import { ITicketTransactionRepository } from "../ticket-transactions/ticket-transaction-repository";
import { IUserRepository } from "../user/user-repository";
import { IUserValue } from "../user/user-value";
import { GetTicketPlaceholderImagesResponse } from "./model/get-ticket-placeholder-images-response";
import { PersonalizeMainAccountTicketsResponse } from "./model/personalize-main-account-tickets-request";
import { SearchTicketRepoRequest } from "./model/search-ticket-repo-request";
import { SearchTicketRepoResponse } from "./model/search-ticket-repo-response";
import { ITicketValue } from "./model/ticket";
import { TicketDbObject } from "./model/ticket-db-object";
import { TicketStatus } from "./model/ticket-status";
import { ITicketRepository } from "./ticket-repository";
const moment = require('moment-timezone');

export interface ITicketService {
    personalizeLinkedAccountTickets(linkedAccount: IUserValue): Promise<void>;
    personalizeMainAccountTickets(user: IUserValue): Promise<PersonalizeMainAccountTicketsResponse>;
    assignAlreadyStoredTickets(email: string, userId: string, isAdditional: boolean): Promise<void>;
    getTicketPlaceholderImages(ticketId: string): Promise<Array<GetTicketPlaceholderImagesResponse>>;
    insertTicketTransaction(
        ticketId: string,
        createdBy: string,
        createdOn: Date,
        previousOwner: string,
        newOwner: string,
        previousStatus: TicketStatus,
        newStatus: TicketStatus,
        transactionType: TicketTransactionType,
        description?: string);
    insertTicketAssignmentDeadline(user: IUserValue, ticket: TicketDbObject);
}

export class TicketService implements ITicketService {

    public constructor(
        private ticketRepository: ITicketRepository,
        private userRepository: IUserRepository,
        private placeholderImagesRepository: ITicketPlaceholderImageRepository,
        private ticketTransactionRepository: ITicketTransactionRepository,
        private ticketAssignmentDeadlineRepository: ITicketAssignmentDeadlineRepository,
        private emailSender: IEmailSender,
        private configService: ConfigService,
        private appLogger: IAppLogger,
        private localisationProvider: ILocalisationProvider
    ) {

    }

    public async personalizeLinkedAccountTickets(linkedAccount: IUserValue): Promise<void> {
        if (linkedAccount.usertype != UserType.LinkedAccount) {
            throw new ValidationError(this.localisationProvider.translate(LocalisationKey.InvalidUser));
        }

        if (linkedAccount.status == UserStatus.IdVerified) {
            let searchRequest: SearchTicketRepoRequest = new SearchTicketRepoRequest();
            searchRequest.userId = linkedAccount._id;
            searchRequest.status = [TicketStatus.NonPersonalized];

            let tickets = await this.ticketRepository.search(searchRequest);

            if (tickets) {
                for (let i = 0; i < tickets.tickets.length; i++) {
                    let previousTicketStatus: TicketStatus = tickets[i].status;
                    tickets[i].status = TicketStatus.Personalized;
                    tickets[i].pendingUsername = null;
                    await this.ticketRepository.updateObjectById(tickets[i]._id, new TicketDbObject(tickets[i]));
                    await this.insertTicketTransaction(
                        tickets[i]._id,
                        linkedAccount.mainAccountId,
                        new Date(),
                        linkedAccount._id,
                        linkedAccount._id,
                        previousTicketStatus,
                        tickets[i].status,
                        TicketTransactionType.TicketPesonalized,
                        tickets[i].organizerId
                    );
                }
            }
        }
    }

    public async personalizeMainAccountTickets(user: IUserValue): Promise<PersonalizeMainAccountTicketsResponse> {

        if (user.usertype != UserType.MainAccount) {
            throw new ValidationError(this.localisationProvider.translate(LocalisationKey.InvalidUser));
        }

        const response = new PersonalizeMainAccountTicketsResponse();
        response.userId = user._id;
        response.userStatus = user.status;

        if (user.status == UserStatus.IdVerified) {
            let searchRequest: SearchTicketRepoRequest = new SearchTicketRepoRequest();
            searchRequest.userId = user._id;
            searchRequest.status = [TicketStatus.Personalized, TicketStatus.NonPersonalized];
            searchRequest.firstName = user.firstname;
            searchRequest.lastName = user.lastname;

            let ticketsSearchResponse: SearchTicketRepoResponse =
                await this.ticketRepository.search(searchRequest);

            if (ticketsSearchResponse && ticketsSearchResponse.tickets.length) {
                response.totalTicketsPersonalized = ticketsSearchResponse.tickets.length;

                const nonPersonalizedTickets =
                    ticketsSearchResponse.tickets.filter(n => n.status == TicketStatus.NonPersonalized);

                for (let index = 0; index < nonPersonalizedTickets.length; index++) {
                    const nonPersonalizedTicket = nonPersonalizedTickets[index];

                    //check if there is already ticket for same event, location and date that is personalized.
                    const alreadyPersonalizedTicketFromSameEvent = ticketsSearchResponse.tickets.find(
                        n => n.status == TicketStatus.Personalized
                            && n.eventName === nonPersonalizedTicket.eventName
                            && n.date === nonPersonalizedTicket.date
                            && n.locationName === nonPersonalizedTicket.locationName);

                    if (!alreadyPersonalizedTicketFromSameEvent) {
                        let previousTicketStatus: TicketStatus = nonPersonalizedTicket.status;
                        nonPersonalizedTicket.status = TicketStatus.Personalized;
                        nonPersonalizedTicket.pendingUsername = null;
                        await this.ticketRepository.updateObjectById(nonPersonalizedTicket._id, new TicketDbObject(nonPersonalizedTicket));
                        await this.insertTicketTransaction(
                            nonPersonalizedTicket._id,
                            user._id,
                            new Date(),
                            user._id,
                            user._id,
                            previousTicketStatus,
                            nonPersonalizedTicket.status,
                            TicketTransactionType.TicketPesonalized,
                            nonPersonalizedTicket.organizerId
                        );
                    }
                }
            }
        }

        this.appLogger.log(JSON.stringify(response));

        return response;
    }

    public async assignAlreadyStoredTickets(email: string, userId: string, isAdditional: boolean): Promise<void> {
        const tickets = await this.ticketRepository.getTicketsByEmail(email);
        const user = await this.userRepository.getUserById(userId);

        if (tickets) {
            if (isAdditional) {
                //check for every ticket if there are more tickets for same event
                let additionalTickets = 0;

                for (let i = 0; i < tickets.length; i++) {
                    const t = tickets[i];
                    const searchTicketRequest = new SearchTicketRepoRequest();
                    searchTicketRequest.eventName = t.eventName;
                    searchTicketRequest.date = t.date;
                    searchTicketRequest.beginTime = t.beginTime;
                    searchTicketRequest.userId = userId;
                    let otherTickets = await this.ticketRepository.search(searchTicketRequest);

                    let previousTicketStatus: TicketStatus = t.status;
                    let previousTicketOwner: string = t.userId || null;
                    t.status = TicketStatus.NonPersonalized;

                    if (additionalTickets + otherTickets.tickets.length < 4) {
                        t.userId = userId;

                        //check if user has status IdVerified and this is his first ticket for himself                             
                        if (user.firstname == t.firstName && user.lastname == t.lastName && user.status == UserStatus.IdVerified) {
                            searchTicketRequest.firstName = user.firstname;
                            searchTicketRequest.lastName = user.lastname;
                            otherTickets = await this.ticketRepository.search(searchTicketRequest);

                            if (!otherTickets || otherTickets.tickets.length == 0) {
                                t.status = TicketStatus.Personalized;
                            }
                        }
                        await this.ticketRepository.updateObjectById(t._id, new TicketDbObject(t));
                        additionalTickets++;
                    }
                    else {
                        t.userId = userId;
                        t.status = TicketStatus.NotAvailable;
                        await this.ticketRepository.updateObjectById(t._id, new TicketDbObject(t));
                    }

                    await this.insertTicketTransaction(
                        t._id,
                        userId,
                        new Date(),
                        previousTicketOwner,
                        userId,
                        previousTicketStatus,
                        t.status,
                        TicketTransactionType.TicketPesonalized,
                        t.organizerId
                    );

                    //send email notification
                    if (t.status === TicketStatus.NonPersonalized && user) {
                        await this.insertTicketAssignmentDeadline(user, new TicketDbObject(t));
                    }

                }

            }
            else {
                for (let i = 0; i < tickets.length; i++) {
                    const t = tickets[i];

                    let previousTicketStatus: TicketStatus = t.status;
                    let previousTicketOwner: string = t.userId || null;

                    //TODO use config collection
                    if (i < 4) {
                        t.userId = userId;
                        await this.ticketRepository.updateObjectById(t._id, new TicketDbObject(t));
                    }
                    else {
                        t.userId = userId;
                        t.status = TicketStatus.NotAvailable;
                        await this.ticketRepository.updateObjectById(t._id, new TicketDbObject(t));
                    }

                    await this.insertTicketTransaction(
                        t._id,
                        userId,
                        new Date(),
                        previousTicketOwner,
                        userId,
                        previousTicketStatus,
                        t.status,
                        TicketTransactionType.TicketPesonalized,
                        t.organizerId,
                    );

                    //send email notification
                    if (t.status === TicketStatus.NonPersonalized && user) {
                        await this.insertTicketAssignmentDeadline(user, new TicketDbObject(t));
                    }
                }
            }

        }
    }

    public async getTicketPlaceholderImages(ticketId: string): Promise<Array<GetTicketPlaceholderImagesResponse>> {
        let placeholderImages: Array<GetTicketPlaceholderImagesResponse> = [];

        let placeholderImagesDb: Array<ITicketPlaceholderImageValue> = await this.placeholderImagesRepository.getImagesByTicketId(ticketId);

        if (placeholderImagesDb) {
            placeholderImagesDb.forEach(image => {
                const placeholderImage: GetTicketPlaceholderImagesResponse = new GetTicketPlaceholderImagesResponse();
                placeholderImage.image = Buffer.from(image.image).toString("base64");
                placeholderImage.mimetype = image.mimetype;
                placeholderImage.originalname = image.originalname;
                placeholderImages.push(placeholderImage);
            });
        }

        return placeholderImages;
    }

    public async insertTicketTransaction(
        ticketId: string,
        createdBy: string,
        createdOn: Date,
        previousOwner: string,
        newOwner: string,
        previousStatus: TicketStatus,
        newStatus: TicketStatus,
        transactionType: TicketTransactionType,
        organizerId: string,
        description: string = null
    ) {
        let ticketTransaction: TicketTransactionDbObject = new TicketTransactionDbObject();

        ticketTransaction.ticketId = ticketId;
        ticketTransaction.createdBy = createdBy;
        ticketTransaction.createdOn = createdOn;
        ticketTransaction.previousOwner = previousOwner;
        ticketTransaction.newOwner = newOwner;
        ticketTransaction.previousStatus = previousStatus;
        ticketTransaction.newStatus = newStatus;
        ticketTransaction.transactionType = transactionType;
        ticketTransaction.description = description;

        await this.ticketTransactionRepository.create(ticketTransaction);
    }

    public async insertTicketAssignmentDeadline(user: IUserValue, ticket: TicketDbObject) {
        let now = moment();
        const timeZone = await this.configService.getConfig("timeZone", "Europe/Vienna");

        const notification = new TicketAssignmentDeadlineTemplate();
        notification.firstName = user.firstname;
        notification.lastName = user.lastname;
        notification.event = ticket.eventName;
        notification.ticketId = ticket.ticketId;
        notification.bookingId = ticket.bookingId;
        notification.hours = 24;
        notification.date = moment.tz(ticket.date, timeZone).format('ddd DD-MMM-YYYY, HH:mm');
        notification.deadline = now.clone().add(notification.hours, 'hours').tz(timeZone).format('ddd DD-MMM-YYYY, HH:mm');
        notification.deadlineType = TicketAssignmentDeadlineType.AssignTicketHolder;

        await this.emailSender.sendTicketAssignmentDeadlineEmail(ticket.email, notification);

        //schedule other notification emails
        const deadline12: TicketAssignmentDeadlineDbObject = new TicketAssignmentDeadlineDbObject();
        const deadline24: TicketAssignmentDeadlineDbObject = new TicketAssignmentDeadlineDbObject();
        const deadline48: TicketAssignmentDeadlineDbObject = new TicketAssignmentDeadlineDbObject();
        const deadline72: TicketAssignmentDeadlineDbObject = new TicketAssignmentDeadlineDbObject();

        deadline12.ticketId = deadline24.ticketId = deadline48.ticketId = deadline72.ticketId = ticket.id;
        deadline12.status = deadline24.status = deadline48.status = deadline72.status = TicketAssignmentDeadlineStatus.Pending;
        deadline12.userId = deadline24.userId = deadline48.userId = deadline72.userId = user._id;

        //emailParams shoud contain same fields as TicketAssignmentDeadlineTemplate
        deadline12.emailParams = new TicketAssignmentDeadlineTemplate();
        deadline24.emailParams = new TicketAssignmentDeadlineTemplate();
        deadline48.emailParams = new TicketAssignmentDeadlineTemplate();
        deadline72.emailParams = new TicketAssignmentDeadlineTemplate();
        deadline12.emailParams['firstName'] = deadline24.emailParams['firstName'] = deadline48.emailParams['firstName'] = deadline72.emailParams['firstName'] = user.firstname;
        deadline12.emailParams['lastName'] = deadline24.emailParams['lastName'] = deadline48.emailParams['lastName'] = deadline72.emailParams['lastName'] = user.lastname;
        deadline12.emailParams['event'] = deadline24.emailParams['event'] = deadline48.emailParams['event'] = deadline72.emailParams['event'] = ticket.eventName;
        deadline12.emailParams['date'] = deadline24.emailParams['date'] = deadline48.emailParams['date'] = deadline72.emailParams['date'] = moment.tz(ticket.date, timeZone).format('ddd DD-MMM-YYYY, HH:mm');
        deadline12.emailParams['ticketId'] = deadline24.emailParams['ticketId'] = deadline48.emailParams['ticketId'] = deadline72.emailParams['ticketId'] = ticket.ticketId;
        deadline12.emailParams['bookingId'] = deadline24.emailParams['bookingId'] = deadline48.emailParams['bookingId'] = deadline72.emailParams['bookingId'] = ticket.bookingId;

        deadline12.emailParams['hours'] = 12; // reminder that user has 12 hours more to re-assign ticket
        deadline12.emailParams['deadlineType'] = TicketAssignmentDeadlineType.AssignTicketHolder;

        deadline24.emailParams['hours'] = 48; // 24 deadline missed, user has to contact support within new 48 hours
        deadline48.emailParams['hours'] = 24; // reminder that user has still 24 hours to contact support 
        deadline24.emailParams['deadlineType'] = deadline48.emailParams['deadlineType'] = TicketAssignmentDeadlineType.ContactSupport;

        deadline72.emailParams['hours'] = 72; // ticket blocked
        deadline72.emailParams['deadlineType'] = TicketAssignmentDeadlineType.TicketIsBlocked;

        //schedule dates for sending
        deadline12.deadlineDate = now.clone().add(12, 'hours').toDate();
        deadline24.deadlineDate = now.clone().add(24, 'hours').toDate();
        deadline48.deadlineDate = now.clone().add(48, 'hours').toDate();
        deadline72.deadlineDate = now.clone().add(72, 'hours').toDate();

        //deadlines for actions
        deadline12.emailParams['deadline'] = moment.tz(now.clone().add(12 + 12, 'hours'), timeZone).format('ddd DD-MMM-YYYY, HH:mm');
        deadline24.emailParams['deadline'] = moment.tz(now.clone().add(24 + 48, 'hours'), timeZone).format('ddd DD-MMM-YYYY, HH:mm');
        deadline48.emailParams['deadline'] = moment.tz(now.clone().add(24 + 48, 'hours'), timeZone).format('ddd DD-MMM-YYYY, HH:mm');


        await this.ticketAssignmentDeadlineRepository.create(deadline12);
        await this.ticketAssignmentDeadlineRepository.create(deadline24);
        await this.ticketAssignmentDeadlineRepository.create(deadline48);
        await this.ticketAssignmentDeadlineRepository.create(deadline72);

    }

}