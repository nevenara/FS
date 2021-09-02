import { DbObject } from "../../db/db-object";
import { IIncomingTicketsPerOrganizerReportResultValue } from "./incoming-tickets-per-organizer-report-result-value";

export class IncomingTicketsPerOrganizerReportResultDbObject extends DbObject {
    private incomingTicketsPerOrganizerData: IIncomingTicketsPerOrganizerReportResultValue;

    constructor(incomingTicketsPerOrganizerValue?: IIncomingTicketsPerOrganizerReportResultValue) {
        super(incomingTicketsPerOrganizerValue);
        this.incomingTicketsPerOrganizerData = this.data as any;
    }

    public get year(): number {
        return this.incomingTicketsPerOrganizerData.year;
    }
    
    public set year(v: number) {
        this.incomingTicketsPerOrganizerData.year = v;
    }

    public get incomingTicketsCount(): number {
        return this.incomingTicketsPerOrganizerData.incomingTicketsCount;
    }
    
    public set incomingTicketsCount(v: number) {
        this.incomingTicketsPerOrganizerData.incomingTicketsCount = v;
    }

    public set month(v: number) {
        this.incomingTicketsPerOrganizerData.month = v;
    }

    public get month(): number {
        return this.incomingTicketsPerOrganizerData.month;
    }

    public get organizerId(): string {
        return this.incomingTicketsPerOrganizerData.organizerId;
    }
    
    public set organizerId(v: string) {
        this.incomingTicketsPerOrganizerData.organizerId = v;
    }
    
    static MonthFieldName = "month";
    static YearFieldName = "year";
}