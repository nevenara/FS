import { ReasonForInactivity } from "../../user-activity-log/models/reason-for-inactivity";
import { SearchAdminPanelUsersStatus } from "./search-admin-panel-users-status";

export class SearchAdminPanelUsersResponse {
    public totalPages: number;
    public totalRecords: number;
    public users: SearchAdminPanelUserResponse[];
}

export class SearchAdminPanelUserResponse {
    public userId: string;
    public username: string;
    public email: string;
    public firstName: string;
    public lastName: string;
    public mainAccount: boolean;
    public signUpDate: Date;
    public verificationDate: Date;
    public status: SearchAdminPanelUsersStatus;
    public reasonForInactivity: ReasonForInactivity;
}