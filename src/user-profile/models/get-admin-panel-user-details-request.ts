import { Bootstrapper } from "../../bootstrapper";
import { ValidationError } from "../../common/errors/validation-error";
import { LocalisationKey } from "../../localisation/localisation-key";

export class GetAdminPanelUserDetailsRequest {
    public userId: string;

    public validate(lang: string){
        if(!this.userId) {
            const localisationProvider = Bootstrapper.getLocalisationProvider();

            throw new ValidationError(localisationProvider.translate(LocalisationKey.userIdRequired, lang));
        }
    }
}