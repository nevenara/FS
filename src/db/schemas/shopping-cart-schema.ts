import * as mongoose from 'mongoose';
import { ShoppingCartStatus } from "../../payment/model/shopping-cart-status";
import { ShoppingCartType } from './shopping-cart-type';

const shoppingCartTicketSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    ticketId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ticket'
    },
    previousStatus: {
        type: Number
    },
    previousOwner: {
        type: String
    },
    newStatus: {
        type: Number
    },
    newOwner: {
        type: String
    },
    stripeAccountId: {
        type: String
    },
    priceForSale: {
        type: String
    },
});

module.exports = mongoose.model('ShoppingCartTicket', shoppingCartTicketSchema);

const shoppingCartSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    status: {
        type: ShoppingCartStatus
    },
    price: {
        type: Number
    },
    paymentIntentId: {
        type: String
    },
    paymentIntentClientSecret: {
        type: String
    },
    createdOn: {
        type: Date
    },
    tickets: {
        type: [shoppingCartTicketSchema]
    },
    paymentIntentStatus: {
        type: String
    },
    stype: {
        type: ShoppingCartType,
        required: true
    },
    paymentMethod: {
        type: String
    },
    statusChangedOn: {
        type: Date
    }
});

module.exports = mongoose.model('ShoppingCart', shoppingCartSchema);