import { Bootstrapper } from "../../bootstrapper";
import { ValidationError } from "../../common/errors/validation-error";
import { LocalisationKey } from "../../localisation/localisation-key";
import { Gender } from "../../models/gender";

export class AddUserAdminPanelRequest {
    public isMainAccount: boolean;
    public gender: Gender;
    public username: string;
    public firstname: string;
    public lastname: string;
    public birthDate: Date;
    public address: string;
    public postCode: string;
    public city: string;
    public country: string;
    public phone: string;

    public standardEmail: string;
    
    // username or email
    public linkedToMainAccount: string;
    public profileImage: Object;

    public validate(lang: string){
        const localisationProvider = Bootstrapper.getLocalisationProvider();

        const mandatoryParams = [
            'gender',
            'username',
            'firstname',
            'lastname',
            'birthDate',
            'address',
            'postCode',
            'city',
            'country',
            'phone'
        ];

        mandatoryParams.forEach(param => {
            if (!this[param]) {
                const keyName = param + 'Required';
                throw new ValidationError(localisationProvider.translate(LocalisationKey[keyName], lang));
            }
        });

        if (!(<any>Object).values(Gender).includes(+this.gender)) {
            throw new ValidationError(localisationProvider.translate(LocalisationKey.InvalidGender, lang));
        }

        if(!this.isMainAccount){
            if(!this.linkedToMainAccount){
                throw new ValidationError(localisationProvider.translate(LocalisationKey.MainAccounNotFound, lang));
            }
        }
        else{
            if(!this.standardEmail){
                throw new ValidationError(localisationProvider.translate(LocalisationKey.MissingFields, lang));
            }
        }
    }
}