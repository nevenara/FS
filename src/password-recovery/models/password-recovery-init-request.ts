import { Bootstrapper } from "../../bootstrapper";
import { ValidationError } from "../../common/errors/validation-error";
import { LocalisationKey } from "../../localisation/localisation-key";

export class PasswordRecoveryInitRequest{
    public email: string;
    public lang: string;

    validate() {
        if (!this.email) {
            const localisationProvider = Bootstrapper.getLocalisationProvider();

            throw new ValidationError(localisationProvider.translate(LocalisationKey.EmailRequired, this.lang));
        }
    }
}