import { UserType } from "../../models/user-type";
import { IUserValue } from "../../user/user-value";

export class SessionModel {
    public userId: string;
    public userType: UserType;
    public email: string;
    public firstname: string;
    public lastname: string;
    public country: string;
    public proxyUserId: string;
    public proxyUserType: UserType; 
    public organizerId: string;
    public lang: string;
    public eventId: string;

    public constructor(user: IUserValue, lang: string, eventId: string = null) {
        this.userId = user._id;
        this.userType = user.usertype;
        this.email = user.email;
        this.firstname = user.firstname;
        this.lastname = user.lastname;
        this.country = user.country;
        this.organizerId = user.organizerId;
        this.lang = lang;
        this.eventId = eventId;
    }
}