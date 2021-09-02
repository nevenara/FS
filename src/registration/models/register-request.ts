import { Bootstrapper } from "../../bootstrapper";
import { ValidationError } from "../../common/errors/validation-error";
import { LocalisationKey } from "../../localisation/localisation-key";

export class RegisterRequest {

    public email: string;
    public password1: string;
    public password2: string;
    public lang: string;

    validate() {
        const localisationProvider = Bootstrapper.getLocalisationProvider();

        if (!this.email) {
            throw new ValidationError(localisationProvider.translate(LocalisationKey.EmailRequired, this.lang));
        }

        if (!this.password1 || !this.password2) {
            throw new ValidationError(localisationProvider.translate(LocalisationKey.PasswordsRequired, this.lang));
        }

        if(this.password1 !== this.password2){
            throw new ValidationError(localisationProvider.translate(LocalisationKey.Password1and2MustBeSame, this.lang));
        }
    }
}