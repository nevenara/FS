import { ValidationError } from "../../common/errors/validation-error";
import { SortOrder } from "../../db/query/sort-option";
import { LocalisationKey } from "../../localisation/localisation-key";
import { TicketStatus } from "./ticket-status";
import { TicketStatusAdminPanel } from "./ticket-status-admin-panel";

export class SearchAdminPanelTicketsRequest{
    public eventName: string;
    public eventLocation: string;
    public fromDate: string;
    public toDate: string;
    public status: Array<TicketStatusAdminPanel>;
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