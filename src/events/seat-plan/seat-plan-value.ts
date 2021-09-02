import { IDbData } from "../../db/idb-data";

export interface ISeatPlanValue extends IDbData{
    eventId: string;
    url: string;
    image: Buffer;
    imageMimetype: string;
    imageSize: number;
    imageOriginalName: string;
}