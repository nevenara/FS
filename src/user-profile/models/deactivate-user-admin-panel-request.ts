import { Bootstrapper } from "../../bootstrapper";
import { ValidationError } from "../../common/errors/validation-error";
import { LocalisationKey } from "../../localisation/localisation-key";
import { ReasonForInactivity } from "../../user-activity-log/models/reason-for-inactivity";

export class DeactivateUserAdminPanelRequest {
    public userId: string;
    public reasonForDeactivation: string;

    public validate(lang: string){
        const localisationProvider = Bootstrapper.getLocalisationProvider();

        if(!this.userId || !this.reasonForDeactivation){
            throw new ValidationError(localisationProvider.translate(LocalisationKey.MissingFields, lang));
        }

        if (!Object.keys(ReasonForInactivity).map(k => ReasonForInactivity[k as any]).includes(this.reasonForDeactivation)) {
            throw new ValidationError(localisationProvider.translate(LocalisationKey.InvalidReasonForDeactivation, lang));
        }
    }
}
