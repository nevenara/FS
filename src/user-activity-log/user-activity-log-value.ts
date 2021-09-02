import { IDbData } from "../db/idb-data";
import { UserActivityType } from "../models/user-activity-type";

export interface IUserActivityLogValue extends IDbData {
    userId: string;
    activityType: UserActivityType;
    date: Date;
    details: string;
    previousStripeAccountStatus: string;
    newStripeAccountStatus: string;
    performedBy: string;
}