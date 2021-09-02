import { UserActivityType } from "../../models/user-activity-type";

export class GetUsersCountForCustomTimePeriodRepoRequest {
    public fromDate: Date;
    public toDate: Date;
    public activityType: UserActivityType
}