import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Environment } from "../environments/environment";
import { PaymentSettingsSaveRequest } from "./models/payment-settings-save-request";

@Injectable({
    providedIn: 'root'
})
export class PaymentSettingsService {

    constructor(private http: HttpClient) { }

    validateIbanNumber(ibanValue: string) {
        return this.http.post<any>(Environment.serviceUrl + '/payment/validateIban', {ibanValue: ibanValue});
    }

    public save(req: PaymentSettingsSaveRequest) {
        var formData: any = new FormData();
        formData.append("residenceDocument", req.proofOfAddressDocument);
        formData.append("bankAccountStripeToken", req.bankAccountStripeToken);

        return this.http.post<any>(Environment.serviceUrl + '/paymentsetings/save', formData);
    }

    public createSession() {
        return this.http.post<any>(Environment.serviceUrl + '/payment/createsession', {});
    }

    public createPaymentIntent(req) {
        return this.http.post<any>(Environment.serviceUrl + '/payment/createpaymentintent', req);
    }
}