import { Bootstrapper } from "../../bootstrapper";
import { ValidationError } from "../../common/errors/validation-error";
import { LocalisationKey } from "../../localisation/localisation-key";

export class VerifyAdditionalEmailRequest {
    public uuid: string;
    public lang: string;

    public validate() {
        if (!this.uuid) {
            const localisationProvider = Bootstrapper.getLocalisationProvider();

            throw new ValidationError(localisationProvider.translate(LocalisationKey.AdditionalEmailUuidRequired, this.lang));
        }
    }
}