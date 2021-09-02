import { Gender } from "../../models/gender";

export class UpdateUserAdminPanelRequest {
    public userId: string;
    public gender: Gender;
    public firstname: string;
    public lastname: string;
    public birthDate: Date;
    public address: string;
    public postCode: string;
    public city: string;
    public country: string;
    public phone: number;
}