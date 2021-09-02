export class UserModel {
    public username: string;
    public firstname: string;
    public lastname: string;
    public address: string;
    public city: string;
    public country: string;
    public postCode: string;
    public day: Object;
    public month: Object;
    public year: Object;
    public gender: number;
    public additionalEmails: Array<string> = [];
    public profileImage: string;
}