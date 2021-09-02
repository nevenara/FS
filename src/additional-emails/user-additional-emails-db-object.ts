import { DbObject } from "../db/db-object";
import { IUserAdditionalEmailsValue } from "./user-additional-emails-value";

export class UserAdditionalEmailsDbObject extends DbObject{
    private userAdditionalEmailData: IUserAdditionalEmailsValue; 

    constructor(userAdditionalEmailsValue?: IUserAdditionalEmailsValue){
        super(userAdditionalEmailsValue);
        this.userAdditionalEmailData = this.data as any;
    }
    
    public get userId() {
        return this.userAdditionalEmailData.userId;
    }
    public set userId(v) {
        this.userAdditionalEmailData.userId = v;
    }
    
    public get email() : string {
        return this.userAdditionalEmailData.email;
    }

    public set email(v : string) {
        this.userAdditionalEmailData.email = v;
    }

    public get uuid() : string {
        return this.userAdditionalEmailData.uuid;
    }

    public set uuid(v : string) {
        this.userAdditionalEmailData.uuid = v;
    }

    public get isVerified() : boolean {
        return this.userAdditionalEmailData.isVerified;
    }

    public set isVerified(v : boolean) {
        this.userAdditionalEmailData.isVerified = v;
    }

    public static UserIdFieldName = "userId";
    public static UuidFieldName = "uuid";
    public static EmailFieldName = "email";
}