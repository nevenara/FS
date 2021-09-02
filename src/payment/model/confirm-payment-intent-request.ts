import { ShoppingCartStatus } from "./shopping-cart-status";

export class ConfirmPaymentIntentRequest{
    public paymentIntentId: string;
}

export class ConfirmPaymentIntentResponse{
    public shoppingCartStatus: ShoppingCartStatus;
}