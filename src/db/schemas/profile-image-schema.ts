export {};
const mongoose = require('mongoose');

const profileImageSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User'
    },
    image: Buffer,
    smallImage: Buffer,
    isDefaultImage: {
        type: Boolean
    },
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

module.exports = mongoose.model('ProfileImage', profileImageSchema);
