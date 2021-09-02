import { Bootstrapper } from "../../bootstrapper";
import { ValidationError } from "../../common/errors/validation-error";
import { LocalisationKey } from "../../localisation/localisation-key";

export class GetEventsByMonthRequest {
    public month: number;
    public year: number;

    public validate(lang: string){
        const localisationProvider = Bootstrapper.getLocalisationProvider();

        if(!this.month || !this.year) {
            throw new ValidationError(localisationProvider.translate(LocalisationKey.MissingFields, lang));
        }

        if(this.month < 1 || this.month > 12){
            throw new ValidationError(localisationProvider.translate(LocalisationKey.InvalidRequest, lang));
        }
    }
}