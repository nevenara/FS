import { ITicketValidator } from "./ticket-validator";
import { IUserContext } from "../common/user-context";
import { ITicketRepository } from "./ticket-repository";
import { IUserRepository } from "../user/user-repository";
import { SellTicketsRequest } from "./model/sell-tickets-request";
import { SellTicketsResponse } from "./model/sell-tickets-response";
import { TicketDbObject } from "./model/ticket-db-object";
import { ITicketValue } from "./model/ticket";
import { TicketStatus } from "./model/ticket-status";
import { DeleteTicketSaleResponse } from "./model/delete-ticket-sale-response";
import { DeleteTicketSaleRequest } from "./model/delete-ticket-sale-request";
import { EditTicketSaleResponse } from "./model/edit-ticket-sale-response";
import { EditTicketSaleRequest } from "./model/edit-ticket-sale-request";
import { TicketOnSaleRequest } from "./model/ticket-on-sale-request";
import { GetUserTicketsFromSameEventRequest } from "./model/get-user-tickets-from-same-event-request";
import { GetUserTicketsFromSameEventResponse, TicketFromSameEvent } from "./model/get-user-tickets-from-same-event-response";
import { ValidationError } from "../common/errors/validation-error";
import { LocalisationKey } from "../localisation/localisation-key";
import { SearchTicketRepoRequest } from "./model/search-ticket-repo-request";
import { ITicketService } from "./ticket-service";
import { TicketTransactionType } from "../models/ticket-transaction-type";
import { ConfigService } from "../common/config-service";
import { GetTicketsForSaleFromSameEventRequest } from "./model/get-tickets-for-sale-from-same-event-request";
import { GetTicketsForSaleFromSameEventResponse, TicketForSaleFromSameEvent } from "./model/get-tickets-for-sale-from-same-event-response";
import { DoorsOpenTimeFormat } from "./model/doors-open-time-format";
import { InputDateParameterParseUtil } from "./model/input-date-parameter-parse";
import { ILocalisationProvider } from "../localisation/localisation-provider";
const moment = require('moment-timezone');

export interface ITicketSaleController {
    sellTickets(request: SellTicketsRequest): Promise<SellTicketsResponse>;
    editTicketSale(request: EditTicketSaleRequest): Promise<EditTicketSaleResponse>;
    deleteTicketSale(request: DeleteTicketSaleRequest): Promise<DeleteTicketSaleResponse>;
    getTicketsForSaleFromSameEvent(request: GetTicketsForSaleFromSameEventRequest): Promise<GetTicketsForSaleFromSameEventResponse>;
    getTicketsFromSameEvent(request: GetUserTicketsFromSameEventRequest): Promise<GetUserTicketsFromSameEventResponse>;
}

export class TicketSaleController implements ITicketSaleController {

    constructor(
        private context: IUserContext,
        private ticketRepository: ITicketRepository,
        private userRepository: IUserRepository,
        private ticketService: ITicketService,
        private configService: ConfigService,
        private ticketValidator: ITicketValidator,
        private localisationProvider: ILocalisationProvider
    ) {}

    public async sellTickets(request: SellTicketsRequest): Promise<SellTicketsResponse> {
        this.context.validateIfAuthenticated();
        request.validate(this.context.lang);

        await this.markTicketsForSale(request.tickets, TicketTransactionType.TicketAddedToTicketSale);

        return new SellTicketsResponse();
    }

    public async editTicketSale(request: EditTicketSaleRequest): Promise<EditTicketSaleResponse> {
        this.context.validateIfAuthenticated();
        request.validate(this.context.lang);

        await this.markTicketsForSale(request.tickets, TicketTransactionType.TicketSaleEdited);

        return new EditTicketSaleResponse();
    }

    public async deleteTicketSale(request: DeleteTicketSaleRequest): Promise<DeleteTicketSaleResponse> {
        this.context.validateIfAuthenticated();
        request.validate(this.context.lang);

        let deleteSaleTickets: Array<ITicketValue> = [];

        for (let i = 0; i < request.tickets.length; i++) {
            let ticket: ITicketValue = await this.ticketRepository.getTicketById(request.tickets[i]);

            await this.ticketValidator.validateDeleteSaleTicket(this.context.userId, ticket);
            
            ticket.priceForSale = null;

            deleteSaleTickets.push(ticket);
        }

        for (let i = 0; i < deleteSaleTickets.length; i++) {
            let previousTicketStatus: TicketStatus = deleteSaleTickets[i].status;
            deleteSaleTickets[i].status = TicketStatus.Personalized;

            await this.ticketRepository.updateObjectById(deleteSaleTickets[i]._id, new TicketDbObject(deleteSaleTickets[i]));   
            await this.ticketService.insertTicketTransaction(
                deleteSaleTickets[i]._id,
                deleteSaleTickets[i].userId,
                new Date(),
                deleteSaleTickets[i].userId,
                deleteSaleTickets[i].userId,
                previousTicketStatus,
                deleteSaleTickets[i].status,
                TicketTransactionType.TicketRemovedFromTicketSale
            );
        }

        return new DeleteTicketSaleResponse();
    }

