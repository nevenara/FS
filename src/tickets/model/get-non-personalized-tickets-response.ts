import { GetTicketPlaceholderImagesResponse } from "./get-ticket-placeholder-images-response";

export class GetNonPersonalizedTicketsResponse {
    public tickets: NonPersonalizedGroupedTickets[];
    public totalPages: number;
}

export class NonPersonalizedGroupedTickets {
    public eventName: string;
    public date: string;
    public beginTime: string;
    public doorsOpen: string;
    public locationName: string;
    public locationAddress: string;
    public amountOfTickets: number;
    public syncDate: string;
    public eventId: string;
}
