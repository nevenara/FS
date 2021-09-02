import { Bootstrapper } from "../../../bootstrapper";
import { ValidationError } from "../../../common/errors/validation-error";
import { LocalisationKey } from "../../../localisation/localisation-key";

export class UploadDefaultProfileImageRequest {
    profileImage: Object;

    public validate(lang: string){
        if(!this.profileImage){
            const localisationProvider = Bootstrapper.getLocalisationProvider();

            throw new ValidationError(localisationProvider.translate(LocalisationKey.EmptyFieldUploadProfileImage, lang));
        } 
    }
}