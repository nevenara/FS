// const mongoose = require('mongoose');
import * as mongoose from 'mongoose';
import { TicketCategory } from '../../models/ticket-category';
import { TicketStatus } from '../../tickets/model/ticket-status';

const ticketSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    category: {
        type: TicketCategory
    },
    bookingId: {
        type: String,
    }, 
    ticketId: { 
        type: String
    },
    originalPrice: { 
        type: Number
    },
    priceForSale: { 
        type: Number
    },
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
    doorsOpen: {
        type: Date
    },
    termsOfEvent: {
        type: String
    },
    seat: {
        type: String
    },
    qrCode: {
        type: String
    },
    qrUuid: {
        type: String
    },
    barcode: {
        type: String
    },
    ticketHolder: {
        type: String
    },
    organizerId: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Organizer'
    },
    additionalInfo: {
        type: String
    },
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User'
    },
    originalUserId: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User'
    },
    status: {
        type: Number,
        enum: [TicketStatus.NonPersonalized, TicketStatus.Blocked, TicketStatus.ForSale, TicketStatus.NotAvailable, TicketStatus.Personalized, TicketStatus.RePersonalisationWaiting, TicketStatus.Returned],
        required: true
    },
    email: {
        type: String
    },
    reservationExpirationDate: {
        type: Date
    },
    reservedOn: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User'
    },
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    syncDate: {
        type: Date
    },
    eventId: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Event'
    },
    pendingUsername: {
        type: String
    }
});

module.exports = mongoose.model('Ticket', ticketSchema);
