export enum UserType {
    MainAccount = 1,
    LinkedAccount = 2,
    SuperAdmin = 3,
    Admin = 4,
    SupportLevel1 = 5,
    SupportLevel2 = 6,
    EventManager = 7,
    Organizer = 8
}

export interface IUserContext {
    userId: string;
    isAuthenticated: boolean;
    userType: UserType;
    email: string;
    firstname: string;
    lastname: string;
    proxyUserId: string;
    proxyUserType: UserType;
    city: string;
    country: string;
    postCode: string;
    address: string;
    phone: string;
}


export class UserContextUtil{
    public static isOrganizer(context: IUserContext){
        return context.userType === UserType.Organizer || context.proxyUserType === UserType.Organizer;
    }
}