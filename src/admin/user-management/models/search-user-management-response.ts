export class SearchUserManagementResponse {
    users: any;

    totalRecords: number;
    totalPages: number;

}

export class UserManagementResponse {
    userId: string;
    name: string;
    firstname: string;
    lastname: string;
    email: string;
    permissions: string;
    lastLogin: Date;
}