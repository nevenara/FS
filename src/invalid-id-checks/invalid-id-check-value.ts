import { IDbData } from "../db/idb-data";

export interface IInvalidIdCheck extends IDbData {
    userId: string;
    date: Date;
    reason: string;
}