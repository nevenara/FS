import moment = require("moment-timezone");
import { report } from "process";
import { ConfigService } from "../common/config-service";
import { ValidationError } from "../common/errors/validation-error";
import { SortUtil } from "../common/sort";
import { IUserContext } from "../common/user-context";
import { LocalisationKey } from "../localisation/localisation-key";
import { ILocalisationProvider } from "../localisation/localisation-provider";
import { UserType } from "../models/user-type";
import { IOrganizerRepository } from "../organizer/organizer-repository";
import { IUserRepository } from "../user/user-repository";
import { IUserValue } from "../user/user-value";
import { DoorsOpenTimeFormat } from "./model/doors-open-time-format";
import { EventResponse, GetEventsResponse } from "./model/get-events-response";
import { GetMarketplaceLocationsResponse } from "./model/get-locations-response";
import { GetMarketplacePriceRangeResponse } from "./model/get-marketplace-price-range-response";
import { SearchAdminPanelTicketsRepoRequest } from "./model/search-admin-panel-tickets-repo-request";
import { SearchAdminPanelTicketsRequest } from "./model/search-admin-panel-tickets-request";
import { SearchMySaleTicketsRequest } from "./model/search-my-sale-tickets-request";
import { SearchSaleTicketsRequest } from "./model/search-sale-tickets-request";
import { SearchTicketRepoRequest } from "./model/search-ticket-repo-request";
import { SearchTicketsRequest } from "./model/search-ticket-request";
import { SearchTicketResponse, SearchTicketsResponse } from "./model/search-ticket-response";
import { ITicketValue } from "./model/ticket";
import { TicketStatus } from "./model/ticket-status";
import { TicketStatusAdminPanel } from "./model/ticket-status-admin-panel";
import { ITicketRepository } from "./ticket-repository";
import { ITicketService } from "./ticket-service";

export interface ISearchTicketController {
    searchAdminPanelTickets(request: SearchAdminPanelTicketsRequest): Promise<SearchTicketsResponse>;
    searchTickets(request: SearchTicketsRequest): Promise<SearchTicketsResponse>;
    searchSaleTicketsByUserAndLinkedAccounts(request: SearchMySaleTicketsRequest): Promise<SearchTicketsResponse>;
    searchSaleTickets(request: SearchSaleTicketsRequest): Promise<SearchTicketsResponse>;
    getUpcomingEvents(request: SearchTicketsRequest): Promise<GetEventsResponse>;
    getVisitedEvents(request: SearchTicketsRequest): Promise<GetEventsResponse>;
    getMarketplaceLocations(): Promise<GetMarketplaceLocationsResponse>;
    getPriceRange(): Promise<GetMarketplacePriceRangeResponse>;
}

export class SearchTicketController implements ISearchTicketController {

    constructor(
        private context: IUserContext,
        private ticketRepository: ITicketRepository,
        private userRepository: IUserRepository,
        private organizerRepository: IOrganizerRepository,
        private ticketService: ITicketService,
        private configService: ConfigService,
        private localisationProvider: ILocalisationProvider) {
    }

    public async searchTickets(request: SearchTicketsRequest): Promise<SearchTicketsResponse> {
        this.context.validateIfAuthenticated();
        const LIMIT = await this.configService.getConfig('pageLimit', 6);
        const response = new SearchTicketsResponse();

        const repoRequest = new SearchTicketRepoRequest(request);
        repoRequest.notPending = true;
        repoRequest.userId = this.context.userId;

        repoRequest.status = request.status;

        //pagination
        if (request.page) {
            repoRequest.page = request.page;
            repoRequest.limit = LIMIT;
        }

        const linkedAccounts: Array<IUserValue> = await this.userRepository.getLinkedAccounts(this.context.userId);

        if (linkedAccounts) {
            repoRequest.linkedAccounts = linkedAccounts.map(n => { return n._id.toString(); });
        }


        if (request.showLinkedAccountsFilter) {
            repoRequest.linkedAccountsTicket = true;
            //we do not want to show current user's tickets only from his linked accounts..
            repoRequest.userId = null;
        }

        if (request.showTicketsOnSaleFilter || request.showTicketsWithRepersonalizationInProgress
            || request.showWaitingForPayment || request.showLinkedAccountsFilter) {

           repoRequest.status = [];

           if (request.showTicketsOnSaleFilter){
                repoRequest.status.push(TicketStatus.ForSale);
                repoRequest.userId = this.context.userId;
           }

           if (request.showTicketsWithRepersonalizationInProgress) {
               repoRequest.status.push(TicketStatus.RePersonalisationWaiting);
               repoRequest.userId = this.context.userId;
           }

           if (request.showWaitingForPayment) {
            repoRequest.status.push(TicketStatus.WaitingForPaymentStatus);
            repoRequest.userId = this.context.userId;

           }
        }

        repoRequest.categories = request.categories;


        const res = await this.ticketRepository.search(repoRequest);

        response.tickets = res.tickets;
        response.totalPages = res.totalPages;

        return response;
    }

