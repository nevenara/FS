import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpRequest } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Environment } from '../environments/environment';
import { AuthenticateRequest } from './models/authenticate-request';

@Injectable({
    providedIn: 'root'
})
export class SessionService {
    constructor(private http: HttpClient) { }

    public keepSessionAlive() {
        return this.http.post<any>(Environment.serviceUrl + '/session/keepalive', {});
    }
}