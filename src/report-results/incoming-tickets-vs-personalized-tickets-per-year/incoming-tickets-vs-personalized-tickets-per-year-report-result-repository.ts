import { EntityType } from "../../db/entity-type";
import { IMongoRepository, MongoRepository } from "../../db/mongo-repository";
import { QueryObject } from "../../db/query/query-object";
import { IncomingTicketsVsPersonalizedTicketsPerYearReportResultDbObject } from "./incoming-tickets-vs-personalized-tickets-per-year-report-result-db-object";
import { IIncomingTicketsVsPersonalizedTicketsPerYearReportResultValue } from "./incoming-tickets-vs-personalized-tickets-per-year-report-result-value";
import * as mongoose from "mongoose";

export interface IIncomingTicketsVsPersonalizedTicketsPerYearReportResultRepository extends IMongoRepository<IncomingTicketsVsPersonalizedTicketsPerYearReportResultDbObject> {
    getByYear(year: number, organizerId: string): Promise<IIncomingTicketsVsPersonalizedTicketsPerYearReportResultValue>;
    getAll(organizerId: string): Promise<IIncomingTicketsVsPersonalizedTicketsPerYearReportResultValue[]>;
}

export class IncomingTicketsVsPersonalizedTicketsPerYearReportResultRepository extends MongoRepository<IncomingTicketsVsPersonalizedTicketsPerYearReportResultDbObject> implements IIncomingTicketsVsPersonalizedTicketsPerYearReportResultRepository {
    constructor(){
        super(EntityType.IncomingTicketsVsPersonalizedTicketsPerYearReportResult);
    }

    public async getByYear(year: number, organizerId: string): Promise<IIncomingTicketsVsPersonalizedTicketsPerYearReportResultValue> {
        const model = this.getModel();

        let res = [];
        if (organizerId) {
            res = await model.find({ year: year, organizerId: new mongoose.Types.ObjectId(organizerId) });
        }
        else {
            res = await model.find({ year: year, '$or': [{organizerId: {$exists: false}}, {organizerId:  {$eq: null}}] });

        }
        

        if (res && res.length > 0) {
            return (res[0] as unknown) as IIncomingTicketsVsPersonalizedTicketsPerYearReportResultValue;
        }

        return null;
    }

    public async getAll(organizerId: string): Promise<IIncomingTicketsVsPersonalizedTicketsPerYearReportResultValue[]> {
        const model = await this.getModel(); 

    
        let results: JSON[] = [];
        if (organizerId) {
            results = await model.find({ organizerId: new mongoose.Types.ObjectId(organizerId) }).sort({year: 1});
            console.log(results)
        }
        else {
            results = await model.find({ '$or': [{organizerId: {$exists: false}}, {organizerId:  {$eq: null}}]}).sort({year: 1});
        }

        if (results && results.length > 0) {
            const data = [];

            results.forEach(result => {
                data.push((result as unknown) as IIncomingTicketsVsPersonalizedTicketsPerYearReportResultValue);
            });    
            
            return data;
        }

        return [];
    }


}