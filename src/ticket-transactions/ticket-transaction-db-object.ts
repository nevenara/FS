import { DbObject } from "../db/db-object";
import { TicketTransactionType } from "../models/ticket-transaction-type";
import { TicketStatus } from "../tickets/model/ticket-status";
import { ITicketTransactionValue } from "./ticket-transaction-value";

export class TicketTransactionDbObject extends DbObject {
    private ticketTransactionData: ITicketTransactionValue;

    constructor(ticketTransactionValue?: ITicketTransactionValue) {
        super(ticketTransactionValue);
        this.ticketTransactionData = this.data as any;
    }

    public get createdBy(): string {
        return this.ticketTransactionData.createdBy;
    }

    public set createdBy(v: string) {
        this.ticketTransactionData.createdBy = v;
    }

    public get createdOn(): Date {
        return this.ticketTransactionData.createdOn;
    }

    public set createdOn(v: Date) {
        this.ticketTransactionData.createdOn = v;
    }

    public get ticketId(): string {
        return this.ticketTransactionData.ticketId;
    }

    public set ticketId(v: string) {
        this.ticketTransactionData.ticketId = v;
    }

    public get previousOwner(): string {
        return this.ticketTransactionData.previousOwner;
    }

    public set previousOwner(v: string) {
        this.ticketTransactionData.previousOwner = v;
    }

    public get newOwner(): string {
        return this.ticketTransactionData.newOwner;
    }

    public set newOwner(v: string) {
        this.ticketTransactionData.newOwner = v;
    }

    public get previousStatus(): TicketStatus {
        return this.ticketTransactionData.previousStatus;
    }

    public set previousStatus(v: TicketStatus) {
        this.ticketTransactionData.previousStatus = v;
    }

    public get newStatus(): TicketStatus {
        return this.ticketTransactionData.newStatus;
    }

    public set newStatus(v: TicketStatus) {
        this.ticketTransactionData.newStatus = v;
    }

    public get transactionType(): TicketTransactionType {
        return this.ticketTransactionData.transactionType;
    }

    public set transactionType(v: TicketTransactionType) {
        this.ticketTransactionData.transactionType = v;
    }

    public get description(): string {
        return this.ticketTransactionData.description;
    }

    public set description(v: string) {
        this.ticketTransactionData.description = v;
    }

    public get organizerId(): string {
        return this.ticketTransactionData.organizerId;
    }
    public set organizerId(v: string) {
        this.ticketTransactionData.organizerId = v;
    }

}