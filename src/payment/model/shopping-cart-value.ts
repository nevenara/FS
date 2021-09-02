import { IDbData } from "../../db/idb-data";
import { ShoppingCartType } from "../../db/schemas/shopping-cart-type";
import { ShoppingCartTicket } from "./shopping-cart";
import { ShoppingCartStatus } from "./shopping-cart-status";

export interface IShoppingCartValue extends IDbData {
    status: ShoppingCartStatus;
    price: number;
    paymentIntentId: string;
    paymentIntentClientSecret: string;
    tickets: ShoppingCartTicket[];
    paymentIntentStatus: string;
    stype: ShoppingCartType;
    paymentMethod: string;
    statusChangedOn: Date;
}