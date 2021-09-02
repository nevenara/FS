import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Environment } from '../environments/environment';
import { GetNonPersonalizedTicketsByEventRequest } from './models/get-non-personalized-tickets-by-event-request';
import { ChangeFirstAndLastNameRequest } from './models/change-first-and-last-name-request';
import { SendEmailChangeFirstAndLastNameRequest } from './models/send-email-change-first-and-last-name-request';
import { GetNonPersonalizedTicketsRequest } from './models/get-non-personalized-tickets-request';
import { AssignTicketRequest } from './models/assign-ticket-request';
import { ChangeTicketHolderRequest } from './models/change-ticket-holder-request';


@Injectable({
    providedIn: 'root'
})

export class TicketPersonalizationService {

    constructor(private http: HttpClient){}

    getNonPersonalizedTickets(request: GetNonPersonalizedTicketsRequest) {
        return this.http.post<any>(Environment.serviceUrl + '/tickets/personalization/getnonpersonalizedtickets', request);
    }

    getNonPersonalizedTicketsByEvent(request: GetNonPersonalizedTicketsByEventRequest) {
        return this.http.post<any>(Environment.serviceUrl + '/tickets/personalization/getnonpersonalizedticketsbyevent', request);
    }

    changeFirstAndLastName(request: ChangeFirstAndLastNameRequest) {
        return this.http.post<any>(Environment.serviceUrl + '/tickets/personalization/changefirstandlastname', request);
    }

    SendEmailChangeFirstAndLastName(request: SendEmailChangeFirstAndLastNameRequest) {
        return this.http.post<any>(Environment.serviceUrl + '/tickets/personalization/sendemailchangefirstandlastname', request);
    }

    assignTicket(request: AssignTicketRequest) {
        return this.http.post<any>(Environment.serviceUrl + '/tickets/personalization/assigntickets', request);
    }

    changeTicketHolder(request: ChangeTicketHolderRequest) {
        return this.http.post<any>(Environment.serviceUrl + '/tickets/changeticketholder', request);
    }
}