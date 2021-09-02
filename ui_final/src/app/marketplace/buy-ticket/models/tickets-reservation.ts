export class TicketsReservation {
    public eventName: string;
    public date: string;
    public beginTime: string;
    public doorsOpen: string;
    public seat: string;
    public locationName: string;
    public locationAddress: string;
    public priceForSale: number;
    public priceCurrency: string;
    public ticketId: string;
    public bookingId: string;
    public tickets: Array<BestCloseTicket> = [];
    public organizerName: string;
    public reservationTime: number;
    public assignee: TicketAssignee;
    public id: string;
    public eventId: string;
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