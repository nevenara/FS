import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GetMarketplaceRequest } from './models/get-marketplace-request';
import { GetMarketplaceMySalesRequest } from './models/get-marketplace-mysales-request';


import { Environment } from '../environments/environment';

@Injectable({
    providedIn: 'root'
})

export class MarketplaceService {

    constructor(private http: HttpClient){}

    getMarketplace(request: GetMarketplaceRequest) {
        return this.http.post<any>(Environment.serviceUrl + '/tickets/marketplace', request);
    }

    getMySalesMarketplace(request: GetMarketplaceMySalesRequest){
        return this.http.post<any>(Environment.serviceUrl + '/tickets/mysales', request);
    }

    getLocations(){
        return this.http.get<any>(Environment.serviceUrl + '/tickets/marketplace/locations');
    }
    
}