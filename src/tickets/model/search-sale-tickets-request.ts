import { SearchTicketsRequest } from "./search-ticket-request";
import { TicketStatus } from "./ticket-status";

export class SearchSaleTicketsRequest extends SearchTicketsRequest{
    public eventName: string;
    public locations: string[];
    public fromPrice: number;
    public toPrice: number;
    public status: TicketStatus[] = [TicketStatus.ForSale];
}
