import { DbObject } from "../db/db-object";
import { IPasswordRecoveryRequestValue } from "./password-recovery-request-value";

export class PasswordRecoveryRequestDbObject extends DbObject{
    private passwordRecoveryRequestData: IPasswordRecoveryRequestValue;

    constructor(passwordRecoveryRequestValue?: IPasswordRecoveryRequestValue){
        super(passwordRecoveryRequestValue);
        this.passwordRecoveryRequestData = this.data as any;
    }
    
    public get email() {
        return this.passwordRecoveryRequestData.email;
    }
    public set email(v) {
        this.passwordRecoveryRequestData.email = v;
    }
    
    public get uuid() : string {
        return this.passwordRecoveryRequestData.uuid;
    }

    public set uuid(v : string) {
        this.passwordRecoveryRequestData.uuid = v;
    }

    public get expirationTime() : Date {
        return this.passwordRecoveryRequestData.expirationTime;
    }

    public set expirationTime(v : Date) {
        this.passwordRecoveryRequestData.expirationTime = v;
    }

    public static Uuid = "uuid";
}