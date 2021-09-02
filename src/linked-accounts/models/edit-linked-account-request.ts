import { Bootstrapper } from "../../bootstrapper";
import { ValidationError } from "../../common/errors/validation-error";
import { LocalisationKey } from "../../localisation/localisation-key";

export class EditLinkedAccountRequest {
    public linkedAccountId: string;
    public city: string;
    public country: string;
    public address: string;
    public postCode: string;

    public validate(lang: string) {
        if (!this.linkedAccountId) {
            const localisationProvider = Bootstrapper.getLocalisationProvider();

            throw new ValidationError(localisationProvider.translate(LocalisationKey.LinkedAccountIdRequired, lang));
        }
    }
}