// const mongoose = require('mongoose');
import * as mongoose from 'mongoose';
import { CheckInFailureReasonType } from '../../models/check-in-failure-reason-type';
import { VerificationStatusType } from '../../models/verification-status-type';

const checkInSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    
    ticketId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Ticket'
    },
    date: { 
        type: Date
    },
    status: { 
        type: VerificationStatusType
    },
    reason: { 
        type: CheckInFailureReasonType
    },
    eventId: {
        type: String
    }
});

module.exports = mongoose.model('CheckIn', checkInSchema);
