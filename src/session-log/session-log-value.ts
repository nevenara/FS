import { IDbData } from "../db/idb-data";

export interface ISessionLogValue extends IDbData {
    sessionId: string;
    userId: string;
    userAgent: string;
    startDate: Date;
    logOutDate: Date;
}