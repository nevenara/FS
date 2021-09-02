import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { GetUserInfoForRepersonalizationRequest } from './models/get-user-info-for-re-personalization-request'
import { Environment } from '../environments/environment';


@Injectable({
    providedIn: 'root'
})

export class UserInfoForRePersonalizationService {
    
    constructor(private http: HttpClient){}
    getUserTickets(request: GetUserInfoForRepersonalizationRequest) {
        return this.http.post<any>(Environment.serviceUrl + '/users/userinfoforrepersonalization', request);
    }

}



