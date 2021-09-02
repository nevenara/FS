export class UserTicketsFromSameEventModel {
    public eventName: string;
    public date: string;
    public beginTime: string;
    public doorsOpen: string;
    public seat: string;
    public location: string;
    public originalPrice: number;
    public priceCurrency: Currency;
    public ticketId: string;
    public bookingId: string;
    public tickets: Array<TicketFromSameEvent> = [];
    public eventId: string;
}

export class TicketFromSameEvent {
    public id: string;
    public ticketId: string;
    public seat: string;
    public priceForSale: number;
    public isChecked: boolean;
}

export enum Currency{
    EUR = 1,
    USD = 2
}