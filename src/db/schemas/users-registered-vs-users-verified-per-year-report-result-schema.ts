import * as mongoose from 'mongoose';

const usersRegisteredVsUsersVerifiedPerYearReportResultSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    year: {
        type: Number
    },
    usersRegisteredCount: {
        type: Number
    },
    usersVerifiedCount: {
        type: Number
    }

});

module.exports = mongoose.model('UsersRegisteredVsUsersVerifiedPerYearReportResult', usersRegisteredVsUsersVerifiedPerYearReportResultSchema);
