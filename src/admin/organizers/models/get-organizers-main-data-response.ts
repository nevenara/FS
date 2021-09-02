import { OrganizerStatus } from "../../../organizer/models/organizer-status";

export class GetOrganizersMainDataResponse {
    public companyName: string;
    public ticketReturn: boolean;
    public fansafeSale: boolean;
    public linkToLomnidoBridge: string;
    public revenueSharing: number;
    public status: string;
    public contactPerson: string;
    public email: string;
    public phone: string;
    public url: string;
    public address: string;
    public postCode: string;
    public city: string;
    public country: Country; 
}

export class Country {
    public name: string;
    public key: string;
}