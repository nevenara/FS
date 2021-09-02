import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Environment } from '../environments/environment';
import { LikeFAQRequest } from '../services/models/like-faq-request'
import { DislikeFAQRequest } from '../services/models/dislike-faq-request'
import { SendEmailToSupportRequest } from '../services/models/send-email-to-support-request'

import { from } from 'rxjs';
@Injectable({
    providedIn: 'root'
})

export class SupportService {

    constructor(private http: HttpClient){}

    getFAQS(){
        return this.http.get<any>(Environment.serviceUrl + '/support/faq');
    }
    getSupportContact(){
        return this.http.get<any>(Environment.serviceUrl + '/support/contact');
    }
    likeFAQ(request: LikeFAQRequest){
        return this.http.post<any>(Environment.serviceUrl + '/support/faq/like', request);
    }
    dislikeFAQ(request: DislikeFAQRequest){
        return this.http.post<any>(Environment.serviceUrl + '/support/faq/dislike', request);
    }
    sendMailToSupport(request: SendEmailToSupportRequest){
        return this.http.post<any>(Environment.serviceUrl + '/support/sendemail', request);
    }

}