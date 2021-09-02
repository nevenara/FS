import { IDbData } from "../db/idb-data";
import { TicketTransactionType } from "../models/ticket-transaction-type";
import { TicketStatus } from "../tickets/model/ticket-status";

export interface ITicketTransactionValue extends IDbData {
    createdBy: string;
    createdOn: Date;
    ticketId: string;
    previousOwner: string;
    newOwner: string;
    previousStatus: TicketStatus;
    newStatus: TicketStatus;
    transactionType: TicketTransactionType;
    description: string;
    organizerId: string;
}