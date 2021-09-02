import * as mongoose from 'mongoose';

const invalidIdCheckSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User'
    },
    reason: {
        type: String
    }
});

module.exports = mongoose.model('InvalidIdCheck', invalidIdCheckSchema);