import { DbObject } from "../db/db-object";
import { IOrganizerPlaceholderImageValue } from "./organizer-placeholder-image-value";

export class OrganizerPlaceholderImageDbObject extends DbObject{
    private organizerPlaceholderImageData: IOrganizerPlaceholderImageValue;

    constructor(organizertPlaceholderImageValue?: IOrganizerPlaceholderImageValue){
        super(organizertPlaceholderImageValue);
        this.organizerPlaceholderImageData = this.data as any;
    }
    
    public get organizerId() {
        return this.organizerPlaceholderImageData.organizerId;
    }
    public set organizerId(v) {
        this.organizerPlaceholderImageData.organizerId = v;
    }
    
    public get image() : Buffer {
        return this.organizerPlaceholderImageData.image;
    }

    public set image(v : Buffer) {
        this.organizerPlaceholderImageData.image = v;
    }

    public get originalname(): string {
        return this.organizerPlaceholderImageData.originalname;
    }
    public set originalname(v: string) {
        this.organizerPlaceholderImageData.originalname = v;
    }

    public get mimetype(): string {
        return this.organizerPlaceholderImageData.mimetype;
    }

    public set mimetype(v: string) {
        this.organizerPlaceholderImageData.mimetype = v;
    }

    public get size(): number {
        return this.organizerPlaceholderImageData.size;
    }
    
    public set size(v: number) {
        this.organizerPlaceholderImageData.size = v;
    }

    public get isDefaultImage(): boolean {
        return this.organizerPlaceholderImageData.isDefaultImage;
    }
    
    public set isDefaultImage(v: boolean) {
        this.organizerPlaceholderImageData.isDefaultImage = v;
    }

    public static OrganizerIdFieldName = "organizerId";
    public static IsDefaultImageFieldName = "isDefaultImage";
}
