export class SearchCheckInListRequest {
    /*
    * ticketId
    * firstName
    * lastName
    * ticketStatus
    * verificationStatus
    * reason
    */
    public textSearch: string;

    public page: number;
    public limit: number;
}