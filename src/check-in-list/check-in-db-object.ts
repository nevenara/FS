import { DbObject } from "../db/db-object";
import { CheckInFailureReasonType } from "../models/check-in-failure-reason-type";
import { VerificationStatusType } from "../models/verification-status-type";
import { ICheckInValue } from "./check-in-value";

export class CheckInDbObject extends DbObject {
    private checkInData: ICheckInValue;

    constructor(checkInData?: ICheckInValue) {
        super(checkInData);
        this.checkInData = this.data as any;
    }

    public get ticketId(): string {
        return this.checkInData.ticketId;
    }

    public set ticketId(v: string) {
        this.checkInData.ticketId = v;
    }

    public get date(): Date {
        return this.checkInData.date;
    }

    public set date(v: Date) {
        this.checkInData.date = v;
    }

    public get status(): VerificationStatusType {
        return this.checkInData.status;
    }

    public set status(v: VerificationStatusType) {
        this.checkInData.status = v;
    }

    public get reason(): CheckInFailureReasonType {
        return this.checkInData.reason;
    }

    public set reason(v: CheckInFailureReasonType) {
        this.checkInData.reason = v;
    }

    public get eventId(): string {
        return this.checkInData.eventId;
    }

    public set eventId(v: string) {
        this.checkInData.eventId = v;
    }
}