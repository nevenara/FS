export enum TicketStatus {

    // Pre-personalized
    // Every incoming ticket with First name and Last name entered during purchase process
    // Also fake names and multiple times the same name (example: buyer entered only his name for all tickets)
    NonPersonalized = 0,

    // THIS ONE IS MISSING Personalized pending
    // as soon as ticket is assigned to the ticket holder (actual attendee)
    // Ticket holder has not yet performed ID verification process 

    // Personalized
    // as soon as ticket is assigned to the ticket holder (actual attendee)
    // Ticket holder has already performed ID verification process (successfully)
    Personalized = 1,

    //     Personalization failed 
    // as soon as ticket is assigned to the ticket holder (actual attendee)
    // Ticket holder has performed invalid ID Check


    //For Sale
    ForSale = 2,

    RePersonalisationWaiting = 3,

    Blocked = 4,

    NotAvailable = 5,

    Returned = 6,

    WaitingForPaymentStatus = 7,

    CheckedIn = 8
}