import { SortOrder } from "../../db/query/sort-option";
import { UserStatus } from "../../models/user-status";
import { UserType } from "../../models/user-type";
import { ReasonForInactivity } from "../../user-activity-log/models/reason-for-inactivity";

export class SearchUsersAdminPanelRepoRequest {
    public textSearch: string;
    public status: UserStatus[];
    public verifiedInclBankAccount: boolean;
    public verified: boolean;
    public accountType: UserType[];
    public reasonForInactivity: ReasonForInactivity[];
    public verificationDateFrom: Date;
    public verificationDateTo: Date;
    public signUpDateFrom: Date;
    public signUpDateTo: Date;

    public page: number;
    public limit: number;

    public sortField: string;
    public sortOrder: SortOrder;
}