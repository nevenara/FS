import { ShoppingCartType } from "../../db/schemas/shopping-cart-type";
import { TicketStatus } from "../../tickets/model/ticket-status";
import { IShoppingCartValue } from "./shopping-cart-value";
import { ShoppingCartStatus } from "./shopping-cart-status";

export class ShoppingCart implements IShoppingCartValue {
    public _id: string;
    public status: ShoppingCartStatus;
    public paymentMethod: string;
    public price: number;
    public paymentIntentId: string;
    public paymentIntentClientSecret: string;
    public tickets: ShoppingCartTicket[];
    public createdOn: Date;
    public paymentIntentStatus: string;
    public stype: ShoppingCartType;
    public statusChangedOn: Date;
}

export class ShoppingCartTicket {
    public ticketId: string;
    public previousStatus: TicketStatus;
    public previousOwner: string;
    public newStatus: TicketStatus;
    public newOwner: string;
    public stripeAccountId: string;
    public priceForSale: number;
    public paymentIntentStatus: string;
}

export class ShoppingCartTicketSeller {
    public sellerId: string;
    public totalPrice: number;
    public stripeAccountId: string;
}