import { ValidationError } from "../../../common/errors/validation-error";
import { SortOrder } from "../../../db/query/sort-option";
import { LocalisationKey } from "../../../localisation/localisation-key";
import { UserType } from "../../../models/user-type";

export class SearchUserManagementRequest {
    //name and email
    textSearch: string;
    permissions: UserType[];

    lastLoginFrom: Date;
    lastLoginTo: Date;

    limit: number;
    page: number;

    sortField: string;
    sortOrder: SortOrder;

}