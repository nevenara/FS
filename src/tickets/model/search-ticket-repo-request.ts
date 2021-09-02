import { TicketCategory } from "../../models/ticket-category";
import { SearchTicketsRequest } from "./search-ticket-request";
import { TicketStatus } from "./ticket-status";

export class SearchTicketRepoRequest{
    
    constructor(request?: SearchTicketsRequest){
        if(request){    
            this.fromDate = request.fromDate;
            this.toDate = request.toDate;
        }
    }

    public userId: string;
    public fromDate: Date;
    public toDate: Date;
    public linkedAccounts: string[];
    public eventName: string;
    public location: string;
    public locations: string[];
    public fromPrice: number;
    public toPrice: number;
    public status: Array<TicketStatus>;
    public beginTime: Date;
    public date: Date;
    public categories: string[];
    public marketplace: boolean;
    public notInTicketIds: string[];
    public firstName: string;
    public lastName: string;
    public page: number;
    public limit: number;
    public ticketId: string;
    public organizerId: string;
    public originalUserId: string;
    public bookingId: string;
    public syncDate: Date;
    public eventId: string;
    public locationName: string;
    public pendingUsername: string;

    // as status
    public linkedAccountsTicket: boolean;
    // as status for pending
    public notPending: boolean;
}