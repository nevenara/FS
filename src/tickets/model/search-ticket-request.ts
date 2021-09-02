import { TicketCategory } from "../../models/ticket-category";
import { TicketStatus } from "./ticket-status";

export class SearchTicketsRequest {
    public fromDate: Date;
    public toDate: Date;
    public categories: string[];
    public showLinkedAccountsFilter: boolean;
    public showTicketsOnSaleFilter: boolean;
    public showTicketsWithRepersonalizationInProgress: boolean;
    public showWaitingForPayment: boolean;
    public eventName: string;
    public eventDate: Date;
    public userId: string;
    public page: number;
    public status: TicketStatus[];
}