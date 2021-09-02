export class AddUserAdminPanelRequest {
    public isMainAccount: boolean;
    public gender: Gender;
    public username: string;
    public firstname: string;
    public lastname: string;
    public birthDate: Date;
    public address: string;
    public postCode: string;
    public city: string;
    public country: string;
    public phone: string;

    public standardEmail: string;
    
    //username or email
    public linkedToMainAccount: string;
    public profileImage: any;
}


export enum Gender{
    Female = 1,
    Male = 2
}