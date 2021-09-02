import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Environment } from '../environments/environment';
import { GetSellTicketRequest } from './models/get-sell-ticket-request';

@Injectable({
    providedIn: 'root'
})

export class SellTicketService {

    constructor(private http: HttpClient){}

    sellTicket(request: GetSellTicketRequest){
        return this.http.post<any>(Environment.serviceUrl + '/ticketsale/selltickets', request);
    }

}