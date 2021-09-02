import { TicketStatus } from './ticket-status';

export class TicketPreview {
    _id: string;
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
    status: TicketStatus;
    ticketHolder: string;
    ticketHolderUsername: string;
    bookingId: string;
    ticketId: string;
    organizerId: string;
    organizerAddress: string;
    ticketHolderId: string;
    firstName: string;
    lastName: string;
    organizerName: string;
}