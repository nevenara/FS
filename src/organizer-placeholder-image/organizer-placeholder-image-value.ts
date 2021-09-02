import { IDbData } from "../db/idb-data";

export interface IOrganizerPlaceholderImageValue extends IDbData{
    organizerId: String,
    image: Buffer,
    originalname: string;
    mimetype: string;
    size: number;
    isDefaultImage: boolean;
}