    public async searchAdminPanelTickets(request: SearchAdminPanelTicketsRequest): Promise<SearchTicketsResponse> {
        this.context.validateIfAuthenticated();
        this.context.validateAuthorization([UserType.Admin, UserType.SuperAdmin, UserType.SupportLevel1, UserType.SupportLevel2, UserType.EventManager]);

        if (request.limit && request.limit > 50) {
            throw new ValidationError(this.localisationProvider.translate(LocalisationKey.LimitPerPageIs50));
        }

        const LIMIT = request.limit || await this.configService.getConfig('pageLimit', 10);

        const response = new SearchTicketsResponse();

        const repoRequest = new SearchAdminPanelTicketsRepoRequest();

        repoRequest.page = request.page || 1;
        repoRequest.limit = LIMIT;

        repoRequest.eventName = request.eventName;
        repoRequest.eventLocation = request.eventLocation;
        repoRequest.fromDate = request.fromDate;
        repoRequest.toDate = request.toDate;
        repoRequest.ticketId = request.ticketId;
        repoRequest.organizer = request.organizer;
        repoRequest.ticketBuyer = request.ticketBuyer;
        repoRequest.ticketHolder = request.ticketHolder;
        repoRequest.bookingId = request.bookingId;
        repoRequest.sortField = request.sortField;
        repoRequest.sortOrder = request.sortOrder;

        if (request.status && request.status.length != 0) {
            repoRequest.status = [];

            if (request.status.includes(TicketStatusAdminPanel.Personalized)) {
                repoRequest.status.push(TicketStatus.Personalized);
                repoRequest.status.push(TicketStatus.ForSale);
                repoRequest.status.push(TicketStatus.RePersonalisationWaiting);
                repoRequest.status.push(TicketStatus.WaitingForPaymentStatus);
            }

            if (request.status.includes(TicketStatusAdminPanel.PersonalizationPending)) {
                repoRequest.status.push(TicketStatus.NonPersonalized);
                repoRequest.personalizationPending = true;
            }

            if (request.status.includes(TicketStatusAdminPanel.BlockedForPickup)) {
                repoRequest.status.push(TicketStatus.NonPersonalized);
                repoRequest.blocked = true;
            }

            if(request.status.includes(TicketStatusAdminPanel.CheckedIn)) {
                repoRequest.status.push(TicketStatus.CheckedIn);
            }

            if(request.status.includes(TicketStatusAdminPanel.PersonalizationFailed)) {
                repoRequest.status.push(TicketStatus.NonPersonalized);
                repoRequest.personalizationFailed = true;
            }
        }

        const res = await this.ticketRepository.searchAdminPanelTickets(repoRequest);

        response.tickets = res.tickets;
        for (let i = 0; i < response.tickets.length; i++) {
            const t = response.tickets[i];
            let status = null;
           
            const user = t.userId ? await this.userRepository.getUserById(t.userId) : null;


            if(t.status == TicketStatus.ForSale || t.status == TicketStatus.Personalized || 
                t.status == TicketStatus.RePersonalisationWaiting || t.status == TicketStatus.WaitingForPaymentStatus) {
               status = TicketStatusAdminPanel.Personalized;
            }
            else if(t.status == TicketStatus.CheckedIn) {
                status = TicketStatusAdminPanel.CheckedIn;
            }
            else if (t.status == TicketStatus.NonPersonalized){
                if(user && user.stripeErrors && user.stripeErrors.length ) {
                    status = TicketStatusAdminPanel.PersonalizationFailed;
                }
                else if(t.pendingUsername){
                    status = TicketStatusAdminPanel.PersonalizationPending;
                }
                else if(this.isBlocked(t.syncDate)) {
                    status = TicketStatusAdminPanel.BlockedForPickup;
                }
                else {
                    console.log(t.syncDate)
                    status = TicketStatusAdminPanel.PersonalizationPending;
                }
    
                
            }

            t.status = status;

        }

        response.totalPages = res.totalPages;
        response.totalRecords = res.totalRecords;

        return response;
    }

