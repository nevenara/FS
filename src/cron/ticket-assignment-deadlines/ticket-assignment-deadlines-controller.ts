import { IEmailSender } from "../../common/email-service/email-sender";
import { IUserContext } from "../../common/user-context";
import { TicketAssignmentDeadlineStatus } from "../../models/ticket-assignment-deadline-status";
import { TicketAssignmentDeadlineDbObject } from "../../ticket-assignment-deadlines/ticket-assignment-deadline-db-object";
import { ITicketAssignmentDeadlineRepository } from "../../ticket-assignment-deadlines/ticket-assignment-deadline-repository";
import { ITicketAssignmentDeadlineValue } from "../../ticket-assignment-deadlines/ticket-assignment-deadline-value";
import { SearchTicketRepoRequest } from "../../tickets/model/search-ticket-repo-request";
import { ITicketValue } from "../../tickets/model/ticket";
import { TicketStatus } from "../../tickets/model/ticket-status";
import { ITicketRepository } from "../../tickets/ticket-repository";
import { IUserRepository } from "../../user/user-repository";
import { IUserValue } from "../../user/user-value";
import { SendDeadlineEmailsResponse } from "./models/send-deadline-emails-response";

export interface ITicketAssignmentDeadlinesController {
    sendDeadlineEmails(): Promise<SendDeadlineEmailsResponse>;
}

export class TicketAssignmentDeadlinesCountroller implements ITicketAssignmentDeadlinesController {
    constructor(
        private context: IUserContext,
        private ticketAssignmentDeadlineRepository: ITicketAssignmentDeadlineRepository,
        private ticketRepository: ITicketRepository,
        private userRepository: IUserRepository,
        private emailSender: IEmailSender
    ){}

    public async sendDeadlineEmails(): Promise<SendDeadlineEmailsResponse> {
        let deadlines: Array<ITicketAssignmentDeadlineValue> = await this.ticketAssignmentDeadlineRepository.getPastPendingTickets();

        for (let i = 0; i < deadlines.length; i++) {
            let ticket: ITicketValue = await this.ticketRepository.getTicketById(deadlines[i].ticketId);
            
            if (!ticket) {
                continue;
            }

            let user: IUserValue = await this.userRepository.getUserById(ticket.userId);
            
            if (!user) {
                continue;
            }

            let searchModel: SearchTicketRepoRequest = new SearchTicketRepoRequest();
            searchModel.eventName = ticket.eventName;
            searchModel.beginTime = ticket.beginTime;
            searchModel.fromDate = ticket.date;
            searchModel.toDate = ticket.date;
            searchModel.notInTicketIds = [ticket._id];
            searchModel.userId = ticket.userId;
            searchModel.firstName = ticket.firstName;
            searchModel.lastName = ticket.lastName;

            let ticketsFromSameEvent = await this.ticketRepository.search(searchModel);

            if (user.firstname === ticket.firstName && user.lastname === ticket.lastName && (!ticketsFromSameEvent || ticket.status == TicketStatus.Personalized)) {
                deadlines[i].status = TicketAssignmentDeadlineStatus.Cancelled;
                await this.ticketAssignmentDeadlineRepository.updateObjectById(deadlines[i]._id, new TicketAssignmentDeadlineDbObject(deadlines[i]));

                let deadlinesToCancel: Array<ITicketAssignmentDeadlineValue> = await this.ticketAssignmentDeadlineRepository.getAllPendingTicketsByTicketId(deadlines[i].ticketId);

                for (let j = 0; j < deadlinesToCancel.length; j++) {
                    deadlinesToCancel[j].status = TicketAssignmentDeadlineStatus.Cancelled;
                    await this.ticketAssignmentDeadlineRepository.updateObjectById(deadlinesToCancel[j]._id, new TicketAssignmentDeadlineDbObject(deadlinesToCancel[j]));
                }
            } else {
                await this.emailSender.sendTicketAssignmentDeadlineEmail(user.email, deadlines[i].emailParams);
                deadlines[i].status = TicketAssignmentDeadlineStatus.Sent;
                await this.ticketAssignmentDeadlineRepository.updateObjectById(deadlines[i]._id, new TicketAssignmentDeadlineDbObject(deadlines[i]));
            }
        }

        return new SendDeadlineEmailsResponse();
    }
}