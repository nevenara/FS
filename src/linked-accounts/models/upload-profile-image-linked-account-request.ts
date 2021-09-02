import { Bootstrapper } from "../../bootstrapper";
import { ValidationError } from "../../common/errors/validation-error";
import { LocalisationKey } from "../../localisation/localisation-key";

export class UploadProfileImageLinkedAccountRequest {
    profileImage: Object;
    linkedAccountId: string;

    public validate(lang: string){
        if(!this.profileImage || !this.linkedAccountId){
            const localisationProvider = Bootstrapper.getLocalisationProvider();

            throw new ValidationError(localisationProvider.translate(LocalisationKey.EmptyFieldUploadProfileImage, lang));
        } 
    }
}