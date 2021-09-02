import { DbObject } from "../db/db-object";
import { ITicketPlaceholderImageValue } from "./ticket-placeholder-image-value";

export class TicketPlaceholderImageDbObject extends DbObject{
    private ticketPlaceholderImageData: ITicketPlaceholderImageValue;

    constructor(ticketPlaceholderImageValue?: ITicketPlaceholderImageValue){
        super(ticketPlaceholderImageValue);
        this.ticketPlaceholderImageData = this.data as any;
    }
    
    public get ticketId() {
        return this.ticketPlaceholderImageData.ticketId;
    }
    public set ticketId(v) {
        this.ticketPlaceholderImageData.ticketId = v;
    }
    
    public get image() : Buffer {
        return this.ticketPlaceholderImageData.image;
    }

    public set image(v : Buffer) {
        this.ticketPlaceholderImageData.image = v;
    }

    public get originalname(): string {
        return this.ticketPlaceholderImageData.originalname;
    }
    public set originalname(v: string) {
        this.ticketPlaceholderImageData.originalname = v;
    }

    public get mimetype(): string {
        return this.ticketPlaceholderImageData.mimetype;
    }

    public set mimetype(v: string) {
        this.ticketPlaceholderImageData.mimetype = v;
    }

    public get size(): number {
        return this.ticketPlaceholderImageData.size;
    }
    
    public set size(v: number) {
        this.ticketPlaceholderImageData.size = v;
    }

    public static TicketIdFieldName = "ticketId";
}
