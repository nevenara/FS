import { Gender } from "../../models/gender";
import { ValidationError } from "../../common/errors/validation-error";
import { LocalisationKey } from "../../localisation/localisation-key";
import moment = require("moment");
import { Bootstrapper } from "../../bootstrapper";

export class ConnectNewAccountRequest {
    public username: string;
    public gender: Gender;
    public firstname: string;
    public lastname: string;
    public birthDate: Date;
    public address: string;
    public postCode: string;
    public city: string;
    public country: string;
    public relationToMainAccount: string;
    public profileImage: Object;

    public validate(lang: string) {
        const localisationProvider = Bootstrapper.getLocalisationProvider();

        Object.keys(this).forEach(field => {
            if (!this[field] && field != 'profileImage') {
                throw new ValidationError(localisationProvider.translate(LocalisationKey[field + 'Required'], lang));
            }
        });

        //this means that invalid date is sent 
        if (!this.birthDate.getFullYear()) {
            throw new ValidationError(localisationProvider.translate(LocalisationKey.InvalidBirthDate, lang));
        }
    }
}