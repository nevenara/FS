export class OrganizerSupportModel {
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
}

export enum OrganizerStatus {
    Active = "Active",
    Inactive = "Inactive"
}