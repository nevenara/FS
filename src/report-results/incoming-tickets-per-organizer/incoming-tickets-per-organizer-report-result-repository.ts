import { EntityType } from "../../db/entity-type";
import { IMongoRepository, MongoRepository } from "../../db/mongo-repository";
import { QueryObject } from "../../db/query/query-object";
import { SortOrder } from "../../db/query/sort-option";
import { IncomingTicketsPerOrganizerReportResultDbObject } from "./incoming-tickets-per-organizer-report-result-db-object";
import { IIncomingTicketsPerOrganizerReportResultValue } from "./incoming-tickets-per-organizer-report-result-value";
import { Model } from "mongoose";

export interface IIncomingTicketsPerOrganizerReportResultRepository extends IMongoRepository<IncomingTicketsPerOrganizerReportResultDbObject> {
    getByMonth(year: number, month: number): Promise<IIncomingTicketsPerOrganizerReportResultValue>;
    getAll(): Promise<IIncomingTicketsPerOrganizerReportResultValue[]>;
}

export class IncomingTicketsPerOrganizerReportResultRepository extends MongoRepository<IncomingTicketsPerOrganizerReportResultDbObject> implements IIncomingTicketsPerOrganizerReportResultRepository {
    constructor(){
        super(EntityType.IncomingTicketsPerOrganizerReportResult);
    }

    public async getByMonth(year: number, month: number): Promise<IIncomingTicketsPerOrganizerReportResultValue> {
        const model = this.getModel();

        const res = await model.find({ year: year, month: month });

        if (res && res.length > 0) {
            return (res[0] as unknown) as IIncomingTicketsPerOrganizerReportResultValue;
        }

        return null;
    }

    //get last 4 months
    public async getAll(): Promise<IIncomingTicketsPerOrganizerReportResultValue[]> {
        const model: Model<IncomingTicketsPerOrganizerReportResultDbObject> = this.getModel();

        const results: JSON[] = await model.find().sort({
            year: 1,
            month: 1
        });

        if (results && results.length > 0) {
            const data = [];
        
            const limit = results.length < 4 ? results.length : 4; 
            
            for (let i = 0; i < limit; i++) {
                const result = results[i];
                data.push((result as unknown) as IncomingTicketsPerOrganizerReportResultDbObject);
            }   

            return data;
        }

        return [];
    }


}