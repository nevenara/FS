import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpRequest } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Environment } from '../environments/environment';
import { UpdateUserPasswordRequest } from './models/update-user-password-request';
import { UpdateUserProfileRequest } from './models/update-user-profile-request';
import { GetAccountBalanceRequest } from '../admin/services/models/get-account-balance-request';
import { SetLangRequest } from './models/set-lang-request';

@Injectable({
    providedIn: 'root'
})

export class UserProfileService{
    constructor(private http: HttpClient){}

    public updateUserPassword(request: UpdateUserPasswordRequest){
        return this.http.post<any>(Environment.serviceUrl + '/updateuserpassword', request);
    }

    public getUserProfile(){
        return this.http.get<any>(Environment.serviceUrl + '/getuserprofile');
    }

    public updateUserProfile(request: UpdateUserProfileRequest){
        return this.http.post<any>(Environment.serviceUrl + '/updateuserprofile', request);
 
    }

    public getBankAccountDetails() {
        return this.http.get<any>(Environment.serviceUrl + '/users/bankaccount/details');
    }

    public getAccountBalance(request: GetAccountBalanceRequest) {
        return this.http.get<any>(Environment.serviceUrl + '/users/adminpanel/accountbalance?userId=' + request.userId);
    }

    public setLang(request: SetLangRequest) {
        return this.http.post<any>(Environment.serviceUrl + '/api/translation/lang', request);
    }
}