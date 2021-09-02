export class SearchOrganizerSupportRequest {
    companyName: string;
    status: OrganizerStatus[];
    createdFrom: Date;
    createdTo: Date;

    page: number;
    limit: number;
}

export enum OrganizerStatus {
    Active = "Active",
    Inactive = "Inactive"
}