import { Bootstrapper } from "../../bootstrapper";
import { ValidationError } from "../../common/errors/validation-error";
import { LocalisationKey } from "../../localisation/localisation-key";

export class UseAsStandardEmailRequest {
    public email: string;
    public password: string;

    public validate(lang: string) {
        const localisationProvider = Bootstrapper.getLocalisationProvider();

        if (!this.email || !this.password) {
            throw new ValidationError(localisationProvider.translate(LocalisationKey.EmailAndPasswordRequired, lang));
        }
    }
}