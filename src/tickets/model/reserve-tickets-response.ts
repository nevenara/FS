import { Currency } from "./currency";
import { GetTicketPlaceholderImagesResponse } from "./get-ticket-placeholder-images-response";

export class ReserveTicketsResponse {
    public eventName: string;
    public eventId: string;
    public date: string;
    public beginTime: string;
    public doorsOpen: string;
    public seat: string;
    public locationName: string;
    public locationAddress: string;
    public priceForSale: number;
    public priceCurrency: Currency;
    public ticketId: string;
    public bookingId: string;
    public tickets: Array<BestCloseTicket> = [];
    public organizerName: string;
    public reservationTime: number;
    public id: string;
}

export class BestCloseTicket {
    public id: string;
    public ticketId: string;
    public seat: string;
    public priceForSale: number;
}