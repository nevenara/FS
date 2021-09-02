import { IDbData } from "../db/idb-data";

export interface IPasswordRecoveryRequestValue extends IDbData{
    email: string,
    uuid: string,
    expirationTime: Date
}