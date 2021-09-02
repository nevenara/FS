import { ValidationError } from "../../common/errors/validation-error";
import { LocalisationKey } from "../../localisation/localisation-key";
import { isString } from "util";
import { Bootstrapper } from "../../bootstrapper";

export class DeleteTicketSaleRequest {
    public tickets: Array<string>;

    public validate(lang: string) {
        const localisationProvider = Bootstrapper.getLocalisationProvider();

        if (!this.tickets || this.tickets.length == 0) {
            throw new ValidationError(localisationProvider.translate(LocalisationKey.EmptyRequest, lang));
        }

        this.tickets.forEach(element => {
            if (!isString(element)) {
                throw new ValidationError(localisationProvider.translate(LocalisationKey.InvalidRequest, lang));
            }
        });
    }
}