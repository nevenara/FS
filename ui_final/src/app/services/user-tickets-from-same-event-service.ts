import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { GetTicketDetailsRequest } from './models/get-ticket-details-request';
import { Environment } from '../environments/environment';
import { GetUserTicketsFromSameEventRequest } from './models/get-user-tickets-from-same-event-request';


@Injectable({
    providedIn: 'root'
})

export class UserTicketsFromSameEventService {
    
    constructor(private http: HttpClient){}
    getUserTickets(request: GetUserTicketsFromSameEventRequest) {
        return this.http.post<any>(Environment.serviceUrl + '/ticketsale/getticketsfromsameevent', request);
    }

}
