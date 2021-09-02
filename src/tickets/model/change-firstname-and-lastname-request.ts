import { Bootstrapper } from "../../bootstrapper";
import { ValidationError } from "../../common/errors/validation-error";
import { LocalisationKey } from "../../localisation/localisation-key";

export class ChangeFirstNameAndLastnameRequest {
    public ticketId: string;
    public firstName: string;
    public lastName: string;

    public validate(lang: string) {
        if(!this.ticketId || !this.firstName || !this.lastName) {
            const localisationProvider = Bootstrapper.getLocalisationProvider();

            throw new ValidationError(localisationProvider.translate(LocalisationKey.MissingFields, lang));
        }
    }
}