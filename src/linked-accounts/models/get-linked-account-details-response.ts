import { Gender } from "../../models/gender";

export class GetLinkedAccountDetailsResponse {
    public id: string;
    public username: string;
    public gender: Gender;
    public firstname: string;
    public lastname: string;
    public birthDate: Date;
    public address: string;
    public postCode: string;
    public city: string;
    public country: string;
    public relationToMainAccount: string;
    public profileImage: string;
    public mimetype: string;
    public originalname: string;
}