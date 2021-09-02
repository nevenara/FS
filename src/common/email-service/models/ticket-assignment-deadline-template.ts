export class TicketAssignmentDeadlineTemplate {
    public firstName: string;
    public lastName: string;
    public event: string;
    public date: string;
    public bookingId: string;
    public ticketId: string;
    public hours: number;
    public deadline: string;
    public deadlineType: TicketAssignmentDeadlineType;
    public lang: string;
}

export enum TicketAssignmentDeadlineType {
    AssignTicketHolder = 'AssignTicketHolder',
    ContactSupport = 'ContactSupport',
    TicketIsBlocked = 'TicketIsBlocked'
}
