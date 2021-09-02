import { UserStatus } from "../../models/user-status";

export class PersonalizeMainAccountTicketsResponse {
    constructor(){
        this.info = 'PersonalizeMainAccountTicketsResponse';
    }
    
    private info: string;
    public userId: string;
    public userStatus: string;
    public totalTicketsPersonalized: number;
}