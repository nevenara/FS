import { Bootstrapper } from "../../bootstrapper";
import { ValidationError } from "../../common/errors/validation-error";
import { LocalisationKey } from "../../localisation/localisation-key";

export class DeleteAdditionalEmailRequest {
    public email: string;

    public validate(lang: string) {
        if (!this.email) {
            const localisationProvider = Bootstrapper.getLocalisationProvider();

            throw new ValidationError(localisationProvider.translate(LocalisationKey.EmailRequired, lang));
        }
    }
}