import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Environment } from '../environments/environment';
import { ReserveTicketsRequest } from './models/reserve-tickets-request';
import { CancelReservationRequest } from './models/cancel-reservation-request';
import { GetPaymentDetailsRequest } from './models/get-payment-details-request';

@Injectable({
    providedIn: 'root'
})

export class BuyTicketService {

    constructor(private http: HttpClient){}

    reserveTickets(request: ReserveTicketsRequest) {
        return this.http.post<any>(Environment.serviceUrl + '/tickets/buytickets/reservetickets', request);
    }

    cancelReservation(request: CancelReservationRequest) {
        return this.http.post<any>(Environment.serviceUrl + '/tickets/buytickets/cancelreservation', request);
    }

    getAssigneeUsernames() {
        return this.http.get<any>(Environment.serviceUrl + '/usersandlinkedaccountsusernames');
    }

    getPaymentDetails(request: GetPaymentDetailsRequest) {
        return this.http.post<any>(Environment.serviceUrl + '/ticket/payment/details', request);
    }
}