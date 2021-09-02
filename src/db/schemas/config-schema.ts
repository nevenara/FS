import { StringDecoder } from "string_decoder";

export {};
const mongoose = require('mongoose');

const configsSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    timezone: {
        type: String
    },
    supportPhone: {
        type: String
    },
    supportEmail: {
        type: String
    },
    cronApiKey: {
        type: String
    },
    maxNumberOfLinkedAccounts: {
        type: Number
    },
    //in days
    maxPasswordRecoveryPeriod: {
        type: Number
    },
    //in minutes
    reservationExpirationTime: {
        type: Number
    },
    maxRowDistance: {
        type: Number
    },
    maxSeatDistance: {
        type: Number
    },
    //num of tickets per page
    pageLimit: {
        type: Number
    }
});

module.exports = mongoose.model('Configs', configsSchema);

const configSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    configs: configsSchema
});

module.exports = mongoose.model('Config', configSchema);
