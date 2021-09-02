import * as mongoose from 'mongoose';


const sessionLogSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    sessionId: {
        type: String
    },
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User'
    },
    userAgent: {
        type: String
    },
    startDate: {
        type: Date
    },
    logOutDate: {
        type: Date
    }
});

module.exports = mongoose.model('SessionLog', sessionLogSchema);
