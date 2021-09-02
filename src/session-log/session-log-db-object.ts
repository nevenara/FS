import { DbObject } from "../db/db-object";
import { ISessionLogValue } from "./session-log-value";

export class SessionLogDbObject extends DbObject {
    private sessionLogData: ISessionLogValue;
    public static IdFieldName: string = '_id';
    public static SessionIdFieldName: string = 'sessionId';

    constructor(sessionLogValue?: ISessionLogValue) {
        super(sessionLogValue);
        this.sessionLogData = this.data as any;
    }

    public get sessionId(): string {
        return this.sessionLogData.sessionId;
    }

    public set sessionId(v: string) {
        this.sessionLogData.sessionId = v;
    }

    public get userId(): string {
        return this.sessionLogData.userId;
    }

    public set userId(v: string) {
        this.sessionLogData.userId = v;
    }

    public get userAgent(): string {
        return this.sessionLogData.userAgent;
    }

    public set userAgent(v: string) {
        this.sessionLogData.userAgent = v;
    }

    public get startDate(): Date {
        return this.sessionLogData.startDate;
    }

    public set startDate(v: Date) {
        this.sessionLogData.startDate = v;
    }

    public get logOutDate(): Date {
        return this.sessionLogData.logOutDate;
    }
    public set logOutDate(v: Date) {
        this.sessionLogData.logOutDate = v;
    }


}