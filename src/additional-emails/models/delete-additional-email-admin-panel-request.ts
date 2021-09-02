import { Bootstrapper } from "../../bootstrapper";
import { ValidationError } from "../../common/errors/validation-error";
import { LocalisationKey } from "../../localisation/localisation-key";

export class DeleteAdditionalEmailAdminPanelRequest {
    userId: string;
    email: string;

    validate(lang: string){
        const localisationProvider = Bootstrapper.getLocalisationProvider();
        if(!this.userId || !this.email) {
            throw new ValidationError(localisationProvider.translate(LocalisationKey.MissingFields, lang));
        }
    }
}