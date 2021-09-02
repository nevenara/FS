import { GetTicketPlaceholderImagesResponse } from "./get-ticket-placeholder-images-response";

export class SearchTicketsResponse{
    public tickets: any;
    public totalPages: number;
    public totalRecords: number;
}

export class SearchTicketResponse {
    id: string;
    eventName: string;
    eventId: string;
    organizer: string;
    date: string;
    beginTime: Date;
    locationName: string;
    locationAddress: string;
    seat: string;
    doorsOpen: string;
    priceForSale: number;
    reserved: boolean;
}