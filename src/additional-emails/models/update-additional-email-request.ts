import { Bootstrapper } from "../../bootstrapper";
import { ValidationError } from "../../common/errors/validation-error";
import { LocalisationKey } from "../../localisation/localisation-key";

export class UpdateAdditionalEmailRequest {
    oldEmail: string;
    newEmail: string;
    userId: string;

    validate(lang: string){
        const localisationProvider = Bootstrapper.getLocalisationProvider();

        if(!this.oldEmail || !this.newEmail || !this.userId) {
            throw new ValidationError(localisationProvider.translate(LocalisationKey.MissingFields, lang));
        }
    }

}