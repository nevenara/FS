import { EntityType } from "../../db/entity-type";
import { IMongoRepository, MongoRepository } from "../../db/mongo-repository";
import { QueryObject } from "../../db/query/query-object";
import { UsersRegisteredVsUsersVerifiedPerYearReportResultDbObject } from "./users-registered-vs-users-verified-per-year-report-result-db-object";
import { IUsersRegisteredVsUsersVerifiedPerYearReportResultValue } from "./users-registered-vs-users-verified-per-year-report-result-value";

export interface IUsersRegisteredVsUsersVerifiedPerYearReportResultRepository extends IMongoRepository<UsersRegisteredVsUsersVerifiedPerYearReportResultDbObject> {
    getByYear(year: number): Promise<IUsersRegisteredVsUsersVerifiedPerYearReportResultValue>;
    getAll(): Promise<IUsersRegisteredVsUsersVerifiedPerYearReportResultValue[]>;
}

export class UsersRegisteredVsUsersVerifiedPerYearReportResultRepository extends MongoRepository<UsersRegisteredVsUsersVerifiedPerYearReportResultDbObject> implements IUsersRegisteredVsUsersVerifiedPerYearReportResultRepository {
    constructor() {
        super(EntityType.UsersRegisteredVsUsersVerifiedPerYearReportResult);
    }

    public async getByYear(year: number): Promise<IUsersRegisteredVsUsersVerifiedPerYearReportResultValue> {
        const model = this.getModel();

        const res = await model.find({ year: year });

        if (res && res.length > 0) {
            return (res[0] as unknown) as IUsersRegisteredVsUsersVerifiedPerYearReportResultValue;
        }

        return null;
    }

    public async getAll(): Promise<IUsersRegisteredVsUsersVerifiedPerYearReportResultValue[]> {
        const model = await this.getModel();
        const results: JSON[] = await model.find().sort({year: 1});

        if (results && results.length > 0) {
            const data = [];

            results.forEach(result => {
                data.push((result as unknown) as IUsersRegisteredVsUsersVerifiedPerYearReportResultValue);
            });

            return data;
        }

        return [];
    }
}