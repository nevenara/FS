import { TicketBuy } from "../../tickets/model/pay-tickets-request";


export class CreatePaymentIntentRequest{
    public tickets: Array<TicketBuy>;
}