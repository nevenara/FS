export {};
const mongoose = require('mongoose');

const passwordRecoverySchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    email: String,
    uuid: String,
    expirationTime: Date
});

module.exports = mongoose.model('PasswordRecoveryRequests', passwordRecoverySchema);
