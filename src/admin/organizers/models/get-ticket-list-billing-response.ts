export class GetTicketListBillingResponse {
    rows: BillingRow[];
    ticketsTotal: number;
    totalSum: number;

    eventName: string;
    eventDate: string;
}

export class BillingRow {
    ticketPrice: number;
    amountOfTickets: number;
    fee: number;
    subTotal: number;
}