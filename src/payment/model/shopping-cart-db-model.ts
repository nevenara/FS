import { DbObject } from "../../db/db-object";
import { ShoppingCartType } from "../../db/schemas/shopping-cart-type";
import { ShoppingCart, ShoppingCartTicket } from "./shopping-cart";
import { ShoppingCartStatus } from "./shopping-cart-status";
import { IShoppingCartValue } from "./shopping-cart-value";

export class ShoppingCartDbModel extends DbObject implements IShoppingCartValue {
    private shoppingCartData: IShoppingCartValue;

    constructor(model?: IShoppingCartValue) {
        super(model);
        this.shoppingCartData = this.data as any;
    }

    public get _id(): string {
        return this.id;
    }

    public set _id(v: string) {
        this.id = v;
    }

    public get status(): ShoppingCartStatus {
        return this.shoppingCartData.status;
    }

    public set status(v: ShoppingCartStatus) {
        this.shoppingCartData.status = v;
    }

    public get price(): number {
        return this.shoppingCartData.price;
    }

    public set price(v: number) {
        this.shoppingCartData.price = v;
    }

    public get paymentIntentId(): string {
        return this.shoppingCartData.paymentIntentId;
    }

    public set paymentIntentId(v: string) {
        this.shoppingCartData.paymentIntentId = v;
    }

    public get paymentIntentClientSecret(): string {
        return this.shoppingCartData.paymentIntentClientSecret;
    }

    public set paymentIntentClientSecret(v: string) {
        this.shoppingCartData.paymentIntentClientSecret = v;
    }

    public get tickets(): ShoppingCartTicket[] {
        return this.shoppingCartData.tickets;
    }

    public set tickets(v: ShoppingCartTicket[]) {
        this.shoppingCartData.tickets = v;
    }

    public get paymentIntentStatus(): string {
        return this.shoppingCartData.paymentIntentStatus;
    }
    public set paymentIntentStatus(v: string) {
        this.shoppingCartData.paymentIntentStatus = v;
    }

    public get stype(): ShoppingCartType {
        return this.shoppingCartData.stype;
    }
    public set stype(v: ShoppingCartType) {
        this.shoppingCartData.stype = v;
    }

    public get paymentMethod(): string {
        return this.shoppingCartData.paymentMethod;
    }
    public set paymentMethod(v: string) {
        this.shoppingCartData.paymentMethod = v;
    }

    
    public get statusChangedOn() : Date {
        return this.shoppingCartData.statusChangedOn;
    }
    public set statusChangedOn(v : Date) {
        this.shoppingCartData.statusChangedOn = v;
    }
    
}