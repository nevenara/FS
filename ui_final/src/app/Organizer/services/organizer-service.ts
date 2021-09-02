import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Environment } from '../../environments/environment';
import { SearchOrganizersTicketsRequest } from './models/search-organizer-ticket-list-request';
import { OrganizerDetailsRequest } from './models/organizer-details-request'
import { EventDetailsRequest } from './models/event-details-request'
import { UploadEventImageRequest } from './models/upload-event-image-request'
import { DeleteEventImage } from './models/delete-event-image-request'
import { GetSeatImageRequest } from './models/get-seat-image-request'
import { UploadSeatImageRequest } from './models/upload-seat-image-request'
import { DeleteSeatImageRequest } from './models/delete-seat-image-request'
import { from } from 'rxjs';


@Injectable({
    providedIn: 'root'
})
export class OrganizerListService {

    constructor(private http: HttpClient) { }

    searchOrganizerTickets(request: SearchOrganizersTicketsRequest) {
        return this.http.post<any>(Environment.serviceUrl + '/organizers/adminpanel/ticketlist/search', request)
    }

    exportExcel(request: SearchOrganizersTicketsRequest) {
        return this.http.post(Environment.serviceUrl + '/organizers/adminpanel/ticketlist/exportexcel', request, { responseType: "blob" });
    }

    exportCsv(request: SearchOrganizersTicketsRequest) {
        return this.http.post(Environment.serviceUrl + '/organizers/adminpanel/ticketlist/exportcsv', request, { responseType: "blob" });
    }

    exportPdf(request: SearchOrganizersTicketsRequest) {
        return this.http.post(Environment.serviceUrl + '/organizers/adminpanel/ticketlist/exportpdf', request, { responseType: "blob" });
    }

    getOrganizerDetails(request: OrganizerDetailsRequest) {
        return this.http.post<any>(Environment.serviceUrl + '/organizers/adminpanel/ticketlist/search', request)
    }
    getOrganizerContext() {
        return this.http.get<any>(Environment.serviceUrl + '/organizers/adminpanel/context')
    }
    getEventDetails(request: EventDetailsRequest) {
        return this.http.post<any>(Environment.serviceUrl + '/organizers/adminpanel/eventdetails', request)
    }

    uploadEventImage(request: UploadEventImageRequest) {
        var formData: any = new FormData();
        formData.append("image", request.image);
        formData.append("eventId", request.eventId);
        return this.http.post<any>(Environment.serviceUrl + '/organizers/adminpanel/eventimage/upload', formData)
    }

    deleteEventImage(request: DeleteEventImage) {
        return this.http.post(Environment.serviceUrl + '/organizers/adminpanel/eventimage/delete', request)
    }

    uploadSeatImage(request: UploadSeatImageRequest) {
        var formData: any = new FormData();
        formData.append("image", request.image);
        formData.append("eventId", request.eventId);
        return this.http.post<any>(Environment.serviceUrl + '/organizers/adminpanel/seatplan/upload', formData)
    }

    deleteSeatsImage(request: DeleteSeatImageRequest) {
        return this.http.post(Environment.serviceUrl + '/organizers/adminpanel/seatplanimage/delete', request)
    }

    // public static GET_EVENT_DETAILS_URL = '/organizers/adminpanel/eventdetails';
    // public static CHECK_SEAT_PLAN_URL = '/organizers/adminpanel/seatplan/check';
    // public static UPLOAD_EVENT_IMAGE_URL = '/organizers/adminpanel/eventimage/upload';
    // public static DELETE_EVENT_IMAGE_URL = '/organizers/adminpanel/eventimage/delete';
    // public static UPLOAD_SEAT_PLAN_URL = '/organizers/adminpanel/seatplan/upload';
    // public static DELETE_SEAT_PLAN_IMAGE_URL = '/organizers/adminpanel/seatplanimage/delete';
    // public static GET_SEAT_PLAN_IMAGE_URL = '/organizers/adminpanel/seatplanimage';

}     