    public async searchSaleTicketsByUserAndLinkedAccounts(request: SearchMySaleTicketsRequest): Promise<SearchTicketsResponse> {
        this.context.validateIfAuthenticated();
        const LIMIT = await this.configService.getConfig('pageLimit', 6);
        const TIME_ZONE = await this.configService.getConfig("timeZone", "Europe/Vienna");

        const response = new SearchTicketsResponse();
        const repoRequest = new SearchTicketRepoRequest(null);
        repoRequest.userId = this.context.userId;
        repoRequest.status = new Array<TicketStatus>();
        repoRequest.status.push(TicketStatus.ForSale);
        repoRequest.eventName = request.eventName;
        repoRequest.fromDate = request.fromDate;
        repoRequest.toDate = request.toDate;
        repoRequest.categories = request.categories;

        //pagination
        if (request.page) {
            repoRequest.page = request.page;
            repoRequest.limit = LIMIT;
        }

        const linkedAccounts: Array<IUserValue> = await this.userRepository.getLinkedAccounts(this.context.userId);

        if (linkedAccounts) {
            repoRequest.linkedAccounts = linkedAccounts.map(n => { return n._id; });
        }

        const res = await this.ticketRepository.search(repoRequest);

        response.tickets = [];

        response.tickets = [];
        for (let i = 0; i < res.tickets.length; i++) {
            const t = res.tickets[i];

            const ticketResponse: SearchTicketResponse = new SearchTicketResponse();

            ticketResponse.id = t._id;
            ticketResponse.eventName = t.eventName;
            ticketResponse.eventId = t.eventId;
            ticketResponse.date = moment.tz(t.date, TIME_ZONE).format();
            ticketResponse.beginTime = t.beginTime;
            ticketResponse.eventName = t.eventName;
            ticketResponse.doorsOpen = DoorsOpenTimeFormat.format(t.doorsOpen);
            ticketResponse.locationAddress = t.locationAddress;
            ticketResponse.locationName = t.locationName;
            let organizer = await this.organizerRepository.getOrganizerById(t.organizerId);
            ticketResponse.organizer = organizer.companyName;
            ticketResponse.seat = t.seat;
            ticketResponse.priceForSale = t.priceForSale;

            response.tickets.push(ticketResponse);
        }
        response.totalPages = res.totalPages;

        return response;
    }

    public async searchSaleTickets(request: SearchSaleTicketsRequest): Promise<SearchTicketsResponse> {
        this.context.validateIfAuthenticated();
        const LIMIT = await this.configService.getConfig('pageLimit', 6);
        const TIME_ZONE = await this.configService.getConfig("timeZone", "Europe/Vienna");

        const response = new SearchTicketsResponse();
        const repoRequest = new SearchTicketRepoRequest(request);

        repoRequest.userId = this.context.userId;

        repoRequest.status = new Array<TicketStatus>();
        repoRequest.status.push(TicketStatus.ForSale);
        repoRequest.categories = request.categories;
        repoRequest.locations = request.locations;
        repoRequest.eventName = request.eventName;
        repoRequest.fromPrice = request.fromPrice;
        repoRequest.toPrice = request.toPrice;
        repoRequest.marketplace = true;

        //pagination
        if (request.page) {
            repoRequest.page = request.page;
            repoRequest.limit = LIMIT;
        }

        const linkedAccounts: Array<IUserValue> = await this.userRepository.getLinkedAccounts(this.context.userId);

        if (linkedAccounts) {
            repoRequest.linkedAccounts = linkedAccounts.map(n => { return n._id; });
        }

        const res = await this.ticketRepository.search(repoRequest);

        response.tickets = [];

        response.tickets = [];
        for (let i = 0; i < res.tickets.length; i++) {
            const t = res.tickets[i];

            const ticketResponse: SearchTicketResponse = new SearchTicketResponse();

            ticketResponse.id = t._id;
            ticketResponse.eventId = t.eventId;
            ticketResponse.eventName = t.eventName;
            ticketResponse.date = moment.tz(t.date, TIME_ZONE).format();
            ticketResponse.beginTime = t.beginTime;
            ticketResponse.eventName = t.eventName;
            ticketResponse.doorsOpen = DoorsOpenTimeFormat.format(t.doorsOpen);
            ticketResponse.locationAddress = t.locationAddress;
            ticketResponse.locationName = t.locationName;
            let organizer = await this.organizerRepository.getOrganizerById(t.organizerId);
            ticketResponse.organizer = organizer.companyName;
            ticketResponse.seat = t.seat;
            ticketResponse.priceForSale = t.priceForSale;
            ticketResponse.reserved = t.reservedOn && t.reservedOn != this.context.userId && t.reservationExpirationDate && t.reservationExpirationDate > moment().toDate();

            response.tickets.push(ticketResponse);
        }
        response.totalPages = res.totalPages;

        return response;
    }

