import { Bootstrapper } from "../../../bootstrapper";
import { ValidationError } from "../../../common/errors/validation-error";
import { LocalisationKey } from "../../../localisation/localisation-key";

export class UploadEventImageRequest {
    eventId: string;
    image: Object;

    validate(lang: string) {
        if (!this.eventId || !this.image) {
            const localisationProvider = Bootstrapper.getLocalisationProvider();

            throw new ValidationError(localisationProvider.translate(LocalisationKey.MissingFields));
        }
    }
}