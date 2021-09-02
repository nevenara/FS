import { Bootstrapper } from "../../../bootstrapper";
import { ValidationError } from "../../../common/errors/validation-error";
import { LocalisationKey } from "../../../localisation/localisation-key";

export class DeleteOrganizerImageRequest {
    public organizerId: string;

    public validate(lang: string){
        if(!this.organizerId){
            const localisationProvider = Bootstrapper.getLocalisationProvider();

            throw new ValidationError(localisationProvider.translate(LocalisationKey.MissingFields));
        }
    }
}