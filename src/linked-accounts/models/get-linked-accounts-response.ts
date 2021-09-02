export class GetLinkedAccountsResponse {
    public linkedAccounts: Array<LinkedAccountElement> = [];
}

export class LinkedAccountElement {
    public id: string;
    public username: string;
    public firstname: string;
    public lastname: string;
}