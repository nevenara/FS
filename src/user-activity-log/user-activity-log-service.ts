import { IUserContext } from "../common/user-context";
import { UserActivityLogRequest } from "./models/user-activity-log-request";
import { UserActivityLogDbObject } from "./user-activity-log-db-object";
import { IUserActivityLogRepository } from "./user-activity-log-repository";

export interface IUserActivityLogService {
    log(request: UserActivityLogRequest): void;
}

export class UserActivityLogService implements IUserActivityLogService {
    constructor(
        private userActivityLogRepository: IUserActivityLogRepository,
        private context: IUserContext
    ) { }

    public async log(request: UserActivityLogRequest) {
        request.validate(this.context.lang);
        const activityLog: UserActivityLogDbObject = new UserActivityLogDbObject();
        activityLog.userId = request.userId;
        activityLog.activityType = request.activityType;
        activityLog.date = new Date();
        activityLog.details = request.details;
        activityLog.previousStripeAccountStatus = request.previousStripeAccountStatus;
        activityLog.newStripeAccountStatus = request.newStripeAccountStatus;
        activityLog.performedBy = request.performedBy;
        await this.userActivityLogRepository.create(activityLog);
    }
}