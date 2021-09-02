import { Bootstrapper } from "../../bootstrapper";
import { ValidationError } from "../../common/errors/validation-error";
import { LocalisationKey } from "../../localisation/localisation-key";

export class AddAdditionalEmailRequest {
    public email: string;

    public validate(lang: string) {
        const localisationProvider = Bootstrapper.getLocalisationProvider();

        if (!this.email) {
            throw new ValidationError(localisationProvider.translate(LocalisationKey.EmailFieldRequired, lang));
        }
    }
}