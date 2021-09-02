import { Bootstrapper } from "../../bootstrapper";
import { ValidationError } from "../../common/errors/validation-error";
import { MultierFile } from "../../common/multier-file";
import { LocalisationKey } from "../../localisation/localisation-key";

export class IdCheckLinkedAccountRequest {
    public linkedAccountId: string;
    public idDocumentFile: MultierFile; 
    public selfieImage: MultierFile; 

    public validate(lang: string) {
        if (!this.linkedAccountId) {
            const localisationProvider = Bootstrapper.getLocalisationProvider();

            throw new ValidationError(localisationProvider.translate(LocalisationKey.LinkedAccountIdRequired, lang));
        }
    }
}