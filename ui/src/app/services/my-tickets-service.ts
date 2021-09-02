import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GetUpcomingEventsRequest } from './models/get-upcoming-events-request';
import { GetVisitedEventsRequest } from './models/get-visited-events-request';

import { Environment } from '../environments/environment';

@Injectable({
    providedIn: 'root'
})

export class MyTicketsService {

    constructor(private http: HttpClient){}

    getUpcomingEvents(request: GetUpcomingEventsRequest) {
        return this.http.post<any>(Environment.serviceUrl + '/tickets/upcomingevents', request);
    }
    getVisitedEvents(request: GetVisitedEventsRequest) {
        return this.http.post<any>(Environment.serviceUrl + '/tickets/visitedevents', request);
    }
}