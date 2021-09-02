import { TicketTransactionType } from "../../models/ticket-transaction-type";

export class GetTicketsCountForCustomTimePeriodRepoRequest {
    public fromDate: Date;
    public toDate: Date;
    public transactionType: TicketTransactionType[];
    public organizerId: string;
} 