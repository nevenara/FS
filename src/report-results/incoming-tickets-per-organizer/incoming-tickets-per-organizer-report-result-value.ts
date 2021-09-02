import { IDbData } from "../../db/idb-data";

export interface IIncomingTicketsPerOrganizerReportResultValue extends IDbData {
    year: number;
    month: number;
    incomingTicketsCount: number;
    organizerId: string;
}