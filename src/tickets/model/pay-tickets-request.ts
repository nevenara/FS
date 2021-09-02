import { ValidationError } from "../../common/errors/validation-error";
import { LocalisationKey } from "../../localisation/localisation-key";
import { isString } from "util";
import { Bootstrapper } from "../../bootstrapper";

export class PayTicketsRequest {
    public tickets: Array<TicketBuy>;
    public ticketsToCancel: Array<string>;
    public paymentMethod: string;

    public validate(lang: string) {
        const localisationProvider = Bootstrapper.getLocalisationProvider();

        if (!this.tickets || this.tickets.length == 0) {
            throw new ValidationError(localisationProvider.translate(LocalisationKey.EmptyRequest, lang));
        }

        this.tickets.forEach(ticket => {
            if (!ticket.ticketId) {
                throw new ValidationError(localisationProvider.translate(LocalisationKey.TicketIdRequired, lang));
            }
    
            if (!ticket.userId) {
                throw new ValidationError(localisationProvider.translate(LocalisationKey.userIdRequired, lang));
            }
        });

        if (this.ticketsToCancel) {
            this.ticketsToCancel.forEach(element => {
                if (!isString(element)) {
                    throw new ValidationError(localisationProvider.translate(LocalisationKey.InvalidRequest, lang));
                }
            });
        }
    }
}

export class TicketBuy {
    public ticketId: string;
    public userId: string;
}