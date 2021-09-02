
const headingColumnNames = [
    { key: "companyName", header: 'Organizer / Ticket Seller' },
    { key: "contactPerson", header: 'Contact Person' },
    { key: "email", header: "Email" },
    { key: "phone", header: 'Phone' },
    { key: "status", header: 'Status' }
];

export class BaseExportOrganizersController{
    protected getHeadingColumnNames(){
        return headingColumnNames;
    }
}