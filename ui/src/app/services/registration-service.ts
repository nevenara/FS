import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Environment } from '../environments/environment';
import { RegisterRequest } from './models/register-request';
import { CompleteRegistrationRequest } from './models/complete-registration-request';
import { UploadProfileImageRequest } from './models/upload-profile-image-request';

@Injectable({
    providedIn: 'root'
})

export class RegistrationService{
    constructor(private http: HttpClient){}

    public register(request: RegisterRequest){
        return this.http.post<any>(Environment.serviceUrl + '/register', request);
    }

    public completeRegistration(request: CompleteRegistrationRequest) {
        return this.http.post<any>(Environment.serviceUrl + '/completeregistration', request);
    }

    public uploadProfileImage(request: UploadProfileImageRequest) {
        var formData: any = new FormData();
        formData.append("profileImage", request.profileImage);

        return this.http.post<any>(Environment.serviceUrl + '/uploadprofileimage', formData);
    }

    public getDefaultProfileImage(){
        return this.http.get<any>(Environment.serviceUrl + '/getdefaultprofileimage');
    }
}