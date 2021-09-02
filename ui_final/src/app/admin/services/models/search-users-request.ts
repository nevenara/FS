import { SortOrder } from '../../models/sort-order';

export class SearchUsersRequest {
    public textSearch: string;

    public status: Array<SearchAdminPanelUsersStatus>;
    public accountType: Array<SearchAdminPanelUsersAccountType>;
    public reasonForInactivity: Array<ReasonForInactivity>;

    //Date when user has performed ID Check
    public verificationDateFrom: Date;
    public verificationDateTo: Date;

    //Date when user has completed Registration Step 2
    public signUpDateFrom: Date;
    public signUpDateTo: Date;

    public page: number;
    public limit: number;

    public sortField: string;
    public sortOrder: SortOrder;
}

export enum SearchAdminPanelUsersAccountType {
    LinkedAccount = "Linked account",
    MainAccount = "Main account"
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