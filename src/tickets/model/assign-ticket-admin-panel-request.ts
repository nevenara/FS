import { Bootstrapper } from "../../bootstrapper";
import { ValidationError } from "../../common/errors/validation-error";
import { LocalisationKey } from "../../localisation/localisation-key";

export class AssignTicketAdminPanelRequest {
    ticketId: string;
    firstname: string;
    lastname: string;
    userId: string;

    validate(lang: string){
        const localisationProvider = Bootstrapper.getLocalisationProvider();

        if(!this.ticketId){
            throw new ValidationError(localisationProvider.translate(LocalisationKey.TicketIdRequired, lang));
        }

        if(!this.firstname){
            throw new ValidationError(localisationProvider.translate(LocalisationKey.firstnameRequired, lang));
        }

        if(!this.lastname){
            throw new ValidationError(localisationProvider.translate(LocalisationKey.lastnameRequired, lang));
        }

        if(!this.userId){
            throw new ValidationError(localisationProvider.translate(LocalisationKey.userIdRequired, lang));
        }
    }
}