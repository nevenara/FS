import * as mongoose from 'mongoose';

const incomingTicketsVsPersonalizedTicketsPerYearReportResultSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    year: {
        type: Number
    },
    incomingTicketsCount: {
        type: Number
    },
    personalizedTicketsCount: {
        type: Number
    },
    organizerId: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Organizer'
    }

});

module.exports = mongoose.model('IncomingTicketsVsPersonalizedTicketsPerYearReportResult', incomingTicketsVsPersonalizedTicketsPerYearReportResultSchema);
