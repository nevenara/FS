export class UserTicketsForSaleFromSameEventModel {
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
}

export class TicketFromSameEvent {
    public id: string;
    public ticketId: string;
    public seat: string;
    public originalPrice: number;
    public isChecked: boolean;
}

export enum Currency{
    EUR = 1,
    USD = 2
}