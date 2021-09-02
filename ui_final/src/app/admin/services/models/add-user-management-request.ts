import { UserType } from '../../models/user-type';

export class AddUserManagementRequest {
    firstname: string;
    lastname: string;
    permissions: UserType;
    email: string;
}