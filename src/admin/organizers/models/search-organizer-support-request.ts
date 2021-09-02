import { ValidationError } from "../../../common/errors/validation-error";
import { SortOrder } from "../../../db/query/sort-option";
import { LocalisationKey } from "../../../localisation/localisation-key";
import { OrganizerStatus } from "../../../organizer/models/organizer-status";

export class SearchOrganizerSupportRequest {
    companyName: string;
    status: OrganizerStatus[];
    createdFrom: Date;
    createdTo: Date;

    page: number;
    limit: number;

    sortOrder: SortOrder;
    sortField: string;

}