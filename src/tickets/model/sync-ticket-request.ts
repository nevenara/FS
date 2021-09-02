import { ValidationError } from "../../common/errors/validation-error";
import { LocalisationKey } from "../../localisation/localisation-key";
import { TicketCategory } from "../../models/ticket-category";
import { Gender } from "../../models/gender";
import { MultierFile } from "../../common/multier-file";
import { Bootstrapper } from "../../bootstrapper";

export class SyncTicketRequest {
    public email: string;
    public bookingId: string;
    public ticketId: string;
    public category: TicketCategory;
    public price: number;
    public eventName: string;
    public locationName: string;
    public locationAddress: string;
    public date: Date;
    public doorsOpen: Date;
    public termsOfEvent: string;
    public seat: string;
    public qrCode: string;
    public barcode: string;
    public ticketHolder: string;
    public organizer: string;
    public placeholderImages: Array<Object>;
    public additionalInfo: string;
    public firstName: string;
    public lastName: string;
    public eventImage: MultierFile;
    
    public validate(lang: string) {
        const localisationProvider = Bootstrapper.getLocalisationProvider();

        const mandatoryParams = [
            'email', 
            'bookingId',
            'ticketId',
            'price',
            'eventName',
            'locationName',
            'locationAddress',
            'date',
            'doorsOpen',
            'seat',
            'firstName',
            'lastName',
            'organizer'
        ];

        mandatoryParams.forEach(param => {
            if (!this[param]) {
                throw new ValidationError(localisationProvider.translate(LocalisationKey.MissingFields, lang));
            }
        });

        if (this.category && !(this.category in TicketCategory)) {
            throw new ValidationError(localisationProvider.translate(LocalisationKey.InvalidTicketCategory, lang));
        }
    }
}