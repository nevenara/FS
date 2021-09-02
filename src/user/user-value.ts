import { IDbData } from "../db/idb-data";
import { Gender } from "../models/gender";
import { UserType } from "../models/user-type";

export interface IUserValue extends IDbData{
    username: string;
    email: string;
    password: string;
    usertype: UserType;
    gender: Gender;
    status: string;
    emailVerificationGuid: string;
    firstname: string;
    lastname: string;
    birthDate: Date;
    phone: string;
    address: string;
    postCode: string;
    city: string;
    country: string;
    relationToMainAccount: string;
    mainAccountId: string;
    stripeAccountId: string;
    stripeAccountStatus: string;
    bankAccountId: string;
    organizerId: string;
    createdOn: Date;
    faceMatchStatus: boolean;
    faceMatchScore: number;
    stripeErrors: string[];
}