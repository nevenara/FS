import { Bootstrapper } from "../../../bootstrapper";
import { ValidationError } from "../../../common/errors/validation-error";
import { LocalisationKey } from "../../../localisation/localisation-key";

export class SearchEventNamesOrganizersBillingRequest {
    organizerId: string;
    locations: string[];
    dateFrom: Date;
    dateTo: Date;

    validate(lang: string){
        if(!this.organizerId){
            const localisationProvider = Bootstrapper.getLocalisationProvider();

            throw new ValidationError(localisationProvider.translate(LocalisationKey.MissingFields));
        }
    }
}