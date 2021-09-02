import { ITicketValue } from "./ticket";
import { Currency } from "./currency";
import { GetTicketPlaceholderImagesResponse } from "./get-ticket-placeholder-images-response";

export class GetNonPersonalizedTicketsByEventResponse {
    public idVerified: boolean;
    public tickets: NonPersonalizedTicketDetails[] = [];   
}

export class NonPersonalizedTicketDetails {
    public id: string;
    public eventName: string;
    public date: string;
    public beginTime: string;
    public doorsOpen: string;
    public syncDate: string;
    public seat: string;
    public locationName: string;
    public locationAddress: string;
    public originalPrice: number;
    public priceCurrency: Currency;
    public ticketId: string;
    public bookingId: string;
    public placeholderImages: Array<GetTicketPlaceholderImagesResponse>;
    public organizer: string;
    public prePersonalizedTo: string;
    public prePersonalizedToFirstName: string;
    public prePersonalizedToLastName: string;
    public isPrePersEditable: boolean;
    public possibleUsernamesAndEmails: PossibleTicketHolder[] = []; 
    public isBuyer: boolean;
    public usernameAndEmail: string;
}

export class PossibleTicketHolder {
    userId: string;
    usernameAndEmail: string;
}