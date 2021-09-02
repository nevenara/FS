export class OrganizerMainDataPreview {
    public companyName: string;
    public ticketReturn: boolean;
    public fansafeSale: boolean;
    public linkToLomnidoBridge: string;
    public revenueSharing: number;
    public status: string;
    public contactPerson: string;
    public email: string;
    public phone: Phone;
    public url: string;
    public address: string;
    public postCode: string;
    public city: string;
    public country: Country; 
}

export class Phone{
    public countryCode: string;
    public dialCode: number;
    public e164Number: number;
    public internationalNumber: string;
    public nationalNumber: number;
    public number: number;
 }  

 export class Country{
    public key: string;
    public name: string;
 }