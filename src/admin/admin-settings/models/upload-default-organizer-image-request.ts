import { Bootstrapper } from "../../../bootstrapper";
import { ValidationError } from "../../../common/errors/validation-error";
import { LocalisationKey } from "../../../localisation/localisation-key";

export class UploadDefaulOrganizerImageRequest {
    image: Object;

    public validate(lang: string){
        if(!this.image){
            const localisationProvider = Bootstrapper.getLocalisationProvider();

            throw new ValidationError(localisationProvider.translate(LocalisationKey.EmptyFieldUploadProfileImage, lang));
        } 
    }
}