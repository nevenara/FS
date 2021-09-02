import { Gender } from "../../models/gender";
import { UserType } from "../../models/user-type";

export class GetUserProfileResponse {
    public userId: string;
    public email: string;
    public username: string;
    public firstName: string;
    public lastName: string;
    public gender: Gender;
    public birthDate: Date;
    public address: string;
    public postCode: string;
    public city: string;
    public country: string;
    public phone: string;
    public additionalEmails: Array<Object>;
    public profileImage: UserProfileImageResponse;
    public status: string;
    public userType: UserType
}

export class UserProfileImageResponse {
    public image: string;
    public mimetype: string;
    public originalname: string;
}