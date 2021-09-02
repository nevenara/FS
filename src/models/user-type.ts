export enum UserType{
    MainAccount = 1,
    LinkedAccount = 2,
    SuperAdmin = 3,
    Admin = 4,
    SupportLevel1 = 5,
    SupportLevel2 = 6,
    EventManager = 7,
    Organizer = 8
}

export class UserPermissionsUtil {
    public static getPermissions(usertype: UserType): string {
        switch(usertype){
            case UserType.Admin:
                return 'Admin';
            case UserType.SuperAdmin:
                return 'Super Admin';
            case UserType.SupportLevel1:
                return 'Support Level 1';
            case UserType.SupportLevel2:
                return 'Support Level 2';
            case UserType.EventManager:
                return 'Event Manager';
            default:
                return '';
        }
    }
}