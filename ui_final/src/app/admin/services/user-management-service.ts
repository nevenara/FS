import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Environment } from '../../environments/environment';
import { SearchUserManagementRequest } from './models/search-user-management-request';
import { AddUserManagementRequest } from './models/add-user-management-request';
import { EditUserManagementRequest } from './models/edit-user-management-request';
import { DeleteUserManagementRequest } from './models/delete-user-management-request';

@Injectable({
    providedIn: 'root'
})
export class UserManagementService {

    constructor(private http: HttpClient){}

    search(request: SearchUserManagementRequest) {
        return this.http.post<any>(Environment.serviceUrl + '/usermanagement/adminpanel/search', request);
    }

    exportExcel(request: SearchUserManagementRequest) {
        return this.http.post(Environment.serviceUrl + '/usermanagement/adminpanel/exportexcel', request, {responseType: "blob"});
    }

    exportCsv(request: SearchUserManagementRequest) {
        return this.http.post(Environment.serviceUrl + '/usermanagement/adminpanel/exportcsv', request, {responseType: "blob"});
    }

    exportPdf(request: SearchUserManagementRequest) {
        return this.http.post(Environment.serviceUrl + '/usermanagement/adminpanel/exportpdf', request, {responseType: "blob"});
    }

    editUser(request: EditUserManagementRequest) {
        return this.http.post<any>(Environment.serviceUrl + '/usermanagement/adminpanel/edit', request);
    }

    deleteUser(request: DeleteUserManagementRequest) {
        return this.http.post<any>(Environment.serviceUrl + '/usermanagement/adminpanel/delete', request);
    }

    addUser(request: AddUserManagementRequest) {
        return this.http.post<any>(Environment.serviceUrl + '/usermanagement/adminpanel/add', request);
    }
}