    public async getTicketsForSaleFromSameEvent(request: GetTicketsForSaleFromSameEventRequest): Promise<GetTicketsForSaleFromSameEventResponse> {
        this.context.validateIfAuthenticated();
        request.validate(this.context.lang);
        const timeZone = await this.configService.getConfig("timeZone", "Europe/Vienna");

        const ticket = await this.ticketRepository.getTicketById(request.ticketId);

        if (!ticket) {
            throw new ValidationError(this.localisationProvider.translate(LocalisationKey.TicketDoesNotExist));
        }

        const linkedAccounts = await this.userRepository.getLinkedAccounts(this.context.userId);

        let linkedAccountsIds: Array<string> = [];

        if (linkedAccounts) {
            linkedAccounts.forEach(linkedAccount => {
                linkedAccountsIds.push(linkedAccount._id);
            });
        }

        let searchRequest = new SearchTicketRepoRequest(null);
        searchRequest.fromDate = ticket.date;
        searchRequest.toDate = ticket.date;
        searchRequest.eventName = ticket.eventName;
        searchRequest.beginTime = ticket.beginTime;
        searchRequest.linkedAccounts = linkedAccountsIds;
        searchRequest.userId = this.context.userId;
        searchRequest.status = [TicketStatus.ForSale];

        const tickets = await this.ticketRepository.search(searchRequest);

        let response = new GetTicketsForSaleFromSameEventResponse();

        response.beginTime = InputDateParameterParseUtil.getDateInTimeZone(ticket.beginTime, timeZone);
        response.bookingId = ticket.bookingId;
        response.date = InputDateParameterParseUtil.getDateInTimeZone(ticket.date, timeZone);
        response.doorsOpen = DoorsOpenTimeFormat.format(ticket.doorsOpen);
        response.eventName = ticket.eventName;
        response.location = ticket.locationAddress;
        response.originalPrice = ticket.originalPrice;
        response.priceCurrency = ticket.priceCurrency;
        response.seat = ticket.seat;
        response.ticketId = ticket.ticketId;
        response.eventId = ticket.eventId;

        response.tickets = [];

        tickets.tickets.forEach(t => {
            let ticketFromSameEvent: TicketForSaleFromSameEvent = new TicketForSaleFromSameEvent();
            ticketFromSameEvent.id = t._id;
            ticketFromSameEvent.priceForSale = t.priceForSale || null;
            ticketFromSameEvent.seat = t.seat;
            ticketFromSameEvent.ticketId = t.ticketId;
            response.tickets.push(ticketFromSameEvent);
        });

        return response;
    }

    public async getTicketsFromSameEvent(request: GetUserTicketsFromSameEventRequest): Promise<GetUserTicketsFromSameEventResponse> {
        this.context.validateIfAuthenticated();
        request.validate(this.context.lang);
        const timeZone = await this.configService.getConfig("timeZone", "Europe/Vienna");

        const ticket = await this.ticketRepository.getTicketById(request.ticketId);

        if (!ticket) {
            throw new ValidationError(this.localisationProvider.translate(LocalisationKey.TicketDoesNotExist));
        }

        const linkedAccounts = await this.userRepository.getLinkedAccounts(this.context.userId);

        let linkedAccountsIds: Array<string> = [];

        if (linkedAccounts) {
            linkedAccounts.forEach(linkedAccount => {
                linkedAccountsIds.push(linkedAccount._id);
            });
        }

        let searchRequest = new SearchTicketRepoRequest(null);
        searchRequest.fromDate = ticket.date;
        searchRequest.toDate = ticket.date;
        searchRequest.eventName = ticket.eventName;
        searchRequest.beginTime = ticket.beginTime;
        searchRequest.linkedAccounts = linkedAccountsIds;
        searchRequest.userId = this.context.userId;
        searchRequest.status = [TicketStatus.Personalized];

        const tickets = await this.ticketRepository.search(searchRequest);

        let response = new GetUserTicketsFromSameEventResponse();

        response.beginTime = InputDateParameterParseUtil.getDateInTimeZone(ticket.beginTime, timeZone);
        response.bookingId = ticket.bookingId;
        response.date = InputDateParameterParseUtil.getDateInTimeZone(ticket.date, timeZone);
        response.doorsOpen = DoorsOpenTimeFormat.format(ticket.doorsOpen);
        response.eventName = ticket.eventName;
        response.location = ticket.locationAddress;
        response.originalPrice = ticket.originalPrice;
        response.priceCurrency = ticket.priceCurrency;
        response.seat = ticket.seat;
        response.ticketId = ticket.ticketId;
        response.eventId = ticket.eventId;
        
        response.tickets = [];

        tickets.tickets.forEach(t => {
            let ticketFromSameEvent: TicketFromSameEvent = new TicketFromSameEvent();
            ticketFromSameEvent.id = t._id;
            ticketFromSameEvent.originalPrice = t.originalPrice;
            ticketFromSameEvent.seat = t.seat;
            ticketFromSameEvent.ticketId = t.ticketId;
            response.tickets.push(ticketFromSameEvent);
        });

        return response;
    }

    private async markTicketsForSale(tickets: Array<TicketOnSaleRequest>, ticketTransactionType: TicketTransactionType) {
        let ticketsForSale: Array<ITicketValue> = [];

        for (let i = 0; i < tickets.length; i++) {
            let ticket: ITicketValue = await this.ticketRepository.getTicketById(tickets[i].ticketId);

            await this.ticketValidator.validateTicketOnSale(this.context.userId, tickets[i], ticket);

            ticket.priceForSale = tickets[i].price;

            ticketsForSale.push(ticket);
        }

        for (let i = 0; i < ticketsForSale.length; i++) {
            let previousTicketStatus: TicketStatus = ticketsForSale[i].status;
            ticketsForSale[i].status = TicketStatus.ForSale;

            await this.ticketRepository.updateObjectById(ticketsForSale[i]._id, new TicketDbObject(ticketsForSale[i]));   
            await this.ticketService.insertTicketTransaction(
                ticketsForSale[i]._id,
                ticketsForSale[i].userId,
                new Date(),
                ticketsForSale[i].userId,
                ticketsForSale[i].userId,
                previousTicketStatus,
                ticketsForSale[i].status,
                ticketTransactionType
            );
        }
    }
}