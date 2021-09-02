import { DbObject } from "../../db/db-object";
import { IUsersRegisteredVsUsersVerifiedPerYearReportResultValue } from "./users-registered-vs-users-verified-per-year-report-result-value";

export class UsersRegisteredVsUsersVerifiedPerYearReportResultDbObject extends DbObject {
    private usersRegisteredVsUsersVerifiedData: IUsersRegisteredVsUsersVerifiedPerYearReportResultValue;

    constructor(usersRegisteredVsUsersVerifiedValue?: IUsersRegisteredVsUsersVerifiedPerYearReportResultValue) {
        super(usersRegisteredVsUsersVerifiedValue);
        this.usersRegisteredVsUsersVerifiedData = this.data as any;
    }

    public get year(): number {
        return this.usersRegisteredVsUsersVerifiedData.year;
    }
    
    public set year(v: number) {
        this.usersRegisteredVsUsersVerifiedData.year = v;
    }

    public get usersRegisteredCount(): number {
        return this.usersRegisteredVsUsersVerifiedData.usersRegisteredCount;
    }
    
    public set usersRegisteredCount(v: number) {
        this.usersRegisteredVsUsersVerifiedData.usersRegisteredCount = v;
    }

    public get usersVerifiedCount(): number {
        return this.usersRegisteredVsUsersVerifiedData.usersVerifiedCount;
    }
    
    public set usersVerifiedCount(v: number) {
        this.usersRegisteredVsUsersVerifiedData.usersVerifiedCount = v;
    }    
}