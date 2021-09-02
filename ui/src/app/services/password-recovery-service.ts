import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpRequest } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Environment } from '../environments/environment';
import { PasswordRecoveryInitRequest } from './models/password-recovery-init-request';
import { PasswordRecoveryRequest } from './models/password-recovery-request';


@Injectable({
    providedIn: 'root'
})

export class PasswordRecoveryService{
    constructor(private http: HttpClient){}

    public resetPasswordGenerateLink(request: PasswordRecoveryInitRequest){
        return this.http.post<any>(Environment.serviceUrl + '/passwordrecovery', request);
    }

    public resetPassword(request: PasswordRecoveryRequest){
        return this.http.post<any>(Environment.serviceUrl + '/passwordrecovery/recover', request);
    }
}