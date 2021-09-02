import { Bootstrapper } from "../../bootstrapper";
import { ValidationError } from "../../common/errors/validation-error";
import { LocalisationKey } from "../../localisation/localisation-key";

export class AssignTicketRequest {
    public tickets: Array<TicketToAssign>;

    public validate(lang: string) {
        const localisationProvider = Bootstrapper.getLocalisationProvider();

        if (!this.tickets) {
            throw new ValidationError(localisationProvider.translate(LocalisationKey.TicketsRequired, lang));
        }

        this.tickets.forEach(ticket => {
            if (!ticket.ticketId) {
                throw new ValidationError(localisationProvider.translate(LocalisationKey.TicketIdRequired, lang));
            }

            if (!ticket.userId) {
                throw new ValidationError(localisationProvider.translate(LocalisationKey.userIdRequired, lang));
            }
        });
    }
}

export class TicketToAssign {
    public ticketId: string;
    public userId: string;
}