// const mongoose = require('mongoose');
import * as mongoose from 'mongoose';

const eventSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    
    eventName: { 
        type: String
    },
    locationName: { 
        type: String, 
    },
    locationAddress: { 
        type: String, 
    },
    date: {
        type: Date
    },
    beginTime: {
        type: Date
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
    },
    doorsOpen: {
        type: String
    },
    termsOfEvent: {
        type: String
    },    
    organizerId: {
        type: [String]
    }, 
});

module.exports = mongoose.model('Event', eventSchema);
