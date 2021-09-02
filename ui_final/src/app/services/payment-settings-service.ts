import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Environment } from "../environments/environment";
import { PaymentSettingsSaveRequest } from "./models/payment-settings-save-request";
import { PaymentSettingsSaveByAdminRequest } from "./models/payment-settings-save-by-admin-request";
import { CreatePaymentIntentRequest } from "./models/create-payment-intent-request";
import { PayTicketsRequest } from "./models/pay-tickets-request";
import { RepersonalizeTicketRequest } from './models/get-re-personalize-ticket-request';
import { ConfirmPaymentIntentStatus } from './models/confirm-payment-intent-status';

@Injectable({
    providedIn: 'root'
})
export class PaymentSettingsService {

    constructor(private http: HttpClient) { }

    validateIbanNumber(ibanValue: string) {
        return this.http.post<any>(Environment.serviceUrl + '/payment/validateIban', { ibanValue: ibanValue });
    }

    public save(req: PaymentSettingsSaveRequest) {
        var formData: any = new FormData();
        formData.append("residenceDocument", req.proofOfAddressDocument);
        formData.append("bankAccountStripeToken", req.bankAccountStripeToken);

        return this.http.post<any>(Environment.serviceUrl + '/paymentsetings/save', formData);
    }

    public saveByAdmin(req: PaymentSettingsSaveByAdminRequest) {
        var formData: any = new FormData();
        formData.append("residenceDocument", req.proofOfAddressDocument);
        formData.append("bankAccountStripeToken", req.bankAccountStripeToken);
        formData.append("userId", req.userId);

        return this.http.post<any>(Environment.serviceUrl + '/admin/payment/save', formData);
    }

    public createSession() {
        return this.http.post<any>(Environment.serviceUrl + '/payment/createsession', {});
    }

    public createPaymentIntent(request: CreatePaymentIntentRequest) {
        return this.http.post<any>(Environment.serviceUrl + '/payment/createpaymentintent', request);
    }

    public payTickets(request: PayTicketsRequest) {
        return this.http.post<any>(Environment.serviceUrl + '/tickets/buytickets/startbuyflow', request);
    }

    public rePersonalizeTicket(request: RepersonalizeTicketRequest) {
        return this.http.post<any>(Environment.serviceUrl + '/tickets/repersonalize', request);
    }

    public rePersonalizeTicketOnFailed(request: RepersonalizeTicketRequest) {
        return this.http.post<any>(Environment.serviceUrl + '/tickets/repersonalizefailed', request);
    }

    public confirmpaymentintentstatus(request: ConfirmPaymentIntentStatus) {
        return this.http.post<any>(Environment.serviceUrl + '/payment/confirmpaymentintentstatus', request);
    }

    public onPaymentFailed(paymentIntentId: string, status) {
        return this.http.post<any>(Environment.serviceUrl + '/payment/onpaymentfailed', {paymentIntentId: paymentIntentId, status: status});
    }
}