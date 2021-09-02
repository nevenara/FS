import { IDbData } from "../db/idb-data";

export interface ITicketPlaceholderImageValue extends IDbData{
    ticketId: String,
    image: Buffer,
    originalname: string;
    mimetype: string;
    size: number;
}