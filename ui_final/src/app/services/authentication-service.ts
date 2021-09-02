import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { Environment } from '../environments/environment';
import { AuthenticateRequest } from './models/authenticate-request';
import { VerifyEmailRequest } from './models/verify-email-request';

@Injectable({
    providedIn: 'root'
})
export class AuthenticationService{
    constructor(private http:    HttpClient){}

    public authenticate(request: AuthenticateRequest){
        request.applicationType = Environment.applicationType();

        return this.http.post<any>(Environment.serviceUrl + '/login', request);
    }

    public getUserContext(){
        return this.http.get<any>(Environment.serviceUrl + '/usercontext');
    }

    public logout(){
        return this.http.post<any>(Environment.serviceUrl + '/logout', {});
    }

    public proxyLogout(){
        return this.http.post<any>(Environment.serviceUrl + '/proxy/admin/logout', {});
    }

    public verifyEmail(request: VerifyEmailRequest) {
        return this.http.get<any>(Environment.serviceUrl + '/verifyadditionalemail?emailVerificationGuid=' + request.emailVerificationGuid + "&lang=" + request.lang);
    }

    public getUserType(){
        return this.http.get<any>(Environment.serviceUrl + '/users/type');
    }

    public getUserTypeAsPromise(){
        return this.http.get<any>(Environment.serviceUrl + '/users/type').toPromise();
    }
}