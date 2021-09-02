import { DbObject } from "../db/db-object";
import { IUserValue } from "./user-value";
import { UserType } from "../models/user-type";
import { Gender } from "../models/gender";

export class UserDbObject extends DbObject implements IUserValue {
    private userData: IUserValue;

    constructor(userValue?: IUserValue) {
        super(userValue);
        this.userData = this.data as any;
    }
    usertype: UserType;

    public get _id(): string {
        return this.userData._id;
    }

    public set _id(v: string) {
        this.userData._id = v;
    }

    public get username(): string {
        return this.userData.username;
    }
    public set username(v: string) {
        this.userData.username = v;
    }

    public get email(): string {
        return this.userData.email;
    }

    public set email(v: string) {
        this.userData.email = v;
    }

    public get password(): string {
        return this.userData.password;
    }

    public set password(v: string) {
        this.userData.password = v;
    }

    public get userType(): UserType {
        return this.userData.usertype;
    }

    public set userType(v: UserType) {
        this.userData.usertype = v;
    }

    public get emailVerificationGuid(): string {
        return this.userData.emailVerificationGuid;
    }

    public set emailVerificationGuid(v: string) {
        this.userData.emailVerificationGuid = v;
    }

    public get status(): string {
        return this.userData.status;
    }
    public set status(v: string) {
        this.userData.status = v;
    }

    public get gender(): Gender {
        return this.userData.gender;
    }
    public set gender(v: Gender) {
        this.userData.gender = v;
    }

    public get firstname(): string {
        return this.userData.firstname;
    }
    public set firstname(v: string) {
        this.userData.firstname = v;
    }

    public get lastname(): string {
        return this.userData.lastname;
    }
    public set lastname(v: string) {
        this.userData.lastname = v;
    }

    public get birthDate(): Date {
        return this.userData.birthDate;
    }
    public set birthDate(v: Date) {
        this.userData.birthDate = v;
    }

    public get phone(): string {
        return this.userData.phone;
    }
    public set phone(v: string) {
        this.userData.phone = v;
    }

    public get address(): string {
        return this.userData.address;
    }
    public set address(v: string) {
        this.userData.address = v;
    }

    public get postCode(): string {
        return this.userData.postCode;
    }
    public set postCode(v: string) {
        this.userData.postCode = v;
    }

    public get city(): string {
        return this.userData.city;
    }
    public set city(v: string) {
        this.userData.city = v;
    }

    public get country(): string {
        return this.userData.country;
    }
    public set country(v: string) {
        this.userData.country = v;
    }

    public get relationToMainAccount(): string {
        return this.userData.relationToMainAccount;
    }
    public set relationToMainAccount(v: string) {
        this.userData.relationToMainAccount = v;
    }

    public get mainAccountId(): string {
        return this.userData.mainAccountId;
    }
    public set mainAccountId(v: string) {
        this.userData.mainAccountId = v;
    }

    public get stripeAccountId(): string {
        return this.userData.stripeAccountId;
    }
    public set stripeAccountId(v: string) {
        this.userData.stripeAccountId = v;
    }

    public get bankAccountId(): string {
        return this.userData.bankAccountId;
    }
    public set bankAccountId(v: string) {
        this.userData.bankAccountId = v;
    }

    public get stripeAccountStatus(): string {
        return this.userData.stripeAccountStatus;
    }

    public set stripeAccountStatus(v: string) {
        this.userData.stripeAccountStatus = v;
    }

    public get organizerId(): string {
        return this.userData.organizerId;
    }

    public set organizerId(v: string) {
        this.userData.organizerId = v;
    }

    public get createdOn(): Date {
        return this.userData.createdOn;
    }
    public set createdOn(v: Date) {
        this.userData.createdOn = v;
    }


    public get faceMatchStatus(): boolean {
        return this.userData.faceMatchStatus;
    }
    public set faceMatchStatus(v: boolean) {
        this.userData.faceMatchStatus = v;
    }

    public get faceMatchScore(): number {
        return this.userData.faceMatchScore;
    }
    public set faceMatchScore(v: number) {
        this.userData.faceMatchScore = v;
    }

    public get stripeErrors(): string[] {
        return this.userData.stripeErrors;
    }
    public set stripeErrors(v: string[]) {
        this.userData.stripeErrors = v;
    }

    public static EmailVerificationGuidFieldName = "emailVerificationGuid";
    public static UserIdFieldName = "id";
    public static MainAccountIdFieldName = "mainAccountId";
    public static EmailFieldName = "email";
}