import { from } from "rxjs";
import {TicketOnSaleRequest} from './ticket-on-sale-request'

export class GetEditTicketOnSaleRequest {
    tickets: Array<TicketOnSaleRequest>;
}