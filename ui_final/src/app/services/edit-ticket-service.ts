import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Environment } from '../environments/environment';
import { GetDeleteTicketOnSaleRequest } from './models/get-delete-ticket-on-sale-request';
import { GetEditTicketOnSaleRequest } from './models/get-edit-ticket-on-sale-request';

@Injectable({
    providedIn: 'root'
})

export class EditTicketService {

    constructor(private http: HttpClient){}

    editTicketOnSale(request: GetEditTicketOnSaleRequest){
        return this.http.post<any>(Environment.serviceUrl + '/ticketsale/editticketsale', request);
    }

    deleteTicketOnSale(request: GetDeleteTicketOnSaleRequest) {
        return this.http.post<any>(Environment.serviceUrl + '/ticketsale/deleteticketsale', request);
    }
}