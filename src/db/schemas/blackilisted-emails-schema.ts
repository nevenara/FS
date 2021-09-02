export {};
const mongoose = require('mongoose');

const blackilistedEmailsSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    domain: String
});

module.exports = mongoose.model('BlacklistedEmails', blackilistedEmailsSchema);
