import { UserStatus } from "src/app/admin/models/user-status";
import { UserType } from "src/app/services/models/user-context";

export class UserProfileData {
    
    public email: string;
    public username: string;
    public firstName: string;
    public lastName: string;
    public gender: string;
    public birthDate: Date;
    public address: string;
    public postCode: string;
    public city: string;
    public country: string;
    public phone: Phone;
    public userId: string;
    public additionalEmails: Array<Object> = [];
    public userType: UserType;
    public status: UserStatus;
    
}

export class Phone{
    public countryCode: string;
    public dialCode: number;
    public e164Number: number;
    public internationalNumber: number;
    public nationalNumber: number;
    public number: number;
 }  