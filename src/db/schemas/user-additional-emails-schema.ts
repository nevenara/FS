export {};
const mongoose = require('mongoose');

const userAdditionalEmailsSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    email: String,
    uuid: String,
    isVerified: Boolean
});

module.exports = mongoose.model('UserAdditionalEmails', userAdditionalEmailsSchema);
