import * as mongoose from 'mongoose';

const seatPlanSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    
    eventId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Event'
    },
    url: {
        type: String
    },
    image: {
        type: Buffer
    },
    imageMimetype: {
        type: String
    },
    imageSize: {
        type: Number
    },
    imageOriginalName: {
        type: String
    }
});

module.exports = mongoose.model('SeatPlan', seatPlanSchema);
