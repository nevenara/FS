import { IDbData } from "../db/idb-data";
import { CheckInFailureReasonType } from "../models/check-in-failure-reason-type";
import { VerificationStatusType } from "../models/verification-status-type";

export interface ICheckInValue extends IDbData {
    ticketId: string;
    date: Date;
    status: VerificationStatusType;
    reason: CheckInFailureReasonType;
    eventId: string;
}