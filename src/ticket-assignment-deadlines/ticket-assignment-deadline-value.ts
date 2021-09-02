import { TicketAssignmentDeadlineTemplate } from "../common/email-service/models/ticket-assignment-deadline-template";
import { IDbData } from "../db/idb-data";
import { TicketAssignmentDeadlineStatus } from "../models/ticket-assignment-deadline-status";

export interface ITicketAssignmentDeadlineValue extends IDbData {
    userId: string;
    ticketId: string;
    deadlineDate: Date;
    emailParams: TicketAssignmentDeadlineTemplate;
    status: TicketAssignmentDeadlineStatus;
}