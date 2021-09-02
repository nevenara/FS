import { UserPermissionsUtil, UserType } from "../../models/user-type";
import { SearchUserManagementResponse } from "./models/search-user-management-response";

const headingColumnNames = [
    { key: "name", header: 'Name' },
    { key: "email", header: 'Email' },
    { key: "permissions", header: 'Permissions' },
    { key: "lastLogin", header: 'Last login' },
];

export class BaseExportUserManagementController{
    protected getHeadingColumnNames(){
        return headingColumnNames;
    }

    protected mapResponse(response: SearchUserManagementResponse): any {
        const users = response.users.map( user => {
            return {
                name: user.name,
                email: user.email,
                permissions: UserPermissionsUtil.getPermissions(user.permissions),
                lastLogin: user.lastLogin
            }
        });
        return users;
    }

}