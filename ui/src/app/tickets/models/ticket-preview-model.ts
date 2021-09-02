export class TicketPreviewModel {
    id: string;
    eventName: string;
    date: string;
    beginTime: string;
    locationName: string;
    locationAddress: string;
    seat: string;
    placeholders: ImageModel[];
    ticketOnSale: boolean;
    repersonalizationWaiting: boolean;
    linkedAccountsTicket: boolean;
    organizer: string;
}

export class ImageModel {
    image: string;
    mimetype:string;
    originalname: string;
}