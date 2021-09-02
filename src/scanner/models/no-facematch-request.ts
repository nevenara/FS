import { Bootstrapper } from "../../bootstrapper";
import { ValidationError } from "../../common/errors/validation-error";
import { LocalisationKey } from "../../localisation/localisation-key";

export class NoFacematchRequest {
    checkInId: string;

    validate(lang = 'en') {
        const localisationProvider = Bootstrapper.getLocalisationProvider();
        
        if (!this.checkInId) {
            throw new ValidationError(localisationProvider.translate(LocalisationKey.checkInIdRequired, lang));
        }
    }
}