export class TicketPreviewModel {
    id: string;
    eventName: string;
    date: string;
    beginTime: string;
    locationName: string;
    locationAddress: string;
    seat: string;
    ticketOnSale: boolean;
    repersonalizationWaiting: boolean;
    linkedAccountsTicket: boolean;
    organizer: string;
    eventHash: string;
    syncDate: string;
    prePersonalizedToUsername: string;
    prePersonalizedToFirstName: string;
    prePersonalizedToLastName: string;
    eventId: string;
    originalPrice: number;
    priceForSale: number;
    reserved: boolean;
    isPrePersEditable: boolean;
    search;
    usernamesAndEmails = [];
    userIds = [];
    usernameAndEmail: string;
}