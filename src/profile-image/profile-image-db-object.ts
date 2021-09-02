import { DbObject } from "../db/db-object";
import { IProfileImageValue } from "./profile-image-value";

export class ProfileImageDbObject extends DbObject{
    private userData: IProfileImageValue;

    constructor(profileImageValue?: IProfileImageValue){
        super(profileImageValue);
        this.userData = this.data as any;
    }
    
    public get userId() {
        return this.userData.userId;
    }
    public set userId(v) {
        this.userData.userId = v;
    }
    
    public get image() : Buffer {
        return this.userData.image;
    }

    public set image(v : Buffer) {
        this.userData.image = v;
    }

    public get smallImage() : Buffer {
        return this.userData.image;
    }

    public set smallImage(v : Buffer) {
        this.userData.image = v;
    }

    public get isDefaultImage() : Boolean {
        return this.userData.isDefaultImage;
    }

    public set isDefaultImage(v : Boolean) {
        this.userData.isDefaultImage = v;
    }

    public get originalname(): string {
        return this.userData.originalname;
    }
    public set originalname(v: string) {
        this.userData.originalname = v;
    }

    public get mimetype(): string {
        return this.userData.mimetype;
    }

    public set mimetype(v: string) {
        this.userData.mimetype = v;
    }

    public get size(): number {
        return this.userData.size;
    }
    
    public set size(v: number) {
        this.userData.size = v;
    }

    public static UserIdFieldName = "userId";
    public static IsDefaultImageFieldName = "isDefaultImage";
}