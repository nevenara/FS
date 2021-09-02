export class UserPreview {
    public userId: string;
    public username: string;
    public email: string;
    public firstName: string;
    public lastName: string;
    public mainAccount: boolean;
    public signUpDate: Date;
    public verificationDate: Date;
    public status: SearchAdminPanelUsersStatus;
    public reasonForInactivity: ReasonForInactivity;
}

export enum SearchAdminPanelUsersStatus {
    //User has verified his email
    Registered = 1,

    //User has performed Id Check
    Verified = 2,

    //User has provided bank account & proof of address
    VerifiedInclBankAccount = 3,

    //Blocked
    Inactive = 4
}

export enum ReasonForInactivity {
    UserRequested = 'User requested',
    UserVerificationInvalid = 'User verification invalid',
    MisuseLinkedAccounts = 'Misuse linked accounts',
    SuspectedTicketTrading = 'Suspected ticket trading',
    MainAccountDeleted = 'Main account deleted'
}