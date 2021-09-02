import { OrganizerStatus } from "../../../organizer/models/organizer-status";

export class SearchOrganizerSupportResponse {
    organizers: OrganizerSupportResponse[];
    totalRecords: number;
    totalPages: number;
}

export class OrganizerSupportResponse {
    organizerId: string;
    url: string;
    companyName: string;
    created: string;
    status: OrganizerStatus;
    userId: string;
}