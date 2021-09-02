import { ImageModel } from 'src/app/tickets/models/ticket-preview-model';

export class TicketsReservation {
    public eventName: string;
    public date: string;
    public beginTime: Date;
    public doorsOpen: string;
    public seat: string;
    public locationName: string;
    public locationAddress: string;
    public priceForSale: number;
    public priceCurrency: string;
    public ticketId: string;
    public bookingId: string;
    public placeholderImages: Array<ImageModel>;
    public tickets: Array<BestCloseTicket> = [];
    public organizerName: string;
    public reservationTime: number;
    public assignee: TicketAssignee;
}

export class BestCloseTicket {
    public id: string;
    public ticketId: string;
    public seat: string;
    public priceForSale: number;
    public assignee: TicketAssignee;
}

export class TicketAssignee {
    public id: string;
    public username: string;
}