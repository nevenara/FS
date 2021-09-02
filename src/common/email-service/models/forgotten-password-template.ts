import { ApplicationType } from "../../../basic-auth/models/application-type";

export class ForgottenPasswordTemplate{
    public firstname: string;
    public lastname: string; 
    public uuid: string;
    public appType: ApplicationType;
    public lang: string;
}