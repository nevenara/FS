
export class GetMarketplaceMySalesRequest {
    public fromDate: Date;
    public toDate: Date;
    public eventName: string;
    public categories: Array<string>;
    public page: number;
    //add additional filters
}