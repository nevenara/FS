import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GetTicketDetailsRequest } from './models/get-ticket-details-request';
import { Environment } from '../environments/environment';
import { GetUsernamesAndEmailsRequest } from './models/get-usernames-and-emails-request';


@Injectable({
    providedIn: 'root'
})

export class TicketDetailsForRepersonalizationService {
    
    constructor(private http: HttpClient){}

    getUserTickets(request: GetTicketDetailsRequest) {
        return this.http.post<any>(Environment.serviceUrl + '/tickets/ticketdetailsforrepersonalization', request);
    }

    getPaymentDetails() {
        return this.http.post<any>(Environment.serviceUrl + '/ticket/repersonalization/details', null);
    }

    getUsernamesAndEmails(request: GetUsernamesAndEmailsRequest) {
        return this.http.post<any>(Environment.serviceUrl + '/tickets/getusernamesandemailsrepersonalization', request);
    }

}
