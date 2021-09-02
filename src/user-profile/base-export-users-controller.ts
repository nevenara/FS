
const headingColumnNames = [
    { key: "username", header: 'Username' },
    { key: "email", header: 'Email' },
    { key: "firstName", header: "First Name" },
    { key: "lastName", header: 'Last Name' },
    { key: "mainAccount", header: 'Main Account' },
    { key: "signUpDate", header: 'SignUp Date' },
    { key: "verificationDate", header: 'Verification Date' },
    { key: "status", header: 'Status' },
    { key: "reasonForInactivity", header: 'Reason for inactivity' }
];

export class BaseExportUsersController{
    protected getHeadingColumnNames(){
        return headingColumnNames;
    }
}