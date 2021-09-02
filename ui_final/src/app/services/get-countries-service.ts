import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Environment } from '../environments/environment';
import { GetCountriesRequest } from '../services/models/get-countries-request'

@Injectable({
    providedIn: 'root'
})

export class GetCountriesService {

    constructor(private http: HttpClient){}

    getCountryList(){
        return this.http.get<any>(Environment.serviceUrl + '/users/countries');
    }

}
