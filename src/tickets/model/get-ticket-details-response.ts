import { TicketCategory } from "../../models/ticket-category";
import { Currency } from "./currency";
import { GetTicketPlaceholderImagesResponse } from "./get-ticket-placeholder-images-response";
import { TicketStatus } from "./ticket-status";

export class GetTicketDetailsResponse {
    bookingId: string;
    ticketId: string;
    category: TicketCategory;
    originalPrice: number;
    priceCurrency: Currency;
    eventName: string;
    eventId: string;
    locationName: string;
    locationAddress: string;
    date: string;
    beginTime: string;
    doorsOpen: string;
    termsOfEvent: string;
    seat: string;
    qrCode: string;
    barcode: string;
    ticketHolder: string;
    organizer: string;
    placeholderImages: GetTicketPlaceholderImagesResponse[];
    additionalInfo: string;
    status: TicketStatus;
    firstName: string;
    lastName: string;
    priceForSale: number;
    id: string;
}
