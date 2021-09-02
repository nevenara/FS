import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Environment } from '../environments/environment';
import { ReturnTicketRequest } from './models/get-return-ticket-request';

@Injectable({
    providedIn: 'root'
})

export class ReturnTicketService {

    constructor(private http: HttpClient){}

    returnTicket(request: ReturnTicketRequest){
        return this.http.post<any>(Environment.serviceUrl + '/tickets/returnticket', request);
    }

}
