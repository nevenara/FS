import { IDbData } from "../db/idb-data";

export interface IEventValue extends IDbData {
    eventName: string;
    locationName: string;
    locationAddress: string;
    date: Date;
    beginTime: Date;
    image: Buffer,
    imageMimetype: string,
    imageSize: number,
    imageOriginalName: string,
    doorsOpen: Date,
    termsOfEvent: string,
    organizerId: string[]
}