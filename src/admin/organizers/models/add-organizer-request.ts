import { Bootstrapper } from "../../../bootstrapper";
import { ValidationError } from "../../../common/errors/validation-error";
import { LocalisationKey } from "../../../localisation/localisation-key";
import { OrganizerStatus } from "../../../organizer/models/organizer-status";

export class AddOrganizerRequest {
    public companyName: string;
    public email: string;
    public contactPerson: string;
    public address: string;
    public postCode: string;
    public city: string;
    public country: string;
    public phone: string;
    public url: string;
    public status: string;
    public ticketReturn: boolean;
    public fansafeSale: boolean;
    public linkLomnido: string;
    public revenueSharing: number;
    public image: Object;

    public validate(lang: string){
        const localisationProvider = Bootstrapper.getLocalisationProvider();

        if(Number.isNaN(Number(this.revenueSharing))){
            throw new ValidationError(localisationProvider.translate(LocalisationKey.RevenueSharingIsNotANumber, lang));
        }

        const mandatoryParams = [
            'companyName',
            'contactPerson',
            'email',
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

        if(this.status){
            if (!Object.keys(OrganizerStatus).map(k => OrganizerStatus[k as any]).includes(this.status)) {
                throw new ValidationError(localisationProvider.translate(LocalisationKey.InvalidOrganizerStatus, lang));
            }
        }

        
    }
}