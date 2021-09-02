import { Bootstrapper } from "../../bootstrapper";
import { ValidationError } from "../../common/errors/validation-error";
import { LocalisationKey } from "../../localisation/localisation-key";

export class SetLinkedAccountPasswordRequest {
    public linkedAccountId: string;
    public password: string;
    public confirmPassword: string;


    public validate(lang: string) {
        const localisationProvider = Bootstrapper.getLocalisationProvider();

        if (!this.linkedAccountId) {
            throw new ValidationError(localisationProvider.translate(LocalisationKey.LinkedAccountIdRequired, lang));
        }

        if (!this.password || !this.confirmPassword) {
            throw new ValidationError(localisationProvider.translate(LocalisationKey.PasswordsRequired, lang));
        }
    }
}