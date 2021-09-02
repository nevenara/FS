import { UserStatus } from "./user-status";
import { Gender } from "./gender";

export class UserDetailsPreview {
    public userId: string;
    public username: string;
    public status: UserStatus;
    public verificationDate: Date;
    // dd.mm.yyyy (x days ago)
    public lastChangeLinkedAccounts: Date;
    
    public standardEmail: string;
    public isMainAccount: boolean;
    public gender: Gender;
    public firstName: string;
    public lastName: string;
    public dayOfBirth: Date;
    public address: string;
    public postalCode: string;
    public city: string;
    public country: string;
    public phone: Phone;
    public faceMatchStatus: boolean;
    public faceMatchScore: number;
    public bankAccountId: string;
    public stripeErrors: string[] = [];

}

export class Phone{
    public countryCode: string;
    public dialCode: number;
    public e164Number: number;
    public internationalNumber: number;
    public nationalNumber: number;
    public number: number;
 }  

 