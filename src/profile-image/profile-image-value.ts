import { IDbData } from "../db/idb-data";

export interface IProfileImageValue extends IDbData{
    userId: String,
    image: Buffer,
    smallImage: Buffer,
    isDefaultImage: Boolean,
    originalname: string,
    mimetype: string,
    size: number
}