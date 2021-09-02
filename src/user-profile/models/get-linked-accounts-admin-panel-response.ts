export class GetLinkedAccountsAdminPanelResponse {
    public linkedAccounts: GetLinkedAccountAdminPanelResponse[];
}

export class GetLinkedAccountAdminPanelResponse {
    public userId: string;
    public firstname: string;
    public lastname: string;
    public username: string;
}
