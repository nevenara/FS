import { Bootstrapper } from "../../bootstrapper";
import { ValidationError } from "../../common/errors/validation-error";
import { LocalisationKey } from "../../localisation/localisation-key";

export class GetNonPersonalizedTicketsByEventRequest {
    eventId: string;
    syncDate: Date;

    public validate(lang: string) {
        const localisationProvider = Bootstrapper.getLocalisationProvider();

        if (!this.eventId) {
            throw new ValidationError(localisationProvider.translate(LocalisationKey.MissingFields, lang));
        }

        if (!this.syncDate) {
            throw new ValidationError(localisationProvider.translate(LocalisationKey.MissingFields, lang));
        }
    }
}