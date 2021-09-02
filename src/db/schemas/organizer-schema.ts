import * as mongoose from 'mongoose';
import { OrganizerStatus } from '../../organizer/models/organizer-status';

const organizerSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,

    companyName: {
        type: String
    }, 
    email: { 
        type: String,
        unique: true
    },
    contactPerson: { 
        type: String 
    },
    address: { 
        type: String, 
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
    phone: {
        type: String
    },
    url: {
        type: String
    },
    status: {
        type: OrganizerStatus
    },
   
    ticketReturn: {
        type: Boolean
    },
    //Sells at Fansafe Ticketshop
    fansafeSale: {
        type: Boolean
    },

    //URL should link to the Import Settings of the specific organizer in Lomnido
    //Dashboard
    linkLomnido: {
        type: String
    },

    //Percent
    revenueSharing: {
        type: Number
    },

    created: {
        type: Date
    }
});

module.exports = mongoose.model('Organizer', organizerSchema);

