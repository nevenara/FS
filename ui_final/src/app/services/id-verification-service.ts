import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Environment } from '../environments/environment';
import { VerifyIdRequest } from './models/verify-id-request';
import { IdCheckAccountByAdminRequest } from './models/id-check-account-by-admin-request';
import { GetQRCodeRequest } from './models/get-qr-code-request';

@Injectable({
    providedIn: 'root'
})

export class IdVerificationService {

    constructor(private http: HttpClient){}

    verifyId(request: VerifyIdRequest){
        var formData: any = new FormData();
        formData.append("idDocument", request.idDocument);
        formData.append("selfieImage", request.selfieImage);

        return this.http.post<any>(Environment.serviceUrl + '/verifyid', formData);
    }

    idCheckAccountByAdmin(request: IdCheckAccountByAdminRequest) {
        var formData: any = new FormData();

        formData.append("userId", request.userId);
        formData.append("idDocument", request.idDocumentFile);
        formData.append("selfieImage", request.selfieImage);

        return this.http.post<any>(Environment.serviceUrl + '/users/adminpanel/idverify', formData);
    }

    getQrCode(request: GetQRCodeRequest) {
        return this.http.post<any>(Environment.serviceUrl + '/tickets/idcheck/qr', request);
    }
}