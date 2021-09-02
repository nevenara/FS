import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { GetTicketDetailsRequest } from './models/get-ticket-details-request';
import { Environment } from '../environments/environment';


@Injectable({
    providedIn: 'root'
})

export class TicketDetailsService {
    
    constructor(private http: HttpClient){}
    getTicketDetails(request: GetTicketDetailsRequest) {
       // let params1 = new HttpParams().set("ticketId", request.ticketId)
        return this.http.post<any>(Environment.serviceUrl + '/tickets/ticketdetails', request);
    }

}
