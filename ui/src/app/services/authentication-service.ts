import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpRequest } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Environment } from '../environments/environment';
import { AuthenticateRequest } from './models/authenticate-request';

@Injectable({
    providedIn: 'root'
})
export class AuthenticationService{
    constructor(private http:    HttpClient){}

    public authenticate(request: AuthenticateRequest){
        return this.http.post<any>(Environment.serviceUrl + '/login', request);
    }

    public getUserContext(){
        return this.http.get<any>(Environment.serviceUrl + '/usercontext');
    }
}