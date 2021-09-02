export class SearchOrganizersTicketsRequest {
    public eventName: string;
    public eventLocation: string;
    public fromDate: string;
    public toDate: string;
    public status: Array<TicketStatusAdminPanel>;
    public ticketId: string;
    public ticketBuyer: string;
    public ticketHolder: string;
    public bookingId: string;
    public page: number;
    public limit: number; 
}

export enum TicketStatusAdminPanel {
    Personalized = 1,
    PersonalizationPending = 2,
    PersonalizationFailed = 3,
    CheckedIn = 4,
    BlockedForPickup = 5
}