import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Environment } from "../environments/environment";

@Injectable({
    providedIn: 'root'
})
export class QrService {

    constructor(private http: HttpClient) { }

    public getUrlParams(uuid: string){
        return this.http.get<any>(Environment.serviceUrl + '/qr/params?uuid=' + uuid);
    }
}