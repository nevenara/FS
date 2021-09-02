import { Bootstrapper } from "../../../bootstrapper";
import { ValidationError } from "../../../common/errors/validation-error";
import { LocalisationKey } from "../../../localisation/localisation-key";
import { LocalisationProvider } from "../../../localisation/localisation-provider";

export class GetOrganizersMainDataRequest {
    public organizerId: string;

    public validate(lang: string){
        if(!this.organizerId){
            const localisationProvider = Bootstrapper.getLocalisationProvider();

            throw new ValidationError(localisationProvider.translate(LocalisationKey.MissingFields, lang));
        }
    }
}