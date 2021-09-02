export class CompleteRegistrationRequest {
    public username: string;
    public firstname: string;
    public lastname: string;
    public address: string;
    public city: string;
    public country: string;
    public postCode: string;
    public birthDate: Date;
    public gender: number;
    public additionalEmails: Array<string> = [];
}