import { TicketAssignmentDeadlineTemplate } from "../common/email-service/models/ticket-assignment-deadline-template";
import { DbObject } from "../db/db-object";
import { TicketAssignmentDeadlineStatus } from "../models/ticket-assignment-deadline-status";
import { ITicketAssignmentDeadlineValue } from "./ticket-assignment-deadline-value";

export class TicketAssignmentDeadlineDbObject extends DbObject {
    private ticketAssignmentDeadlineData: ITicketAssignmentDeadlineValue;

    constructor(ticketAssignmentDeadlineValue?: ITicketAssignmentDeadlineValue) {
        super(ticketAssignmentDeadlineValue);
        this.ticketAssignmentDeadlineData = this.data as any;
    }

    public get userId(): string {
        return this.ticketAssignmentDeadlineData.userId;
    }

    public set userId(v: string) {
        this.ticketAssignmentDeadlineData.userId = v;
    }

    public get ticketId(): string {
        return this.ticketAssignmentDeadlineData.ticketId;
    }

    public set ticketId(v: string) {
        this.ticketAssignmentDeadlineData.ticketId = v;
    }

    public get deadlineDate(): Date {
        return this.ticketAssignmentDeadlineData.deadlineDate;
    }

    public set deadlineDate(v: Date) {
        this.ticketAssignmentDeadlineData.deadlineDate = v;
    }

    public get emailParams(): TicketAssignmentDeadlineTemplate {
        return this.ticketAssignmentDeadlineData.emailParams;
    }

    public set emailParams(v: TicketAssignmentDeadlineTemplate) {
        this.ticketAssignmentDeadlineData.emailParams = v;
    }

    public get status(): TicketAssignmentDeadlineStatus {
        return this.ticketAssignmentDeadlineData.status;
    }

    public set status(v: TicketAssignmentDeadlineStatus) {
        this.ticketAssignmentDeadlineData.status = v;
    }
}