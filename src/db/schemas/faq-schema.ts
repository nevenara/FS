import * as mongoose from 'mongoose';
import { FAQCategory } from '../../faq/models/faq-category';

const faqSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
   question: String,
   answer: String,
   lastUpdate: Date,
   likes: Number,
   dislikes: Number,
   category: {
    type: FAQCategory
   }
   
});

module.exports = mongoose.model('FAQ', faqSchema);
