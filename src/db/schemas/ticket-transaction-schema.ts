import { TicketTransactionType } from "../../models/ticket-transaction-type";
import { TicketStatus } from "../../tickets/model/ticket-status";

export {};
const mongoose = require('mongoose');

const ticketTransactionSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    createdBy: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User'
    },
    createdOn: {
        type: Date,
        required: true
    },
    ticketId: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Ticket', 
        required: true 
    },
    previousOwner: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User'
    },
    newOwner: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User'
    },
    previousStatus: {
        type: TicketStatus
    },
    newStatus: {
        type: TicketStatus
    },
    transactionType: {
        type: TicketTransactionType,
        required: true
    },
    description: {
        type: String
    },
    organizerId: {
        type: String
    }
});

module.exports = mongoose.model('TicketTransaction', ticketTransactionSchema);
