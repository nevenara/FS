export enum UserType {
    MainAccount = 1,
    LinkedAccount = 2,
    SuperAdmin = 3,
    Admin = 4,
    SupportLevel1 = 5,
    SupportLevel2 = 6
}

export interface IUserContext {
    userId: string;
    isAuthenticated: boolean;
    userType: UserType;
    email: string;
    firstname: string;
    lastname: string;
}