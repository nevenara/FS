import { EntityType } from "../db/entity-type";
import { IMongoRepository, MongoRepository } from "../db/mongo-repository";
import { TicketAssignmentDeadlineStatus } from "../models/ticket-assignment-deadline-status";
import { TicketAssignmentDeadlineDbObject } from "./ticket-assignment-deadline-db-object";
import { ITicketAssignmentDeadlineValue } from "./ticket-assignment-deadline-value";

export interface ITicketAssignmentDeadlineRepository extends IMongoRepository<TicketAssignmentDeadlineDbObject> {
    getPastPendingTickets(): Promise<Array<ITicketAssignmentDeadlineValue>>;
    getAllPendingTicketsByTicketId(ticketId: string): Promise<Array<ITicketAssignmentDeadlineValue>>;
}

export class TicketAssignmentDeadlineRepository extends MongoRepository<TicketAssignmentDeadlineDbObject> implements ITicketAssignmentDeadlineRepository {
    constructor(){
        super(EntityType.TicketAssignmentDeadline);
    }

    public async getPastPendingTickets(): Promise<Array<ITicketAssignmentDeadlineValue>> {
        let searchModel = {
            deadlineDate: {'$lte': Date()},
            status: TicketAssignmentDeadlineStatus.Pending
        }

        const tickets = await this.getModel().find(searchModel).exec();

        return tickets;
    }

    public async getAllPendingTicketsByTicketId(ticketId: string): Promise<Array<ITicketAssignmentDeadlineValue>> {
        let searchModel = {
            ticketId: ticketId,
            status: TicketAssignmentDeadlineStatus.Pending
        }

        const tickets = await this.getModel().find(searchModel).exec();

        return tickets;
    }
}