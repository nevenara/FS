export class GetUsersRegisteredVsUsersVerifiedResponse {
    public data: GetUsersRegisteredVsUsersVerifiedPerYearResponse[];
}

export class GetUsersRegisteredVsUsersVerifiedPerYearResponse {
    public year: number;
    public usersRegisteredCount: number;
    public usersVerifiedCount: number;
}