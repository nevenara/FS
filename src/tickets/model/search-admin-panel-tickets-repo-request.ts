import { SortOrder } from "../../db/query/sort-option";
import { TicketStatus } from "./ticket-status";
import { TicketStatusAdminPanel } from "./ticket-status-admin-panel";

export class SearchAdminPanelTicketsRepoRequest {
    public eventName: string;
    //TODO check if it is locationName - locationAddress
    public eventLocation: string;
    public ticketId: string;
    public bookingId: string;
    public organizer: string;

    //originalUserId
    public ticketBuyer: string;
    //firstname lastname on ticket
    public ticketHolder: string;

    public fromDate: string;
    public toDate: string;

    public status: TicketStatus[];
    public personalizationPending: boolean;

    public page: number;
    public limit: number;

    public sortField: string;
    public sortOrder: SortOrder;

    //flag if it is for organizer admin panel
    public organizerAdminPanel: boolean;

    public blocked: boolean;
    public personalizationFailed: boolean;
}