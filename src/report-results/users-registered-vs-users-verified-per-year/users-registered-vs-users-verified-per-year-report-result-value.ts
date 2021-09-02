import { IDbData } from "../../db/idb-data";

export interface IUsersRegisteredVsUsersVerifiedPerYearReportResultValue extends IDbData {
    year: number;
    usersRegisteredCount: number;
    usersVerifiedCount: number;
}