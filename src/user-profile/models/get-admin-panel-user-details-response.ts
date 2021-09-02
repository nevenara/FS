import { Gender } from "../../models/gender";
import { UserProfileImageResponse } from "./get-user-profile-response";
import { SearchAdminPanelUsersStatus } from "./search-admin-panel-users-status";

export class GetAdminPanelUserDetailsResponse {
    public userId: string;
    public username: string;
    public status: SearchAdminPanelUsersStatus;
    public verificationDate: Date;

    // Date, when user last time has requested a deletion of a linked account
    // dd.mm.yyyy (x days ago)
    public lastChangeLinkedAccounts: Date;
    
    public standardEmail: string;
    public isMainAccount: boolean;
    public gender: Gender;
    public firstName: string;
    public lastName: string;
    public dayOfBirth: Date;
    public address: string;
    public postalCode: string;
    public city: string;
    public country: string;
    public phone: string;
    public faceMatchStatus: boolean;
    public faceMatchScore: number;
    public bankAccountId: string;
    public stripeErrors: string[];
}