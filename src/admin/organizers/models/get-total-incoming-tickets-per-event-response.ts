export class GetTotalIncomingTicketsPerEventResponse {
    data: TotalIncomingTicketsPerEventResponse[];
}

export class TotalIncomingTicketsPerEventResponse {
    eventName: string;
    totalIncomingTickets: number;
}