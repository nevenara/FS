import { MomentRelativeTime } from "moment";
import { IDbData } from "../../db/idb-data";
import { TicketCategory } from "../../models/ticket-category";
import { Currency } from "./currency";
import { TicketStatus } from "./ticket-status";


export interface ITicketValue extends IDbData{
    bookingId: string;
    ticketId: string;
    category: TicketCategory;
    originalPrice: number;
    priceForSale: number;
    priceCurrency: Currency;
    eventName: string;
    locationName: string;
    locationAddress: string;
    date: Date;
    beginTime: Date;
    doorsOpen: Date;
    termsOfEvent: string;
    seat: string;
    qrCode: string;
    qrUuid: string;
    barcode: string;
    organizerId: string;
    //images will be stored in different collection..
    additionalInfo: string;
    userId: string;
    originalUserId: string;
    status: TicketStatus;
    email: string;
    reservationExpirationDate: Date;
    reservedOn: string;
    firstName: string;
    lastName: string;
    syncDate: Date;
    eventId: string;
    pendingUsername: string;
}