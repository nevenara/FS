import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Environment } from '../../environments/environment';
import { SearchTicketsRequest } from './models/search-tickets-request';
import { GetAdminTicketDetailsRequest } from './models/get-admin-ticket-details-request';
import { SearchTicketChangeHistoryRequest } from './models/search-ticket-change-history-request';
import { AssignTicketRequest } from './models/assign-ticket-request';
import { SearchByFirstAndLastNameRequest } from './models/search-by-first-and-last-name-request';

@Injectable({
    providedIn: 'root'
})
export class TicketService {

    constructor(private http: HttpClient){}

    searchTickets(request: SearchTicketsRequest) {
        return this.http.post<any>(Environment.serviceUrl + '/tickets/adminpanel/search', request);
    }

    exportExcel(request: SearchTicketsRequest) {
        return this.http.post(Environment.serviceUrl + '/tickets/adminpanel/exportexcel', request, {responseType: "blob"});
    }

    exportCsv(request: SearchTicketsRequest) {
        return this.http.post(Environment.serviceUrl + '/tickets/adminpanel/exportcsv', request, {responseType: "blob"});
    }

    exportPdf(request: SearchTicketsRequest) {
        return this.http.post(Environment.serviceUrl + '/tickets/adminpanel/exportpdf', request, {responseType: "blob"});
    }

    getTicketDetails(request: GetAdminTicketDetailsRequest) {
        return this.http.get<any>(Environment.serviceUrl + '/tickets/adminpanel/details' + '?ticketId=' + request.ticketId);
    }

    searchTicketChangeHistory(request: SearchTicketChangeHistoryRequest) {
        return this.http.post<any>(Environment.serviceUrl + '/tickets/adminpanel/changehistory/search', request);
    }

    exportChangeHistoryExcel(request: SearchTicketChangeHistoryRequest) {
        return this.http.post(Environment.serviceUrl + '/tickets/adminpanel/changehistory/exportexcel', request, {responseType: "blob"});
    }

    exportChangeHistoryCsv(request: SearchTicketChangeHistoryRequest) {
        return this.http.post(Environment.serviceUrl + '/tickets/adminpanel/changehistory/exportcsv', request, {responseType: "blob"});
    }

    exportChangeHistoryPdf(request: SearchTicketChangeHistoryRequest) {
        return this.http.post(Environment.serviceUrl + '/tickets/adminpanel/changehistory/exportpdf', request, {responseType: "blob"});
    }

    assignTicket(request: AssignTicketRequest) {
        return this.http.post<any>(Environment.serviceUrl + '/tickets/adminpanel/assignment', request);
    }

    searchByFirstAndLastName(request: SearchByFirstAndLastNameRequest) {
        return this.http.post<any>(Environment.serviceUrl + '/tickets/adminpanel/searchbyfirstandlastname', request);
    }
}