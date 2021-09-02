import { DbObject } from "../db/db-object";
import { IInvalidIdCheck } from "./invalid-id-check-value";

export class InvalidIdCheckDbObject extends DbObject {
    private invalidIdCheckData: IInvalidIdCheck;

    constructor(organizerValue?: IInvalidIdCheck){
        super(organizerValue);
        this.invalidIdCheckData = this.data as any;
    }

    public get userId(): string {
        return this.invalidIdCheckData.userId;
    }

    public set userId(v: string) {
        this.invalidIdCheckData.userId = v;
    }

    public get date(): Date {
        return this.invalidIdCheckData.date;
    }

    public set date(v: Date) {
        this.invalidIdCheckData.date = v;
    }

    public get reason(): string {
        return this.invalidIdCheckData.reason;
    }

    public set reason(v: string) {
        this.invalidIdCheckData.reason = v;
    }
}