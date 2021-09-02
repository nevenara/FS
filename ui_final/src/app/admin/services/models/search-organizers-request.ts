import { SortOrder } from '../../models/sort-order';

export class SearchOrganizersRequest {
    public companyName: string;

    public contactPerson: string;
    public status: string[];

    public page: number;
    public limit: number;

    public sortField: string;
    public sortOrder: SortOrder;
}