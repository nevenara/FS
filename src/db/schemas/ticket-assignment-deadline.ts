import * as mongoose from 'mongoose';
import { TicketAssignmentDeadlineType } from '../../common/email-service/models/ticket-assignment-deadline-template';
import { TicketAssignmentDeadlineStatus } from '../../models/ticket-assignment-deadline-status';

const ticketAssignmentDeadlineTemplateSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    firstName: String,
    lastName: String,
    event: String,
    date: String,
    bookingId: String,
    ticketId: String,
    hours: Number,
    deadline: String,
    deadlineType: {
        type: TicketAssignmentDeadlineType
    } 
});

module.exports = mongoose.model('TicketAssignmentDeadlineTemplate', ticketAssignmentDeadlineTemplateSchema);

const ticketAssignmentDeadlineSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User'
    },
    ticketId: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Ticket'
    },
    deadlineDate: {
        type: Date
    },
    emailParams: {
        type: ticketAssignmentDeadlineTemplateSchema
    },
    status: {
        type: TicketAssignmentDeadlineStatus
    }
});

module.exports = mongoose.model('TicketAssignmentDeadline', ticketAssignmentDeadlineSchema);