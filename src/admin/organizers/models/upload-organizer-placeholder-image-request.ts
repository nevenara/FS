import { Bootstrapper } from "../../../bootstrapper";
import { ValidationError } from "../../../common/errors/validation-error";
import { LocalisationKey } from "../../../localisation/localisation-key";

export class UploadOrganizerPlaceholderImageRequest {
    public organizerId: string;
    public image: Object;

    public validate(lang: string){
        if(!this.image || !this.organizerId){
            const localisationProvider = Bootstrapper.getLocalisationProvider();

            throw new ValidationError(localisationProvider.translate(LocalisationKey.MissingFields, lang));
        } 
    }
}