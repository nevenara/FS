export class GetIncomingTicketsVsPersonalizedTicketsResponse {
    public data: GetIncomingTicketsVsPersonalizedTicketsPerYearResponse[];
}

export class GetIncomingTicketsVsPersonalizedTicketsPerYearResponse {
    public year: number;
    public incomingTicketsCount: number;
    public personalizedTicketsCount: number;
}