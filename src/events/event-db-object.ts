import { DbObject } from "../db/db-object";
import { IEventValue } from "./event-value";

export class EventDbObject extends DbObject {
    private eventValue: IEventValue;

    constructor(eventValue?: IEventValue) {
        super(eventValue);
        this.eventValue = this.data as any;
    }

    public get eventName(): string {
        return this.eventValue.eventName;
    }

    public set eventName(v: string) {
        this.eventValue.eventName = v;
    }

    public get locationName(): string {
        return this.eventValue.locationName;
    }

    public set locationName(v: string) {
        this.eventValue.locationName = v;
    }

    public get locationAddress(): string {
        return this.eventValue.locationAddress;
    }
    public set locationAddress(v: string) {
        this.eventValue.locationAddress = v;
    }

    public get date(): Date {
        return this.eventValue.date;
    }

    public set date(v: Date) {
        this.eventValue.date = v;
    }

    public get beginTime(): Date {
        return this.eventValue.beginTime;
    }

    public set beginTime(v: Date) {
        this.eventValue.beginTime = v;
    }

    public get image(): Buffer {
        return this.eventValue.image;
    }

    public set image(v: Buffer) {
        this.eventValue.image = v;
    }

    public get imageMimetype(): string {
        return this.eventValue.imageMimetype;
    }
    public set imageMimetype(v: string) {
        this.eventValue.imageMimetype = v;
    }

    public get imageSize(): number {
        return this.eventValue.imageSize;
    }
    public set imageSize(v: number) {
        this.eventValue.imageSize = v;
    }

    public get doorsOpen(): Date {
        return this.eventValue.doorsOpen;
    }

    public set doorsOpen(v: Date) {
        this.eventValue.doorsOpen = v;
    }

    public get termsOfEvent(): string {
        return this.eventValue.termsOfEvent;
    }

    public set termsOfEvent(v: string) {
        this.eventValue.termsOfEvent = v;
    }

    public get organizerId(): string[] {
        return this.eventValue.organizerId;
    }

    public set organizerId(v: string[]) {
        this.eventValue.organizerId = v;
    }

    public get imageOriginalName(): string {
        return this.eventValue.imageOriginalName;
    }
    public set imageOriginalName(v: string) {
        this.eventValue.imageOriginalName = v;
    }
}