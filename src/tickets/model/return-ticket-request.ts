import { Bootstrapper } from "../../bootstrapper";
import { ValidationError } from "../../common/errors/validation-error";
import { LocalisationKey } from "../../localisation/localisation-key";

export class ReturnTicketRequest {
    public id: string;
    public reasonTicketReturn: string;
    public acceptedReturnPolicy: boolean;

    public validate(lang: string){
        if(!this.id){
            const localisationProvider = Bootstrapper.getLocalisationProvider();

            throw new ValidationError(localisationProvider.translate(LocalisationKey.MissingFields, lang));
        }
    }
}