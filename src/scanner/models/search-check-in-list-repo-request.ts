import { TicketStatus } from "../../tickets/model/ticket-status";
import { SearchCheckInListRequest } from "./search-check-in-list-request";

export class SearchCheckInListRepoRequest {
    constructor(request: SearchCheckInListRequest){
        this.textSearch = request.textSearch;
        this.page = request.page;
        this.limit = request.limit;
    }

    public textSearch: string;
    public ticketStatus: TicketStatus[];
    public eventId: string;
    public noStatus: boolean = false;

    public page: number;
    public limit: number;
}