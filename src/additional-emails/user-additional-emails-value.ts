import { IDbData } from "../db/idb-data";

export interface IUserAdditionalEmailsValue extends IDbData {
    userId: string,
    email: string,
    uuid: string,
    isVerified: boolean
}