import { Bootstrapper } from "../../../bootstrapper";
import { ValidationError } from "../../../common/errors/validation-error";
import { LocalisationKey } from "../../../localisation/localisation-key";
import { OrganizerStatus } from "../../../organizer/models/organizer-status";

export class UpdateOrganizerRequest {
    public organizerId: string;
    public ticketReturn: boolean;
    public fansafeSale: boolean;
    public linkToLomnidoBridge: string;
    public revenueSharing: number;
    public status: string;
    public contactPerson: string;
    public email: string;
    public phone: string;
    public url: string;
    public address: string;
    public postCode: string;
    public city: string;
    public country: string;

    public validate(lang: string){
        const localisationProvider = Bootstrapper.getLocalisationProvider();

        const mandatoryParams = [
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
                throw new ValidationError(localisationProvider.translate(LocalisationKey[keyName]));
            }
        });

        if(this.status) {
            if (!Object.keys(OrganizerStatus).map(k => OrganizerStatus[k as any]).includes(this.status)) {
                throw new ValidationError(localisationProvider.translate(LocalisationKey.InvalidOrganizerStatus));
            }
        }
    }
}