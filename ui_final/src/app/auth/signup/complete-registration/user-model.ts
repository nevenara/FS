import { NgbDateStruct } from "@ng-bootstrap/ng-bootstrap";
import { CountryModel } from "src/app/services/models/country-model";

export class UserModel {
    public username: string;
    public firstname: string;
    public lastname: string;
    public address: string;
    public city: string;
    public country: CountryModel;
    public postCode: string;
    public date: string;
    public phone: Phone;
    public gender: number;
    public additionalEmails: Array<string> = [];
    public birthDate: NgbDateStruct;
}

export class Phone{
   public countryCode: string;
   public dialCode: number;
   public e164Number: number;
   public internationalNumber: number;
   public nationalNumber: number;
   public number: number;
}  