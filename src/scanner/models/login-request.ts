import { Bootstrapper } from "../../bootstrapper";
import { ValidationError } from "../../common/errors/validation-error";
import { LocalisationKey } from "../../localisation/localisation-key";

export class LoginRequest {
    public email: string;
    public eventId: string;

    public validate(lang = 'en') {
        const localisationProvider = Bootstrapper.getLocalisationProvider();
        
        if (!this.email) {
            throw new ValidationError(localisationProvider.translate(LocalisationKey.emailRequired, lang));
        }

        if (!this.eventId) {
            throw new ValidationError(localisationProvider.translate(LocalisationKey.eventIdRequired, lang));
        }
    }
}