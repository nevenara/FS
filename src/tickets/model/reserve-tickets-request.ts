import { Bootstrapper } from "../../bootstrapper";
import { ValidationError } from "../../common/errors/validation-error";
import { LocalisationKey } from "../../localisation/localisation-key";

export class ReserveTicketsRequest {
    public ticketId: string;

    public validate(lang: string) {
        if (!this.ticketId) {
            const localisationProvider = Bootstrapper.getLocalisationProvider();

            throw new ValidationError(localisationProvider.translate(LocalisationKey.TicketIdRequired, lang));
        }
    }
}