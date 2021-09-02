import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpRequest } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Environment } from '../environments/environment';
import { AddAdditionalEmailRequest } from './models/add-additional-email-request';
import { UseAsStandardEmailRequest } from './models/use-as-standard-email-request';
import { DeleteAdditionalEmailRequest } from './models/delete-additional-email-request';

@Injectable({
    providedIn: 'root'
})

export class AdditionalEmailsService{
    constructor(private http: HttpClient){}

    public addAdditionalEmail(request: AddAdditionalEmailRequest){
        return this.http.post<any>(Environment.serviceUrl + '/addadditionalemail', request);
    }

   public useAsStandardEmail(request: UseAsStandardEmailRequest){
        return this.http.post<any>(Environment.serviceUrl + '/useasstandardemail', request);
   }

   public deleteAdditionalEmail(request: DeleteAdditionalEmailRequest){
        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' }), body: request
        };
    
        return this.http.delete<any>(Environment.serviceUrl + '/deleteadditionalemail', httpOptions);
   }
}