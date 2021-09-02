import { SortOrder } from "../../../db/query/sort-option";
import { TicketStatusAdminPanel } from "../../../tickets/model/ticket-status-admin-panel";

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

    public sortField: string;
    public sortOrder: SortOrder;
}