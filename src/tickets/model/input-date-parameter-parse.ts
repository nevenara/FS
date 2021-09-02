
import moment = require("moment-timezone");
import { Bootstrapper } from "../../bootstrapper";
import { ConfigService } from "../../common/config-service";
import { ValidationError } from "../../common/errors/validation-error";
import { LocalisationKey } from "../../localisation/localisation-key";
import { ILocalisationProvider } from "../../localisation/localisation-provider";

export class InputDateParameterParseUtil {
    constructor(
    ){}

    public static parseStringAsDateTime(value: string, timeZone?: string) {

        if (!value) {
            return null;
        }

        // moment("16.11.2021 07:30", 'DD.MM.YYYY h.mm').toDate(); 

        const date = moment.tz(value, 'DD.MM.YYYY h.mm', timeZone || 'Europe/Vienna').toDate();

        if (date instanceof Date) {
            return date;
        }

        const localisationProvider = Bootstrapper.getLocalisationProvider();
        throw new ValidationError(localisationProvider.translate(LocalisationKey.InvalidDateTimeFormat));
    }

    public static getDateInTimeZone(value: Date, timeZone: string) {
        if (!value) {
            return null;
        }
        const localisationProvider = Bootstrapper.getLocalisationProvider();

        if (!(value instanceof Date)) {
            throw new ValidationError(localisationProvider.translate(LocalisationKey.InvalidDateTimeFormat));
        }

        const date = moment.tz(value, timeZone || 'Europe/Vienna').format();
        return date;

    }
}