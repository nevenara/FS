import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})

export class DashboardService {

    constructor(
        private http: HttpClient
    ) {}

    public getIncomingTicketsPerEvent(){
        return this.http.get<any>(Environment.serviceUrl + '/organizers/adminpanel/dashboard/incoming');
    }

    public getPersonalizedTicketsPerEvent(){
        return this.http.get<any>(Environment.serviceUrl + '/organizers/adminpanel/dashboard/personalized');
    }
}