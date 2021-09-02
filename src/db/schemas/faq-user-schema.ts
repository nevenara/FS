import * as mongoose from 'mongoose';

const faqUserSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User'
    },
    faqId: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'FAQ'
    },
    //false --> dislike
    like: Boolean
   
});

module.exports = mongoose.model('FAQUser', faqUserSchema);
