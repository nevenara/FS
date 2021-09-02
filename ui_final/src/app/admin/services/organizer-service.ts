import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AddOrganizerRequest } from './models/add-organizer-request'
import { Environment } from '../../environments/environment';
import { SearchOrganizersRequest } from './models/search-organizers-request';
import { GetOrganizersAccountSettingRequest } from './models/get-organizer-account-settings-request';
import { UpdateOrganizerRequest } from './models/update-organizer-request';
import { DeleteOrganizerRequest } from './models/delete-organizer-reuqest';
import { DeleteOrganizerImageRequest } from './models/delete-organizer-image-request';
import { GetOrganizersMainDataRequest } from './models/get-organizers-main-data-request';
import { UploadOrganizerPlaceholderImageRequest } from './models/upload-organizer-placeholder-image-request'
import { PasswordRecoveryInitRequest } from 'src/app/services/models/password-recovery-init-request';
import { SearchOrganizerSupportRequest } from './models/search-organizer-support-request'
import { ProxyAdminLoginRequest } from './models/proxy-admin-login-request';
import { SearchEventOrganizersBillingRequest } from './models/search-events-organizers-billing-request';
import { SearchEventLocationsOrganizersBillingRequest } from './models/search-event-location-organizers-billing-request';
import { SearchEventNamesOrganizersBillingRequest } from './models/search-event-names-organizers-billing-request';

@Injectable({
    providedIn: 'root'
})
export class OrganizerService {

    constructor(private http: HttpClient){}

    searchOrganizers(request: SearchOrganizersRequest) {
        return this.http.post<any>(Environment.serviceUrl + '/organizers/adminpanel/search', request);
    }

    exportExcel(request: SearchOrganizersRequest) {
        return this.http.post(Environment.serviceUrl + '/organizers/adminpanel/exportexcel', request, {responseType: "blob"});
    }

    exportCsv(request: SearchOrganizersRequest) {
        return this.http.post(Environment.serviceUrl + '/organizers/adminpanel/exportcsv', request, {responseType: "blob"});
    }

    exportPdf(request: SearchOrganizersRequest) {
        return this.http.post(Environment.serviceUrl + '/organizers/adminpanel/exportpdf', request, {responseType: "blob"});
    }

    addOrganizer(request: AddOrganizerRequest ) {
       
        var formData: any = new FormData();
        formData.append("companyName", request.companyName)
        formData.append("email", request.email)
        formData.append("contactPerson", request.contactPerson)
        formData.append("address", request.address)
        formData.append("postCode", request.postCode)
        formData.append("city", request.city)
        formData.append("country", request.country)
        formData.append("phone", request.phone)
        formData.append("url", request.url)
        formData.append("status", request.status)
        formData.append("ticketReturn", request.ticketReturn)
        formData.append("fansafeSale", request.fansafeSale)
        formData.append("linkLomnido", request.linkLomnido)
        formData.append("revenueSharing", request.revenueSharing)


        if (request.image) {
            formData.append("image", request.image);
        }

        return this.http.post(Environment.serviceUrl + '/organizers/adminpanel/add', formData)
    }

    getOrganizersAccountSettings(request: GetOrganizersAccountSettingRequest) {
        return this.http.post(Environment.serviceUrl + '/organizers/adminpanel/accountsettings', request)
    }

    updateOrganizer(request: UpdateOrganizerRequest) {
        return this.http.post(Environment.serviceUrl + '/organizers/adminpanel/update', request)
    }

    deleteOrganizer(request: DeleteOrganizerRequest) {
        return this.http.post(Environment.serviceUrl + '/organizers/adminpanel/delete', request)
    }

    deleteOrganizerImage(request: DeleteOrganizerImageRequest) {
        return this.http.post(Environment.serviceUrl + '/organizers/adminpanel/deleteimage', request)
    }

    getOrganizerMainData(request: GetOrganizersMainDataRequest) {
        return this.http.post<any>(Environment.serviceUrl + '/organizers/adminpanel/maindata', request)
    }

    uploadOrganizerImage(request: UploadOrganizerPlaceholderImageRequest) {
        var formData: any = new FormData();
        formData.append("image", request.image);
        formData.append("organizerId", request.organizerId);
        return this.http.post<any>(Environment.serviceUrl + '/organizers/adminpanel/uploadimage', formData)
    }

    passwordRecovery(request: PasswordRecoveryInitRequest){
        return this.http.post<any>(Environment.serviceUrl + '/passwordrecovery', request)
    }

    searchOrganizerSupport(request: SearchOrganizerSupportRequest){
        return this.http.post<any>(Environment.serviceUrl + '/organizersupport/adminpanel/search', request)
    }

    exportSupportExcel(request: SearchOrganizerSupportRequest) {
        return this.http.post(Environment.serviceUrl + '/organizersupport/adminpanel/exportexcel', request, {responseType: "blob"});
    }

    exportSupportCsv(request: SearchOrganizerSupportRequest) {
        return this.http.post(Environment.serviceUrl + '/organizersupport/adminpanel/exportcsv', request, {responseType: "blob"});
    }

    exportSupportPdf(request: SearchOrganizerSupportRequest) {
        return this.http.post(Environment.serviceUrl + '/organizersupport/adminpanel/exportpdf', request, {responseType: "blob"});
    }

    proxyLogin(request: ProxyAdminLoginRequest) {
        return this.http.post<any>(Environment.serviceUrl + '/proxy/admin/login', request)
    }

    //billing

    getTotalEvents(request: SearchEventOrganizersBillingRequest) {
        return this.http.post<any>(Environment.serviceUrl + '/organizers/adminpanel/billing/events', request)
    }

    getTotalIncomingTickets(request: SearchEventOrganizersBillingRequest) {
        return this.http.post<any>(Environment.serviceUrl + '/organizers/adminpanel/billing/incomingtickets', request)
    }

    getIncome(request: SearchEventOrganizersBillingRequest) {
        return this.http.post<any>(Environment.serviceUrl + '/organizers/adminpanel/billing/income', request)
    }

    searchEventLocations(request: SearchEventLocationsOrganizersBillingRequest) {
        return this.http.post<any>(Environment.serviceUrl + '/organizers/adminpanel/billing/eventlocations', request)
    }

    searchEventNames(request: SearchEventNamesOrganizersBillingRequest) {
        return this.http.post<any>(Environment.serviceUrl + '/organizers/adminpanel/billing/eventnames', request)
    }

    getDistributionByPrice(request: SearchEventOrganizersBillingRequest) {
        return this.http.post<any>(Environment.serviceUrl + '/organizers/adminpanel/billing/distributionbyprices', request)
    }

    getTicketList(request: SearchEventOrganizersBillingRequest) {
        return this.http.post<any>(Environment.serviceUrl + '/organizers/adminpanel/billing/ticketlist', request)
    }

    exportBillingExcel(request: SearchEventOrganizersBillingRequest) {
        return this.http.post(Environment.serviceUrl + '/organizers/adminpanel/billing/exportexcel', request, {responseType: "blob"});
    }

    exportBillingCsv(request: SearchEventOrganizersBillingRequest) {
        return this.http.post(Environment.serviceUrl + '/organizers/adminpanel/billing/exportcsv', request, {responseType: "blob"});
    }
}     
