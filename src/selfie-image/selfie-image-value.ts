import { IDbData } from "../db/idb-data";

export interface ISelfieImageValue extends IDbData {
    userId: string;
    
    image: Buffer;
    /** Name of the file on the uploader's computer. */
    originalname: string;
    /** Value of the `Content-Type` header for this file. */
    mimetype: string;
    /** Size of the file in bytes. */
    size: number;
}