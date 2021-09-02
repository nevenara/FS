import { Bootstrapper } from "../../../bootstrapper";
import { ValidationError } from "../../../common/errors/validation-error";
import { LocalisationKey } from "../../../localisation/localisation-key";
import { UserType } from "../../../models/user-type";

export class EditUserManagementRequest {
    userId: string;
    firstname: string;
    lastname: string;
    email: string;
    permissions: UserType;

    public validate(lang: string){
        const localisationProvider = Bootstrapper.getLocalisationProvider();

        if(this.permissions) {
            if(!(this.permissions == UserType.SuperAdmin) &&
                !(this.permissions == UserType.Admin) &&
                !(this.permissions == UserType.SupportLevel1) &&
                !(this.permissions == UserType.SupportLevel2) &&
                !(this.permissions == UserType.EventManager)){
                    throw new ValidationError(localisationProvider.translate(LocalisationKey.InvalidPermissions, lang));
                }
        }

        if(!this.email || !this.userId || !this.firstname ||
            !this.lastname || !this.permissions) {
                throw new ValidationError(localisationProvider.translate(LocalisationKey.MissingFields));
            }
    }

}