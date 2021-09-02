import { IDbData } from "../db/idb-data";

export interface IBlacklistedEmailsValue extends IDbData {
    domain: string
}