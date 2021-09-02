import * as mongoose from 'mongoose';

const incomingTicketsPerOrganizerReportResultSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    year: {
        type: Number
    },
    month: {
        type: Number
    },
    incomingTicketsCount: {
        type: Number
    },
    organizerId: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Organizer'
    }

});

module.exports = mongoose.model('IncomingTicketPerOrganizerReportResult', incomingTicketsPerOrganizerReportResultSchema);
