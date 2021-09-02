import { ReasonForInactivity } from "../../user-activity-log/models/reason-for-inactivity";
import { SearchAdminPanelUsersStatus } from "./search-admin-panel-users-status";

export class SearchUsersAdminPanelRepoResponse {
    public users: any;
    public totalPages: number;
    public totalRecords: number;
}
