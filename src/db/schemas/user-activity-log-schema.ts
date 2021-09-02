import * as mongoose from 'mongoose';

const userActivityLogSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User'
    },
    activityType: {
        type: String
    },
    date: {
        type: Date
    },
    details: {
        type: String
    },
    previousStripeAccountStatus: {
        type: String
    },
    newStripeAccountStatus: {
        type: String
    },
    performedBy: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User'
    }
});

module.exports = mongoose.model('UserActivityLog', userActivityLogSchema);
