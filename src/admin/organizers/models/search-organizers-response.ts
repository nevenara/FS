export class SearchOrganizersResponse {
    public organizers: SearchOrganizerResponse[];
    public totalPages: number;
    public totalRecords: number;
}

export class SearchOrganizerResponse {
    public id: string;
    public companyName: string;
    public contactPerson: string;
    public email: string;
    public phone: string;
    public status: string;
}
