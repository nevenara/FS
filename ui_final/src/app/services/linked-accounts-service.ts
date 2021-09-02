import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConnectNewAccountRequest } from './models/connect-new-account-request';
import { IdCheckLinkedAccountRequest } from './models/id-check-linked-account-request';
import { GetLinkedAccountDetailsRequest } from './models/get-linked-account-details-request';
import { EditLinkedAccountRequest } from './models/edit-linked-account-request';
import { SetLinkedAccountPasswordRequest } from './models/set-linked-account-password-request';
import { Environment } from '../environments/environment';
import { UploadProfileImageLinkedAccountRequest } from './models/upload-profile-image-linked-account-request';
import { DeleteProfileImageRequest } from './models/delete-profile-image-request';

@Injectable({
    providedIn: 'root'
})

export class LinkedAccountsService {

    constructor(private http: HttpClient){}

    connectNewAccount(request: ConnectNewAccountRequest) {
        var formData: any = new FormData();
        
        formData.append("address", request.address);
        formData.append("birthDate", request.birthDate);
        formData.append("city", request.city);
        formData.append("country", request.country);
        formData.append("firstname", request.firstname);
        formData.append("gender", request.gender);
        formData.append("lastname", request.lastname);
        formData.append("postCode", request.postCode);
        formData.append("relationToMainAccount", request.relationToMainAccount);
        formData.append("username", request.username);

        if (request.profileImage) {
            formData.append("profileImage", request.profileImage);
        }

        return this.http.post<any>(Environment.serviceUrl + '/connectnewaccount', formData);
    }

    idCheckLinkedAccount(request: IdCheckLinkedAccountRequest) {
        var formData: any = new FormData();

        formData.append("linkedAccountId", request.linkedAccountId);
        formData.append("idDocument", request.idDocumentFile);
        formData.append("selfieImage", request.selfieImage);

        return this.http.post<any>(Environment.serviceUrl + '/idchecklinkedaccount', formData);
    }

    getLinkedAccounts() {
        return this.http.get<any>(Environment.serviceUrl + '/getlinkedaccounts');
    }

    getLinkedAccountDetails(request: GetLinkedAccountDetailsRequest) {
        return this.http.post<any>(Environment.serviceUrl + '/getlinkedaccountdetails', request);
    }

    editLinkedAccount(request: EditLinkedAccountRequest) {
        return this.http.post<any>(Environment.serviceUrl + '/editlinkedaccount', request);
    }

    setLinkedAccountPassword(request: SetLinkedAccountPasswordRequest) {
        return this.http.post<any>(Environment.serviceUrl + '/setlinkedaccountpassword', request);
    }

    uploadProfileImage(request: UploadProfileImageLinkedAccountRequest){
        var formData: any = new FormData();
        formData.append("profileImage", request.profileImage);
        formData.append("linkedAccountId", request.linkedAccountId);

        return this.http.post<any>(Environment.serviceUrl + '/uploadprofileimagelinkedaccount', formData);
    }
}