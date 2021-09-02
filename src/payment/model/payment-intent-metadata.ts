import { TicketBuy } from "../../tickets/model/pay-tickets-request";
import { ShoppingCart } from "./shopping-cart";
import { IShoppingCartValue } from "./shopping-cart-value";

export class PaymentIntentMetadata{
    public shoppingCartId: string;
}

export enum PaymentIntentMetadataKey{
    buyerId = 'buyerId',
    shoppingCart = 'shoppingCart'
}