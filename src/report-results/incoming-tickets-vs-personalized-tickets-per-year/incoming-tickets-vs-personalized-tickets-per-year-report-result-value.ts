import { IDbData } from "../../db/idb-data";

export interface IIncomingTicketsVsPersonalizedTicketsPerYearReportResultValue extends IDbData {
    year: number;
    incomingTicketsCount: number;
    personalizedTicketsCount: number;
    organizerId: string;
}