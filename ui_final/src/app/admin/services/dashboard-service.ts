import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Environment } from '../../environments/environment';
import { ChartRequest } from './models/chart-request';

@Injectable({
    providedIn: 'root'
})

export class DashboardService{
    constructor(private http:    HttpClient){}

    public getTotalUsersRegistered(){
        return this.http.get<any>(Environment.serviceUrl + '/dashboard/userstatistics/totalusersregistered');
    }

    public getTotalUsersVerified(){
        return this.http.get<any>(Environment.serviceUrl + '/dashboard/userstatistics/totalusersverified');
    }

    public getTotalUsersVerifiedInclBankAccount(){
        return this.http.get<any>(Environment.serviceUrl + '/dashboard/userstatistics/totalusersverifiedinclbankaccount');
    }

    public getTotalMainAccountsWithLinkedAccounts(){
        return this.http.get<any>(Environment.serviceUrl + '/dashboard/userstatistics/totalmainaccountswithlinkedaccounts');
    }

    public getTotalLinkedAccountsUsers(){
        return this.http.get<any>(Environment.serviceUrl + '/dashboard/userstatistics/totallinkedaccounts');
    }

    public getTotalLinkedAccountsWithPassword(){
        return this.http.get<any>(Environment.serviceUrl + '/dashboard/userstatistics/totallinkedaccountswithpassword');
    }

    public getTotalIncomingTickets(){
        return this.http.get<any>(Environment.serviceUrl + '/dashboard/ticketstatistics/totalincomingtickets');
    }

    public getTotalPersonalizedTickets(){
        return this.http.get<any>(Environment.serviceUrl + '/dashboard/ticketstatistics/totalpersonalizedtickets');
    }

    public getTotalActiveOrganizers(){
        return this.http.get<any>(Environment.serviceUrl + '/dashboard/organizerstatistics/totalactiveorganizers');
    }

    public getUsersRegisteredVsUsersVerified(request: ChartRequest){
        return this.http.post<any>(Environment.serviceUrl + '/dashboard/usersregisteredvsusersverified', request);
    }
    
    public getIncomingTicketsVsPersonalizedTickets(request: ChartRequest){
        return this.http.post<any>(Environment.serviceUrl + '/dashboard/incomingticketsvspersonalizedtickets', request);
    }

    public getIncomingTicketsPerOrganizer(){
        return this.http.get<any>(Environment.serviceUrl + '/dashboard/incomingticketsperorganizer');
    }
}