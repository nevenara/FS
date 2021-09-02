import { Bootstrapper } from "../../bootstrapper";
import { ValidationError } from "../../common/errors/validation-error";
import { LocalisationKey } from "../../localisation/localisation-key";

export class AddBlacklistedEmailRequest {
    public domain: string;

    public validate(lang: string) {
        if (!this.domain) {
            const localisationProvider = Bootstrapper.getLocalisationProvider();

            throw new ValidationError(localisationProvider.translate(LocalisationKey.DomainIsRequired, lang));
        }
    }
}