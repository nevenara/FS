import * as mongoose from 'mongoose';

const UserSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    username: {
        type: String,
        unique: true,
        sparse: true
    },
    email: {
        type: String,
        unique: true
    },
    password: {
        type: String
    },
    usertype: {
        type: Number,
        required: true
    },
    status: {
        type: String,
    },
    emailVerificationGuid: {
        type: String,
    },
    gender: {
        type: String
    },
    firstname: {
        type: String
    },
    lastname: {
        type: String
    },
    birthDate: {
        type: Date
    },
    phone: {
        type: String
    },
    address: {
        type: String
    },
    postCode: {
        type: String
    },
    city: {
        type: String
    },
    country: {
        type: String
    },
    relationToMainAccount: {
        type: String
    },
    mainAccountId: {
        type: String
    },
    stripeAccountId: {
        type: String
    },
    bankAccountId: {
        type: String
    },
    stripeAccountStatus: {
        type: String
    },
    organizerId: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Organizer'
    },
    createdOn: {
        type: Date
    },
    faceMatchStatus: {
        type: Boolean
    },
    faceMatchScore: {
        type: Number
    },
    stripeErrors:{
        type: [String]
    }
});

module.exports = mongoose.model('User', UserSchema);
