import { Bootstrapper } from "../../bootstrapper";
import { ValidationError } from "../../common/errors/validation-error";
import { MultierFile } from "../../common/multier-file";
import { LocalisationKey } from "../../localisation/localisation-key";

export class PaymentSettingsSaveRequest{
    
    public bankAccountStripeToken: string;
    public residenceDocument: MultierFile;
    public userId: string;

    validate(lang: string) {
        const localisationProvider = Bootstrapper.getLocalisationProvider();
        if(!this.bankAccountStripeToken){
            throw new ValidationError(localisationProvider.translate(LocalisationKey.BankAccountStripeTokenRequired, lang));
        }

        if(!this.residenceDocument){
            throw new ValidationError(localisationProvider.translate(LocalisationKey.ResidanceDocumentIsRequired, lang));
        }
    }
}