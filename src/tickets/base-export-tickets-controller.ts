
const headingColumnNames = [
    { key: "bookingId", header: 'Booking Id' },
    { key: "ticketId", header: 'Ticket Id' },
    { key: "organizer", header: "Organizer" },
    { key: "eventName", header: 'Event Name' },
    { key: "eventDate", header: 'Event Date' },
    { key: "eventLocation", header: 'Event Location' },
    { key: "ticketBuyer", header: 'Ticket Buyer' },
    { key: "ticketHolder", header: 'Ticket Holder' },
    { key: "status", header: 'Status' }
];

export class BaseExportTicketsController{
    protected getHeadingColumnNames(){
        return headingColumnNames;
    }
}