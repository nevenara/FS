import { request } from "express";
import { ConfigService } from "../../common/config-service";
import { IUserContext } from "../../common/user-context";
import { SearchEventsByUserRepoRequest } from "../../event-calendar/models/search-events-by-user-repo-request";
import { IEventRepository } from "../../events/event-repository";
import { UserType } from "../../models/user-type";
import { IOrganizerRepository } from "../../organizer/organizer-repository";
import { SearchTicketRepoRequest } from "../../tickets/model/search-ticket-repo-request";
import { ITicketRepository } from "../../tickets/ticket-repository";
import { GetDistributionOfIncomingTicketsResponse } from "./models/get-distibution-of-incoming-tickets-response";
import { BillingRow, GetTicketListBillingResponse } from "./models/get-ticket-list-billing-response";
import { GetTotalEventsByOrganizerResponse } from "./models/get-total-events-by-organizer-response";
import { GetTotalIncomeResponse } from "./models/get-total-income-response";
import { GetTotalIncomingTicketsBillingResponse } from "./models/get-total-incoming-tickets-billing-response";
import { SearchEventLocationsOrganizersBillingRequest } from "./models/search-event-location-organizers-billing-request";
import { SearchEventLocationsOrganizersBillingResponse } from "./models/search-event-locations-organizers-billing-response";
import { SearchEventNamesOrganizersBillingRequest } from "./models/search-event-names-organizers-billing-request";
import { SearchEventNamesOrganizersBillingResponse } from "./models/search-event-names-organizers-billing-response";
import { SearchEventOrganizersBillingRequest } from "./models/search-events-organizers-billing-request";
import moment = require("moment-timezone");
import { InputDateParameterParseUtil } from "../../tickets/model/input-date-parameter-parse";

export interface IOrganizersBillingController {
    getTicketList(request: SearchEventOrganizersBillingRequest): Promise<GetTicketListBillingResponse>;
    getDistributionOfTicketsByPrices(request: SearchEventOrganizersBillingRequest): Promise<GetDistributionOfIncomingTicketsResponse>;
    getTotalIncome(request: SearchEventOrganizersBillingRequest): Promise<GetTotalIncomeResponse>;
    getEventNamesByOrganizer(request: SearchEventNamesOrganizersBillingRequest): Promise<SearchEventNamesOrganizersBillingResponse>;
    getEventLocationsByOrganizer(request: SearchEventLocationsOrganizersBillingRequest): Promise<SearchEventLocationsOrganizersBillingResponse>;
    getTotalTicketsForEvents(request: SearchEventOrganizersBillingRequest): Promise<GetTotalIncomingTicketsBillingResponse>;
    getTotalEventsByOrganizer(reuqest: SearchEventOrganizersBillingRequest): Promise<GetTotalEventsByOrganizerResponse>;
}

export class OrganizersBillingController implements IOrganizersBillingController {
    
    constructor(
        private context: IUserContext,
        private eventRepository: IEventRepository,
        private organizerRepository: IOrganizerRepository,
        private ticketRepository: ITicketRepository,
        private configService: ConfigService
    ){}
    
    public async getTicketList(request: SearchEventOrganizersBillingRequest): Promise<GetTicketListBillingResponse> {
        this.context.validateIfAuthenticated();
        this.context.validateAuthorization([UserType.SuperAdmin]);
        const results = await this.ticketRepository.getGroupedTicketsByPrice(request);

        const events = await this.eventRepository.searchEventsByOrganizer(request);

        const response = new GetTicketListBillingResponse();
        response.rows = [];
        response.eventDate = '';
        response.eventName = '';
        response.ticketsTotal = 0;
        response.totalSum = 0;
        
        if (events.length == 1) {
            const timeZone = await this.configService.getConfig("timeZone", "Europe/Vienna");

            response.eventName = events[0].eventName;
            response.eventDate =  InputDateParameterParseUtil.getDateInTimeZone(events[0].date, timeZone);;
        }
        
        for (let i = 0; i < results.length; i++) {
            const res = results[i];

            const row = new BillingRow();
            row.ticketPrice = res._id.price;
            row.amountOfTickets = res.amountOfTickets;
            row.fee = +this.getFee(res._id.price).toFixed(2);
            row.subTotal = +(row.amountOfTickets * row.fee).toFixed(2);

            response.ticketsTotal += row.amountOfTickets;
            response.totalSum += +row.subTotal.toFixed(2);
            
            response.rows.push(row);
            
        }

        return response;
    }
    
