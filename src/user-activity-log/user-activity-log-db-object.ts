import { DbObject } from "../db/db-object";
import { UserActivityType } from "../models/user-activity-type";
import { IUserActivityLogValue } from "./user-activity-log-value";

export class UserActivityLogDbObject extends DbObject {
    private userActivityLogData: IUserActivityLogValue;

    constructor(userActivityLogValue?: IUserActivityLogValue) {
        super(userActivityLogValue);
        this.userActivityLogData = this.data as any;
    }

    public get userId(): string {
        return this.userActivityLogData.userId;
    }

    public set userId(v: string) {
        this.userActivityLogData.userId = v;
    }

    public get activityType(): UserActivityType {
        return this.userActivityLogData.activityType;
    }

    public set activityType(v: UserActivityType) {
        this.userActivityLogData.activityType = v;
    }

    public get date(): Date {
        return this.userActivityLogData.date;
    }

    public set date(v: Date){
        this.userActivityLogData.date = v;
    }

    public get details(): string {
        return this.userActivityLogData.details;
    }

    public set details(v: string) {
        this.userActivityLogData.details = v;
    }

    public get previousStripeAccountStatus() : string {
        return this.userActivityLogData.previousStripeAccountStatus;
    }
    public set previousStripeAccountStatus(v : string) {
        this.userActivityLogData.previousStripeAccountStatus = v;
    }

    public get newStripeAccountStatus() : string {
        return this.userActivityLogData.newStripeAccountStatus;
    }
    public set newStripeAccountStatus(v : string) {
        this.userActivityLogData.newStripeAccountStatus = v;
    }

    public get performedBy() : string {
        return this.userActivityLogData.performedBy;
    }
    public set performedBy(v : string) {
        this.userActivityLogData.performedBy = v;
    }
    
    // previousStripeAccountStatus: string;
    // newStripeAccountStatus: string;

    public static UserIdFieldName = "userId";
    public static ActivityTypeFieldName = "activityType";
}