import { Bootstrapper } from "../../../bootstrapper";
import { ValidationError } from "../../../common/errors/validation-error";
import { SortOrder } from "../../../db/query/sort-option";
import { LocalisationKey } from "../../../localisation/localisation-key";
import { OrganizerStatus } from "../../../organizer/models/organizer-status";

export class SearchOrganizersRequest {
    public companyName: string;

    public contactPerson: string;
    public status: string[];

    public page: number;
    public limit: number;

    public sortField: string;
    public sortOrder: SortOrder;

    public validate(lang: string) {
        if(this.status) {
            const localisationProvider = Bootstrapper.getLocalisationProvider();

            this.status.forEach(status => {
                if (!Object.keys(OrganizerStatus).map(k => OrganizerStatus[k as any]).includes(status)) {
                    throw new ValidationError(localisationProvider.translate(LocalisationKey.InvalidOrganizerStatus));
                }
            });
        }
        
    }

}