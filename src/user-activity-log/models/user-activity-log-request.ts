import { Bootstrapper } from "../../bootstrapper";
import { ValidationError } from "../../common/errors/validation-error";
import { LocalisationKey } from "../../localisation/localisation-key";
import { UserActivityType } from "../../models/user-activity-type";

export class UserActivityLogRequest {
    public userId: string;
    public activityType: UserActivityType;
    public details: string;
    public previousStripeAccountStatus: string;
    public newStripeAccountStatus: string;
    public performedBy: string;

    public validate(lang: string) {
        if (!this.userId) {
            const localisationProvider = Bootstrapper.getLocalisationProvider();

            throw new ValidationError(localisationProvider.translate(LocalisationKey.userIdRequired));
        }
    }
}