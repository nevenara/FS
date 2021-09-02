import { PossibleTicketHolder } from "./get-non-personalized-tickets-by-event-response";
import { TicketStatus } from "./ticket-status";
import { TicketStatusAdminPanel } from "./ticket-status-admin-panel";

export class GetAdminTicketDetailsRequest{
    public ticketId: string;
}

export class GetAdminTicketDetailsResponse{
    public status: TicketStatusAdminPanel;
    public eventName: string;
    public date: string;
    public beginTime: string;
    public doorsOpen: string;
    public seat: string;
    public locationName: string;
    public locationAddress: string;
    public ticketHolder: string;
    public firstName: string;
    public lastName: string;
    public ticketHolderUsername: string;
    public bookingId: string;
    public ticketId: string;
    public priceForSale: number;
    public organizerId: string;
    public organizerAddress: string;
    public originalPrice: number;
    public organizerName: string;
    public eventId: string;
    public ticketHolderId: string;
    public possibleUsernamesAndEmails: PossibleTicketHolder[] = [];
    public prePersonalizationAllowed: boolean;
}