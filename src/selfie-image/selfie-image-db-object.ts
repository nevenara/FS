import { DbObject } from "../db/db-object";
import { ISelfieImageValue } from "./selfie-image-value";

export class SelfieImageDbObject extends DbObject {
    private selfieImageData: ISelfieImageValue;

    constructor(profileImageValue?: ISelfieImageValue) {
        super(profileImageValue);
        this.selfieImageData = this.data as any;
    }

    public get userId() {
        return this.selfieImageData.userId;
    }
    public set userId(v) {
        this.selfieImageData.userId = v;
    }

    public get image(): Buffer {
        return this.selfieImageData.image;
    }

    public set image(v: Buffer) {
        this.selfieImageData.image = v;
    }

    public get originalname(): string {
        return this.selfieImageData.originalname;
    }
    public set originalname(v: string) {
        this.selfieImageData.originalname = v;
    }

    public get mimetype(): string {
        return this.selfieImageData.mimetype;
    }

    public set mimetype(v: string) {
        this.selfieImageData.mimetype = v;
    }

    public get size(): number {
        return this.selfieImageData.size;
    }
    
    public set size(v: number) {
        this.selfieImageData.size = v;
    }
}