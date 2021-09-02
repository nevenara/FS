import { UserManagementResponse } from "./search-user-management-response";

export class SearchUserManagementRepoResponse {
    users: UserManagementResponse[];
    totalRecords: number;
    totalPages: number;
}