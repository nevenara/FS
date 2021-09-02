import { Bootstrapper } from "../../bootstrapper";
import { ValidationError } from "../../common/errors/validation-error";
import { LocalisationKey } from "../../localisation/localisation-key";
import { TicketOnSaleRequest } from "./ticket-on-sale-request";

export class EditTicketSaleRequest {
    tickets: Array<TicketOnSaleRequest>;

    public validate(lang: string) {
        const localisationProvider = Bootstrapper.getLocalisationProvider();

        if (!this.tickets || this.tickets.length == 0) {
            throw new ValidationError(localisationProvider.translate(LocalisationKey.EmptyRequest, lang));
        }

        this.tickets.forEach(ticket => {
            if (!ticket.ticketId) {
                throw new ValidationError(localisationProvider.translate(LocalisationKey.TicketIdRequired, lang));
            }
    
            if (!ticket.price || (ticket.price && ticket.price < 0)) {
                throw new ValidationError(localisationProvider.translate(LocalisationKey.ValidPriceRequired, lang));
            }
        });
    }
}