    public async getUpcomingEvents(request: SearchTicketsRequest): Promise<GetEventsResponse> {
        request.fromDate = request.fromDate || moment().toDate();

        request.status = [
            TicketStatus.ForSale,
            TicketStatus.Personalized,
            TicketStatus.RePersonalisationWaiting,
            TicketStatus.WaitingForPaymentStatus,
            TicketStatus.CheckedIn
        ];

        const response = await this.getEvents(request, true);
        return response;
    }

    public async getVisitedEvents(request: SearchTicketsRequest): Promise<GetEventsResponse> {
        request.toDate = request.toDate || moment().toDate();
        request.status = [TicketStatus.ForSale, TicketStatus.Personalized, TicketStatus.RePersonalisationWaiting, TicketStatus.CheckedIn];

        const response = await this.getEvents(request, false);
        return response;
    }

    public async getMarketplaceLocations(): Promise<GetMarketplaceLocationsResponse> {
        this.context.validateIfAuthenticated();
        const response: GetMarketplaceLocationsResponse = new GetMarketplaceLocationsResponse();
        response.locations = [];

        const repoRequest = new SearchTicketRepoRequest();

        repoRequest.userId = this.context.userId;

        repoRequest.status = new Array<TicketStatus>();
        repoRequest.status.push(TicketStatus.ForSale);
        repoRequest.marketplace = true;

        let repoResponse = await this.ticketRepository.search(repoRequest);
        for (let i = 0; i < repoResponse.tickets.length; i++) {
            const t = repoResponse.tickets[i];

            if (response.locations.indexOf(t.locationName) === -1) {
                response.locations.push(t.locationName);
            }
        }

        return response;
    }

    public async getPriceRange(): Promise<GetMarketplacePriceRangeResponse> {
        this.context.validateIfAuthenticated();
        const response: GetMarketplacePriceRangeResponse = new GetMarketplacePriceRangeResponse();


        const repoRequest = new SearchTicketRepoRequest();

        repoRequest.userId = this.context.userId;

        repoRequest.status = new Array<TicketStatus>();
        repoRequest.status.push(TicketStatus.ForSale);
        repoRequest.marketplace = true;

        let repoResponse = await this.ticketRepository.search(repoRequest);
        const prices = repoResponse.tickets.map(n => { return n.priceForSale; });

        response.maxPrice = Math.max.apply(Math, prices);
        response.minPrice = Math.min.apply(Math, prices);
        return response;
    }


    private async getEvents(request: SearchTicketsRequest, upcomingFlag: boolean): Promise<GetEventsResponse> {
        const TIME_ZONE = await this.configService.getConfig("timeZone", "Europe/Vienna");

        const response = new GetEventsResponse();
        const searchTicketResponse = await this.searchTickets(request);

        response.tickets = [];
        for (let i = 0; i < searchTicketResponse.tickets.length; i++) {
            const t = searchTicketResponse.tickets[i] as ITicketValue;

            const eventResponse = new EventResponse();
            eventResponse.id = t._id;
            eventResponse.eventName = t.eventName;

            const organizer = await this.organizerRepository.getOrganizerById(t.organizerId);

            if (organizer) {
                eventResponse.organizer = organizer.companyName;
                if (upcomingFlag) {
                    eventResponse.returnAllowed = organizer.ticketReturn;
                }

            }


            eventResponse.date = moment.tz(t.date, TIME_ZONE).format();
            eventResponse.beginTime = t.beginTime;
            eventResponse.locationAddress = t.locationAddress;
            eventResponse.locationName = t.locationName;
            eventResponse.seat = t.seat;
            eventResponse.ticketOnSale = t.status === TicketStatus.ForSale;
            eventResponse.repersonalizationWaiting = t.status === TicketStatus.RePersonalisationWaiting;
            eventResponse.waitingForPayment = t.status === TicketStatus.WaitingForPaymentStatus;
            eventResponse.linkedAccountsTicket = t.userId != this.context.userId;
            eventResponse.doorsOpen = DoorsOpenTimeFormat.format(t.doorsOpen);
            eventResponse.linkedAccountFirstName = t.firstName;
            eventResponse.linkedAccountLastName = t.lastName;
            eventResponse.eventId = t.eventId;
            response.tickets.push(eventResponse);
        }
        response.totalPages = searchTicketResponse.totalPages;
        return response;
    }

    private isBlocked(syncDate: Date): boolean {
        const diff = moment().diff(syncDate, 'hours');

        return diff > 48;
    }
}