    public async getDistributionOfTicketsByPrices(request: SearchEventOrganizersBillingRequest): Promise<GetDistributionOfIncomingTicketsResponse> {
        this.context.validateIfAuthenticated();
        this.context.validateAuthorization([UserType.SuperAdmin]);
        const results = await this.ticketRepository.getTotalIncomingTicketsByEvents(request);

        const response = new GetDistributionOfIncomingTicketsResponse();
        response.firstCount = response.secondConut = response.thirdCount = 0;

        for (let i = 0; i < results.length; i++) {
            const t = results[i];
            if(t.originalPrice <= 30.00 ){
                response.firstCount++;
            }
            else if(t.originalPrice >= 30.01 && t.originalPrice <= 49.99) {
                response.secondConut++;
            }
            else if (t.originalPrice >= 50) {
                response.thirdCount++;
            }
            
        }
        return response;

    }
    
    public async getTotalIncome(request: SearchEventOrganizersBillingRequest): Promise<GetTotalIncomeResponse> {
        this.context.validateIfAuthenticated();
        this.context.validateAuthorization([UserType.SuperAdmin]);
        const results = await this.ticketRepository.getTotalIncomingTicketsByEvents(request);

        const response = new GetTotalIncomeResponse();
        response.income = 0.0;

        for (let i = 0; i < results.length; i++) {
            const t = results[i];
            response.income += this.getFee(t.originalPrice);
            
        }

        response.income = +response.income.toFixed(2);
        return response;
    }
    
    public async getEventNamesByOrganizer(request: SearchEventNamesOrganizersBillingRequest): Promise<SearchEventNamesOrganizersBillingResponse> {
        this.context.validateIfAuthenticated();
        this.context.validateAuthorization([UserType.SuperAdmin]);

        const repoRequest = new SearchEventOrganizersBillingRequest();
        repoRequest.locations = request.locations;
        repoRequest.dateFrom = request.dateFrom;
        repoRequest.dateTo = request.dateTo;
        repoRequest.organizerId = request.organizerId;

        const results = await this.eventRepository.searchEventsByOrganizer(repoRequest);
        const response = new SearchEventNamesOrganizersBillingResponse();
        response.eventNames = [];
        for (let i = 0; i < results.length; i++) {
            const e = results[i];

            if (response.eventNames.indexOf(e.eventName) === -1) {
                response.eventNames.push(e.eventName);
            }
        }
        return response;
    }
    
    public async getEventLocationsByOrganizer(request: SearchEventLocationsOrganizersBillingRequest): Promise<SearchEventLocationsOrganizersBillingResponse> {
        this.context.validateIfAuthenticated();
        this.context.validateAuthorization([UserType.SuperAdmin]);

        const repoRequest = new SearchEventOrganizersBillingRequest();
        repoRequest.eventNames = request.eventNames;
        repoRequest.dateFrom = request.dateFrom;
        repoRequest.dateTo = request.dateTo;
        repoRequest.organizerId = request.organizerId;

        const results = await this.eventRepository.searchEventsByOrganizer(repoRequest);
        const response = new SearchEventLocationsOrganizersBillingResponse();
        response.locations = [];
        for (let i = 0; i < results.length; i++) {
            const e = results[i];

            if (response.locations.indexOf(e.locationName) === -1) {
                response.locations.push(e.locationName);
            }
        }
        return response;
    }
    
    public async getTotalTicketsForEvents(request: SearchEventOrganizersBillingRequest): Promise<GetTotalIncomingTicketsBillingResponse> {
        this.context.validateIfAuthenticated();
        this.context.validateAuthorization([UserType.SuperAdmin]);

       const results = await this.ticketRepository.getTotalIncomingTicketsByEvents(request);

        const response = new GetTotalIncomingTicketsBillingResponse();
        response.total = results.length;
        return response;
    }

    public async getTotalEventsByOrganizer(request: SearchEventOrganizersBillingRequest): Promise<GetTotalEventsByOrganizerResponse> {
        this.context.validateIfAuthenticated();
        this.context.validateAuthorization([UserType.SuperAdmin]);
        const events = await this.eventRepository.searchEventsByOrganizer(request);

        const response: GetTotalEventsByOrganizerResponse = new GetTotalEventsByOrganizerResponse();
        response.total = events.length;
        return response;
    }

    private getFee(originalPrice: number): number {

        if(originalPrice <= 30.00 ){
            return 3.0;
        }
        else if(originalPrice >= 30.01 && originalPrice <= 49.99) {
            return 0.1 * originalPrice;
        }
        else if (originalPrice >= 50) {
            return 5.0;
        }

        return 0.0;
    }
}
