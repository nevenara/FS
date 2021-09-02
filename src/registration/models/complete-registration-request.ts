import { Gender } from "../../models/gender";
import { ValidationError } from "../../common/errors/validation-error";
import { LocalisationKey } from "../../localisation/localisation-key";
import { Bootstrapper } from "../../bootstrapper";

export class CompleteRegistrationRequest {
    public MAX_NUMBER_OF_OTHER_EMAILS = 4;

    public username: string;
    public gender: Gender;
    public firstname: string;
    public lastname: string;
    public birthDate: Date;
    public address: string;
    public postCode: string;
    public city: string;
    public country: string;
    public otherEmails: Array<string>;
    public phone: string;

    validate(lang: string) {
        const localisationProvider = Bootstrapper.getLocalisationProvider();

        const mandatoryParams = [
            'username',
            'gender',
            'firstname',
            'lastname',
            'birthDate',
            'address',
            'postCode',
            'city',
            'country',
            // 'phone'
        ];

        if (!this.phone) {
            throw new ValidationError(localisationProvider.translate(LocalisationKey.PhoneRequired, lang));
        }

        mandatoryParams.forEach(param => {
            if (!this[param]) {
                const keyName = param + 'Required';
                throw new ValidationError(localisationProvider.translate(LocalisationKey[keyName], lang));
            }
        });

        if (!(<any>Object).values(Gender).includes(this.gender)) {
            throw new ValidationError(localisationProvider.translate(LocalisationKey.InvalidGender, lang));
        }

        if (this.otherEmails && this.otherEmails.length > this.MAX_NUMBER_OF_OTHER_EMAILS) {
            throw new ValidationError(localisationProvider.translate(LocalisationKey.MaxNumberOfOtherEmailsExceeded, lang));
        }
    }
}