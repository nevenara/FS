import { Currency } from "./currency";
import { GetTicketPlaceholderImagesResponse } from "./get-ticket-placeholder-images-response";

export class GetTicketsForSaleFromSameEventResponse {
    public eventName: string;
    public eventId: string;
    public date: string;
    public beginTime: string;
    public doorsOpen: string;
    public seat: string;
    public location: string;
    public originalPrice: number;
    public priceCurrency: Currency;
    public ticketId: string;
    public bookingId: string;
    public tickets: Array<TicketForSaleFromSameEvent> = [];
}

export class TicketForSaleFromSameEvent {
    public id: string;
    public ticketId: string;
    public seat: string;
    public priceForSale: number;
}