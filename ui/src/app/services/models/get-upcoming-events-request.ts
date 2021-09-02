export class GetUpcomingEventsRequest {
    public fromDate: Date;
    public toDate: Date;
    public categories: Array<string>;
    public showLinkedAccountsFilter: boolean;
    public showTicketsOnSaleFilter: boolean;
    public showTicketsWithRepersonalizationInProgress: boolean;
    public page: number;
}