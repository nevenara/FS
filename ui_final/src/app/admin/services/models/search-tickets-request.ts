import { SortOrder } from '../../models/sort-order';
import { TicketStatus } from '../../models/ticket-status';

export class SearchTicketsRequest {
    public eventName: string;
    public eventLocation: string;
    public fromDate: string;
    public toDate: string;
    public status: Array<TicketStatus>;
    public ticketId: string;
    public organizer: string;
    public ticketBuyer: string;
    public ticketHolder: string;
    public bookingId: string;
    
    public page: number;
    public limit: number; 

    public sortField: string;
    public sortOrder: SortOrder;
}