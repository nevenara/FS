import { ITicketValue } from "../../tickets/model/ticket";
import { IUserValue } from "../../user/user-value";

export class SPRepersonalizeTicketRequest{
    public ticket: ITicketValue;
    public newOwner: IUserValue;
    public paymentMethod: string;
}