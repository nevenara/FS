import { UserType } from './user-type';

export class UserManagementPreview {
    userId: string;
    firstname: string;
    lastname: string;
    email: string;
    permissions: UserType;
    lastLogin: Date;
}