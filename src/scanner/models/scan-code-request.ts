import { Bootstrapper } from "../../bootstrapper";
import { ValidationError } from "../../common/errors/validation-error";
import { LocalisationKey } from "../../localisation/localisation-key";

export class ScanCodeRequest {
    qrUuid: string;

    public validate(lang = 'en') {
        const localisationProvider = Bootstrapper.getLocalisationProvider();
        
        if (!this.qrUuid) {
            throw new ValidationError(localisationProvider.translate(LocalisationKey.qrUuidRequired, lang));
        }
    }
}