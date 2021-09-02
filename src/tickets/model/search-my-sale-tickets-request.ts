import { TicketCategory } from "../../models/ticket-category";

export class SearchMySaleTicketsRequest {
    public categories: Array<string>;
    public eventName: string;
    public fromDate: Date;
    public toDate: Date;
    public page: number;
}