import { Bootstrapper } from "../../bootstrapper";
import { ValidationError } from "../../common/errors/validation-error";
import { LocalisationKey } from "../../localisation/localisation-key";

export class VerifyEmailAdminPanelRequest{
    public emailVerificationGuid: string;
    public userAgent: string;
    public lang: string;

    
    public validate() {
        if(!this.emailVerificationGuid){
            const localisationProvider = Bootstrapper.getLocalisationProvider();

            throw new ValidationError(localisationProvider.translate(LocalisationKey.EmailVerificationGuidIsRequiredField));
        }        
    }
}