export class GetTotalPersonalizedTicketsPerEventResponse {
    data: TotalPersonalizedTicketsPerEventResponse[];
}

export class TotalPersonalizedTicketsPerEventResponse {
    eventName: string;
    totalPersonalizedTickets: number;
}