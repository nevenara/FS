export class GetUserAndLinkedAccountsResponse {
    public users: GetUserAndLinkedAccountResponse[];
}

export class GetUserAndLinkedAccountResponse {
    public id: string;
    public username: string;
}