export class AssignTicketRequest {
    tickets: Array<TicketToAssign> = [];
}

export class TicketToAssign {
    public ticketId: string;
    public userId: string;
}