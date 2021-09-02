import { EntityType } from "../db/entity-type";
import { IMongoRepository, MongoRepository } from "../db/mongo-repository";
import { GetUsersCountForCustomTimePeriodRepoRequest } from "./models/get-users-count-for-custom-time-period-repo-request";
import { UserActivityLogDbObject } from "./user-activity-log-db-object";
import { Model } from "mongoose";
import { UserActivityType } from "../models/user-activity-type";
import moment = require("moment");
import { ReportResultMatchType } from "../admin/dashboard/models/report-result-match-type";
import { QueryObject } from "../db/query/query-object";
import { IUserActivityLogValue } from "./user-activity-log-value";

export interface IUserActivityLogRepository extends IMongoRepository<UserActivityLogDbObject> {
    getUserActivity(userId: string): Promise<IUserActivityLogValue[]>;
    getUsersCountForCustomTimePeriod(request: GetUsersCountForCustomTimePeriodRepoRequest): Promise<number>;
    getUsersRegisteredVsUsersVerifiedGroupedPerYear(current: ReportResultMatchType): Promise<any>;
    getVerificationDateForUser(userId: string): Promise<Date>;
    getLastChangeLinkedAccounts(userId: string): Promise<Date>;
}

export class UserActivityLogRepository extends MongoRepository<UserActivityLogDbObject> implements IUserActivityLogRepository {
    constructor() {
        super(EntityType.UserActivityLog);
    }


    public async getLastChangeLinkedAccounts(userId: string): Promise<Date> {
        const query = new QueryObject(new UserActivityLogDbObject());
        query.addSelectOption({ field: UserActivityLogDbObject.UserIdFieldName, value: userId });
        query.addSelectOption({ field: UserActivityLogDbObject.ActivityTypeFieldName, value: UserActivityType.LinkedAccountDeleted });


        const results: JSON[] = await this.find(query);

        if (results && results.length > 0) {
            const log = (results[0] as unknown) as IUserActivityLogValue
            return log.date;
        }

        return null;
    }


    public async getVerificationDateForUser(userId: string): Promise<Date> {
        const query = new QueryObject(new UserActivityLogDbObject());
        query.addSelectOption({ field: UserActivityLogDbObject.UserIdFieldName, value: userId });
        query.addSelectOption({ field: UserActivityLogDbObject.ActivityTypeFieldName, value: UserActivityType.IdVerified });


        const results: JSON[] = await this.find(query);

        if (results && results.length > 0) {
            const log = (results[0] as unknown) as IUserActivityLogValue
            return log.date;
        }


        return null;
    }

    public async getUserActivity(userId: string): Promise<IUserActivityLogValue[]> {
        const query = new QueryObject(new UserActivityLogDbObject());
        query.addSelectOption({ field: UserActivityLogDbObject.UserIdFieldName, value: userId });

        const results: JSON[] = await this.find(query);

        const logs: IUserActivityLogValue[] = [];
        
        if (results && results.length > 0) {
            const log = (results[0] as unknown) as IUserActivityLogValue
            logs.push(log);
        }

        return logs;
    }

    public async getUsersCountForCustomTimePeriod(request: GetUsersCountForCustomTimePeriodRepoRequest): Promise<number> {
        const model: Model<UserActivityLogDbObject> = this.getModel();

        let condition = {};
        let dateCondition = {};

        dateCondition['$lte'] = request.toDate;
        dateCondition['$gte'] = request.fromDate;

        condition['date'] = dateCondition;
        condition['activityType'] = request.activityType;

        const count = await model.countDocuments(condition);
        return count;
    }

    public async getUsersRegisteredVsUsersVerifiedGroupedPerYear(current: ReportResultMatchType): Promise<any> {
        let model = this.getModel();

        const pipeline = [];

        pipeline[0] = {
            '$project': {
                _id: 0,
                year: { $year: "$date" },
                userRegistered: {
                    $cond: [
                        {
                            $eq: ["$activityType", UserActivityType.EmailVerified]
                        }, 1, 0]
                },
                userVerified: {
                    $cond: [{ $eq: ["$activityType", UserActivityType.IdVerified] }, 1, 0]
                }
            }
        };

        if (current == ReportResultMatchType.PreviousYears) {
            //previous years
            pipeline[1] = {
                '$match': {
                    year: { $lt: moment().year() }
                }
            };
        }
        else if (current == ReportResultMatchType.CurrentYear) {
            pipeline[1] = {
                '$match': {
                    year: { $eq: moment().year() }
                }
            };
        }
        else if (current == ReportResultMatchType.PreviousYear) {
            pipeline[1] = {
                '$match': {
                    year: { $eq: moment().year() - 1 }
                }
            };
        }

        pipeline[2] = {
            '$group': {
                _id: "$year",
                userRegisteredCount: {
                    $sum: "$userRegistered"
                },
                userVerifiedCount: {
                    $sum: "$userVerified"
                }
            }
        };

        let results: JSON[] = await model.aggregate(pipeline);

        if (results && results.length > 0) {
            return results;
        }

        return [];
    }
}