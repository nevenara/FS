export class PayTicketsRequest {
    public tickets: Array<TicketBuy>;
    public ticketsToCancel: Array<string>;
    public paymentMethod: string;
}

export class TicketBuy {
    public ticketId: string;
    public userId: string;
}