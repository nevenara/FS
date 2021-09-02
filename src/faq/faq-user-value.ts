import { IDbData } from "../db/idb-data";

export interface IFAQUserValue extends IDbData {
    userId: string;
    faqId: string;
    like: boolean;
}
