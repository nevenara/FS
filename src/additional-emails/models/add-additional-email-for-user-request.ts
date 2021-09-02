import { Bootstrapper } from "../../bootstrapper";
import { ValidationError } from "../../common/errors/validation-error";
import { LocalisationKey } from "../../localisation/localisation-key";

export class AddAdditionalEmailForUserRequest {
    public userId: string;
    public email: string;

    public validate(lang: string){
        const localisationProvider = Bootstrapper.getLocalisationProvider();

        if(!this.userId){
            throw new ValidationError(localisationProvider.translate(LocalisationKey.userIdRequired, lang));
        }

        if(!this.email){
            throw new ValidationError(localisationProvider.translate(LocalisationKey.EmailRequired, lang));
        }
    }
}
