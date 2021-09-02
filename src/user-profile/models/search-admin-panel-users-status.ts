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