import { UserType } from '../../models/user-type';

export class EditUserManagementRequest {
    userId: string;
    firstname: string;
    lastname: string;
    email: string;
    permissions: UserType;
}