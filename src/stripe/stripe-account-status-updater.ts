import { UserActivityType } from "../models/user-activity-type";
import { UserActivityLogRequest } from "../user-activity-log/models/user-activity-log-request";
import { IUserActivityLogService } from "../user-activity-log/user-activity-log-service";
import { UserDbObject } from "../user/user-db-object";
import { IUserRepository } from "../user/user-repository";
import { IUserValue } from "../user/user-value";


export class StripeAccountStatusUpdater {
    constructor(
        private userRepository: IUserRepository,
        private userActivityLogService: IUserActivityLogService) {
    }

    /**
     * updateUserStatus
        user: IUserValue, newStatus: string     */
    public async updateUserStatus(user: IUserValue, stripeAccountStatus: string) {
        if (user.stripeAccountStatus != stripeAccountStatus) {

            const logRequest = new UserActivityLogRequest();
            logRequest.userId = user._id;
            logRequest.activityType = UserActivityType.StripeAccountStatusUpdated;
            logRequest.previousStripeAccountStatus = user.stripeAccountStatus;
            logRequest.newStripeAccountStatus = stripeAccountStatus;
            user.stripeAccountStatus = stripeAccountStatus;

            await this.userActivityLogService.log(logRequest);

            await this.userRepository.updateObjectById(user._id, new UserDbObject(user));
        }
    }
}