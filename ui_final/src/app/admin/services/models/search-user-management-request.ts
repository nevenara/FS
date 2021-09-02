import { UserType } from "../../models/user-type";
import { SortOrder } from '../../models/sort-order';

export class SearchUserManagementRequest {
    textSearch: string;
    permissions: UserType[];

    lastLoginFrom: string;
    lastLoginTo: string;

    limit: number;
    page: number;

    sortField: string;
    sortOrder: SortOrder;
}