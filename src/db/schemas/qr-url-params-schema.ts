import * as mongoose from 'mongoose';
import { IdVerificationPageType } from '../../tickets/model/id-verification-page-type';

const qrUrlParamsSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    pageType: { 
        type: IdVerificationPageType
    },
    urlParams: {
        type: String
    },
    selectedId: {
        type: String
    }
   
});

module.exports = mongoose.model('QRUrlParams', qrUrlParamsSchema);
