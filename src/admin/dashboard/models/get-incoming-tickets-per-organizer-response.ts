export class GetIncomingTicketsPerOrganizerResponse {
    public incomingTicketsCountPerOrganizer: GetIncomingTicketsPerOrganizerPerMonthResponse[];
}

export class GetIncomingTicketsPerOrganizerPerMonthResponse {
    public year: number;
    public month: number;
    public organizer: string;
    public organizerId: string;
    public incomingTicketsCount: number;
}