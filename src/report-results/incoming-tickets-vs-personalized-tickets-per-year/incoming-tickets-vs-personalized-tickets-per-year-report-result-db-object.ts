import { DbObject } from "../../db/db-object";
import { IIncomingTicketsVsPersonalizedTicketsPerYearReportResultValue } from "./incoming-tickets-vs-personalized-tickets-per-year-report-result-value";

export class IncomingTicketsVsPersonalizedTicketsPerYearReportResultDbObject extends DbObject {
    private incomingTicketsVsPersonalizedTicketsData: IIncomingTicketsVsPersonalizedTicketsPerYearReportResultValue;

    constructor(incomingTicketsVsPersonalizedTicketsValue?: IIncomingTicketsVsPersonalizedTicketsPerYearReportResultValue) {
        super(incomingTicketsVsPersonalizedTicketsValue);
        this.incomingTicketsVsPersonalizedTicketsData = this.data as any;
    }

    public get year(): number {
        return this.incomingTicketsVsPersonalizedTicketsData.year;
    }
    
    public set year(v: number) {
        this.incomingTicketsVsPersonalizedTicketsData.year = v;
    }

    public get incomingTicketsCount(): number {
        return this.incomingTicketsVsPersonalizedTicketsData.incomingTicketsCount;
    }
    
    public set incomingTicketsCount(v: number) {
        this.incomingTicketsVsPersonalizedTicketsData.incomingTicketsCount = v;
    }

    public get personalizedTicketsCount(): number {
        return this.incomingTicketsVsPersonalizedTicketsData.personalizedTicketsCount;
    }
    
    public set personalizedTicketsCount(v: number) {
        this.incomingTicketsVsPersonalizedTicketsData.personalizedTicketsCount = v;
    }

    public get organizerId(): string {
        return this.incomingTicketsVsPersonalizedTicketsData.organizerId;
    }
    
    public set organizerId(v: string) {
        this.incomingTicketsVsPersonalizedTicketsData.organizerId = v;
    }
    
}