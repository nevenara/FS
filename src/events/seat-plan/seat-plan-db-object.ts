import { DbObject } from "../../db/db-object";
import { ISeatPlanValue } from "./seat-plan-value";

export class SeatPlanDbObject extends DbObject {
    private seatPlanValue: ISeatPlanValue;

    constructor(seatPlanValue?: ISeatPlanValue) {
        super(seatPlanValue);
        this.seatPlanValue = this.data as any;
    }

    public get eventId(): string {
        return this.seatPlanValue.eventId;
    }
    public set eventId(v: string) {
        this.seatPlanValue.eventId = v;
    }

    public get url(): string {
        return this.seatPlanValue.url;
    }
    public set url(v: string) {
        this.seatPlanValue.url = v;
    }

    public get image(): Buffer {
        return this.seatPlanValue.image;
    }

    public set image(v: Buffer) {
        this.seatPlanValue.image = v;
    }

    public get imageMimetype(): string {
        return this.seatPlanValue.imageMimetype;
    }
    public set imageMimetype(v: string) {
        this.seatPlanValue.imageMimetype = v;
    }

    public get imageSize(): number {
        return this.seatPlanValue.imageSize;
    }
    public set imageSize(v: number) {
        this.seatPlanValue.imageSize = v;
    }

    public get imageOriginalName(): string {
        return this.seatPlanValue.imageOriginalName;
    }
    public set imageOriginalName(v: string) {
        this.seatPlanValue.imageOriginalName = v;
    }

}