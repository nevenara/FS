import { SortOrder } from "../../db/query/sort-option";
import { ReasonForInactivity } from "../../user-activity-log/models/reason-for-inactivity";
import { SearchAdminPanelUsersAccountType } from "./search-admin-panel-users-account-type";
import { SearchAdminPanelUsersStatus } from "./search-admin-panel-users-status";

export class SearchAdminPanelUsersRequest {
    //email or username or firstname or lastname
    public textSearch: string;

    public status: SearchAdminPanelUsersStatus[];
    public accountType: SearchAdminPanelUsersAccountType[];
    public reasonForInactivity: ReasonForInactivity[];

    //Date when user has performed ID Check
    public verificationDateFrom: Date;
    public verificationDateTo: Date;

    //Date when user has completed Registration Step 2
    public signUpDateFrom: Date;
    public signUpDateTo: Date;

    public page: number;
    public limit: number;

    public sortField: string;
    public sortOrder: SortOrder;
}