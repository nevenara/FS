import { Bootstrapper } from "../../bootstrapper";
import { ValidationError } from "../../common/errors/validation-error";
import { LocalisationKey } from "../../localisation/localisation-key";

export class CheckUsernameRequest {
    public username: string;
    public lang: string;

    validate(){
        const localisationProvider = Bootstrapper.getLocalisationProvider();
        if(!this.username){
            throw new ValidationError(localisationProvider.translate(LocalisationKey.usernameRequired, this.lang));
        }
    }
}