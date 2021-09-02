import * as mongoose from 'mongoose';

const organizerPlaceholderImageSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    organizerId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Organizer'
    },
    image: Buffer,
    originalname: {
        type: String
    },
    mimetype: {
        type: String
    },
    size: {
        type: Number
    },
    isDefaultImage: {
        type: Boolean
    }
});

module.exports = mongoose.model('OrganizerPlaceholderImage', organizerPlaceholderImageSchema);
