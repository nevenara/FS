
export class GetMarketplaceRequest {
    public fromDate: Date;
    public toDate: Date;
    public eventName: string;
    public categories: Array<string>;
    public fromPrice: number;
    public toPrice: number;
    public locations: Array<string>;
    public page: number;
    //add additional filters
}