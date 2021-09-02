import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Environment } from '../../environments/environment';
import { GetAdminPanelUserDetailsRequest } from './models/get-admin-panel-user-details-request';
import { DeactivateUserRequest } from './models/deactivate-user-request';
import { DeleteUserRequest } from './models/delete-user-request';
import { UpdateUserAdminPanelRequest } from './models/update-user-admin-panel-request';
import { UploadImageRequest } from './models/upload-image-request';
import { GetAccountDetailsRequest } from './models/get-account-details-request';
import { GetLinkedAccountsRequest } from './models/get-linked-accounts-request';
import { SearchUsersRequest } from './models/search-users-request'
import { ActivateUserRequest } from './models/activate-user-request';
import { AddUserAdminPanelRequest } from './models/add-user-request';
import { UseAsStandardEmailRequest } from 'src/app/admin/services/models/use-as-standard-email-request';
import { AddEmailRequest } from './models/add-email-request';
import { EditEmailRequest } from './models/edit-email-request';
import { DeleteEmailRequest } from './models/delete-email-request';
import { GetAccountBalanceRequest } from './models/get-account-balance-request';
import { GetUsernamesAndEmailsRequest } from 'src/app/services/models/get-usernames-and-emails-request';

@Injectable({
    providedIn: 'root'
})
export class UserService {

    constructor(private http: HttpClient){}

    getAdminPanelUserDetails(request: GetAdminPanelUserDetailsRequest) {
        return this.http.post<any>(Environment.serviceUrl + '/users/adminpanel/userdetails', request);
    }

    deactivateUser(request: DeactivateUserRequest) {
        return this.http.post<any>(Environment.serviceUrl + '/users/adminpanel/deactivateuser', request);
    }

    activateUser(request: ActivateUserRequest) {
        return this.http.post<any>(Environment.serviceUrl + '/users/adminpanel/activateuser', request);
    }

    getReasonsForDeactivation() {
        return this.http.get<any>(Environment.serviceUrl + '/users/adminpanel/reasonsfordeactivation');
    }

    deleteUser(request: DeleteUserRequest) {
        return this.http.post<any>(Environment.serviceUrl + '/users/adminpanel/deleteuser', request);
    }
    
    updateUser(request: UpdateUserAdminPanelRequest) {
        return this.http.post<any>(Environment.serviceUrl + '/users/adminpanel/updateuser', request);
    }

    uploadUserProfileImageAdminPanel(request: UploadImageRequest) {
        var formData: any = new FormData();
        formData.append("profileImage", request.profileImage);
        formData.append("userId", request.userId);

        return this.http.post<any>(Environment.serviceUrl + '/users/adminpanel/uploaduserprofileimage', formData);
    }

    getAccountDetails(request: GetAccountDetailsRequest) {
        return this.http.post<any>(Environment.serviceUrl + '/users/adminpanel/accountdetails', request);
    }

    getLinkedAccounts(request: GetLinkedAccountsRequest) {
        return this.http.post<any>(Environment.serviceUrl + '/users/adminpanel/linkedaccounts', request);
    }

    searchUsers(request: SearchUsersRequest) {
        return this.http.post<any>(Environment.serviceUrl + '/users/adminpanel/search', request);
    }

    exportExcel(request: SearchUsersRequest) {
        return this.http.post(Environment.serviceUrl + '/users/adminpanel/exportexcel', request, {responseType: "blob"});
    }

    exportCsv(request: SearchUsersRequest) {
        return this.http.post(Environment.serviceUrl + '/users/adminpanel/exportcsv', request, {responseType: "blob"});
    }

    exportPdf(request: SearchUsersRequest) {
        return this.http.post(Environment.serviceUrl + '/users/adminpanel/exportpdf', request, {responseType: "blob"});
    }

    addUser(request: AddUserAdminPanelRequest) {
        var formData: any = new FormData();
        formData.append("profileImage", request.profileImage);
        formData.append("address", request.address);
        formData.append("birthDate", request.birthDate);
        formData.append("city", request.city);
        formData.append("country", request.country);
        formData.append("firstname", request.firstname);
        formData.append("gender", request.gender);
        formData.append("isMainAccount", request.isMainAccount);
        formData.append("lastname", request.lastname);

        if (request.linkedToMainAccount) {
            formData.append("linkedToMainAccount", request.linkedToMainAccount);
        }
        
        formData.append("phone", request.phone);
        formData.append("postCode", request.postCode);

        if(request.isMainAccount) {
            formData.append("standardEmail", request.standardEmail);
        }
        
        formData.append("username", request.username);

        return this.http.post(Environment.serviceUrl + '/users/adminpanel/add', formData);
    }

    useAsStandardEmail(request: UseAsStandardEmailRequest){
        return this.http.post(Environment.serviceUrl + '/additionalemails/adminpanel/setasstandard', request);
    }

    addEmail(request: AddEmailRequest) {
        return this.http.post(Environment.serviceUrl + '/additionalemails/adminpanel/add', request);
    }

    editEmail(request: EditEmailRequest) {
        return this.http.post(Environment.serviceUrl + '/additionalemails/adminpanel/update', request);
    }

    deleteEmail(request: DeleteEmailRequest) {
        return this.http.post(Environment.serviceUrl + '/additionalemails/adminpanel/delete', request);
    }

    getAccountBalance(request: GetAccountBalanceRequest) {
        return this.http.get<any>(Environment.serviceUrl + '/users/adminpanel/accountbalance?userId=' + request.userId);
    }

    getUsernamesAndEmails(request: GetUsernamesAndEmailsRequest) {
        return this.http.post<any>(Environment.serviceUrl + '/users/mainaccounts/search', request);
    }
}