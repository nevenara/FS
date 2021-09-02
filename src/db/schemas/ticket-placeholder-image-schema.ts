import * as mongoose from 'mongoose';

const ticketPlaceholderImageSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    ticketId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Ticket'
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
    }
});

module.exports = mongoose.model('TicketPlaceholderImage', ticketPlaceholderImageSchema);
