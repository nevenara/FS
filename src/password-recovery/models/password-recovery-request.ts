import { Bootstrapper } from "../../bootstrapper";
import { ValidationError } from "../../common/errors/validation-error";
import { LocalisationKey } from "../../localisation/localisation-key";

export class PasswordRecoveryRequest{
    public password: string;
    public confirmPassword: string;
    public uuid: string;
    public lang: string;

    validate() {
        const localisationProvider = Bootstrapper.getLocalisationProvider();

        if (!this.password || !this.uuid || !this.confirmPassword) {
            throw new ValidationError(localisationProvider.translate(LocalisationKey.MissingFields, this.lang));
        }

        if (this.password !== this.confirmPassword){
            throw new ValidationError(localisationProvider.translate(LocalisationKey.Password1and2MustBeSame, this.lang));
        }
    }
}