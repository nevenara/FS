import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Environment } from '../environments/environment';
import { GetEventsByDayRequest } from './models/get-events-by-day-request';
import { GetEventsByMonthRequest } from './models/get-events-by-month-request';
import { GetEventsByWeekRequest } from './models/get-events-by-week-request';

@Injectable({
    providedIn: 'root'
})

export class GetEventsService {

    constructor(private http: HttpClient){}

    getEventsByMonth(request: GetEventsByMonthRequest) {
        return this.http.post<any>(Environment.serviceUrl + '/eventcalendar/bymonth', request);
    }
    getEventsByWeek(request: GetEventsByWeekRequest) {
        return this.http.post<any>(Environment.serviceUrl + '/eventcalendar/byweek', request);
    }
    getEventsByDay(request: GetEventsByDayRequest) {
        return this.http.post<any>(Environment.serviceUrl + '/eventcalendar/byday', request);
    }
    exportEvents() {
        return this.http.get<any>(Environment.serviceUrl + '/eventcalendar/exportcalendar');
    }
}