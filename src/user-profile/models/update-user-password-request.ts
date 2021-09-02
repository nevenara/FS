import { Bootstrapper } from "../../bootstrapper";
import { ValidationError } from "../../common/errors/validation-error";
import { LocalisationKey } from "../../localisation/localisation-key";

export class UpdateUserPasswordRequest {
    public currentPassword: string;
    public newPassword: string;
    public confirmPassword: string;

    public validate(lang: string) {
        const localisationProvider = Bootstrapper.getLocalisationProvider();

        if (!this.currentPassword) {
            throw new ValidationError(localisationProvider.translate(LocalisationKey.CurrentPasswordRequired, lang));
        }

        if (!this.newPassword || !this.confirmPassword) {
            throw new ValidationError(localisationProvider.translate(LocalisationKey.NewPasswordAndConfirmPasswordRequired, lang));
        }
    }
}