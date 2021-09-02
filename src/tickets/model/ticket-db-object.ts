import { DbObject } from "../../db/db-object";
import { ITicketValue } from "./ticket";
import { TicketCategory } from "../../models/ticket-category";
import { TicketStatus } from "./ticket-status";

export class TicketDbObject extends DbObject {
    private ticketValue: ITicketValue;

    constructor(ticketValue?: ITicketValue) {
        super(ticketValue);
        this.ticketValue = this.data as any;
    }

    public get bookingId(): string {
        return this.ticketValue.bookingId;
    }

    public set bookingId(v: string) {
        this.ticketValue.bookingId = v;
    }

    public get ticketId(): string {
        return this.ticketValue.ticketId;
    }

    public set ticketId(v: string) {
        this.ticketValue.ticketId = v;
    }

    public get category(): TicketCategory {
        return this.ticketValue.category;
    }

    public set category(v: TicketCategory) {
        this.ticketValue.category = v;
    }

    public get originalPrice(): number {
        return this.ticketValue.originalPrice;
    }
    public set originalPrice(v: number) {
        this.ticketValue.originalPrice = v;
    }

    public get priceForSale(): number {
        return this.ticketValue.priceForSale;
    }
    public set priceForSale(v: number) {
        this.ticketValue.priceForSale = v;
    }

    public get eventName(): string {
        return this.ticketValue.eventName;
    }

    public set eventName(v: string) {
        this.ticketValue.eventName = v;
    }

    public get locationName(): string {
        return this.ticketValue.locationName;
    }

    public set locationName(v: string) {
        this.ticketValue.locationName = v;
    }

    public get locationAddress(): string {
        return this.ticketValue.locationAddress;
    }
    public set locationAddress(v: string) {
        this.ticketValue.locationAddress = v;
    }

    public get date(): Date {
        return this.ticketValue.date;
    }
    public set date(v: Date) {
        this.ticketValue.date = v;
    }

    public get beginTime(): Date {
        return this.ticketValue.beginTime;
    }
    public set beginTime(v: Date) {
        this.ticketValue.beginTime = v;
    }

    public get doorsOpen(): Date {
        return this.ticketValue.doorsOpen;
    }
    public set doorsOpen(v: Date) {
        this.ticketValue.doorsOpen = v;
    }

    public get termsOfEvent(): string {
        return this.ticketValue.termsOfEvent;
    }
    public set termsOfEvent(v: string) {
        this.ticketValue.termsOfEvent = v;
    }

    public get seat(): string {
        return this.ticketValue.seat;
    }

    public set seat(v: string) {
        this.ticketValue.seat = v;
    }

    public get qrCode(): string {
        return this.ticketValue.qrCode;
    }
    public set qrCode(v: string) {
        this.ticketValue.qrCode = v;
    }

    public get qrUuid(): string {
        return this.ticketValue.qrUuid;
    }
    public set qrUuid(v: string) {
        this.ticketValue.qrUuid = v;
    }

    public get barcode(): string {
        return this.ticketValue.barcode;
    }
    public set barcode(v: string) {
        this.ticketValue.barcode = v;
    }    

    public get organizerId(): string {
        return this.ticketValue.organizerId;
    }
    public set organizerId(v: string) {
        this.ticketValue.organizerId = v;
    }

    public get additionalInfo(): string {
        return this.ticketValue.additionalInfo;
    }
    public set additionalInfo(v: string) {
        this.ticketValue.additionalInfo = v;
    }

    public get userId(): string {
        return this.ticketValue.userId;
    }
    public set userId(v: string) {
        this.ticketValue.userId = v;
    }

    public get originalUserId(): string {
        return this.ticketValue.originalUserId;
    }

    public set originalUserId(v: string) {
        this.ticketValue.originalUserId = v;
    }

    public get email(): string {
        return this.ticketValue.email;
    }
    public set email(v: string) {
        this.ticketValue.email = v;
    }

    public get status(): TicketStatus {
        return this.ticketValue.status;
    }
    public set status(v: TicketStatus) {
        this.ticketValue.status = v;
    }

    public get reservationExpirationDate(): Date {
        return this.ticketValue.reservationExpirationDate;
    }

    public set reservationExpirationDate(v: Date) {
        this.ticketValue.reservationExpirationDate = v;
    }

    public get reservedOn(): string {
        return this.ticketValue.reservedOn;
    }

    public set reservedOn(v: string) {
        this.ticketValue.reservedOn = v;
    }

    public get firstName(): string {
        return this.ticketValue.firstName;
    }

    public set firstName(v: string) {
        this.ticketValue.firstName = v;
    }

    public get lastName(): string {
        return this.ticketValue.lastName;
    }

    public set lastName(v: string) {
        this.ticketValue.lastName = v;
    }

    public get syncDate(): Date {
        return this.ticketValue.syncDate;
    }

    public set syncDate(v: Date) {
        this.ticketValue.syncDate = v;
    }

    public get eventId(): string {
        return this.ticketValue.eventId;
    }
    
    public set eventId(v: string) {
        this.ticketValue.eventId = v;
    }

    public get pendingUsername(): string {
        return this.ticketValue.pendingUsername;
    }
    
    public set pendingUsername(v: string) {
        this.ticketValue.pendingUsername = v;
    }

    public static TicketIdFieldName = "id";
    public static EmailFieldName = "email";
    public static EventNameFieldName = 'eventName';
    public static EventDateFieldName = 'date';
    public static EvenBeginTimeFieldName = 'beginTime';
    public static SyncDateFieldName = 'syncDate';
    public static QRUuidName = 'qrUuid';
}