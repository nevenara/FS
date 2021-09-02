import { GetTicketPlaceholderImagesResponse } from "./get-ticket-placeholder-images-response";

export class GetEventsResponse {
    public tickets: EventResponse[];
    public totalPages: number;
}

export class EventResponse {
    id: string;
    eventName: string;
    organizer: string;
    date: string;
    beginTime: Date;
    locationName: string;
    locationAddress: string;
    seat: string;
    ticketOnSale: boolean;
    repersonalizationWaiting: boolean;
    waitingForPayment: boolean;
    linkedAccountsTicket: boolean;
    doorsOpen: string;
    linkedAccountFirstName: string;
    linkedAccountLastName: string;
    eventId: string;
    returnAllowed: boolean;
}