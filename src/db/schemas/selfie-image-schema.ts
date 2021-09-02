import * as mongoose from 'mongoose';

const selfieImageSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User'
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
});

module.exports = mongoose.model('SelfieImage', selfieImageSchema);
