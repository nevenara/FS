import { ValidationError } from "./errors/validation-error";
import { LocalisationKey } from "../localisation/localisation-key";
import { IUserContext } from "./user-context";
import { ILocalisationProvider } from "../localisation/localisation-provider";

// problem with lang
export abstract class Validator {
    constructor(protected context: IUserContext, protected localisationProvider: ILocalisationProvider){}

    protected validateProfileImage(image: Object) {
        let maxSize = 15 * 1024 * 1024;
        let allowedMimetypes = ['image/jpg', 'image/jpeg', 'image/png'];

        this.validateFile(image, maxSize, allowedMimetypes);
    }

    protected validateFile(file: Object, maxSize: number, allowedMimetypes: Array<string>) {
        if(file['size'] > maxSize){
            throw new ValidationError(this.localisationProvider.translate(LocalisationKey.ImageTooBig));
        }

        if(!allowedMimetypes.includes(file['mimetype'])){
            throw new ValidationError(this.localisationProvider.translate(LocalisationKey.InvalidImageType));
        }
    }

    protected validatePasswordFormat(password: string) {
        let regexp = new RegExp('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{6,}');

        if (!regexp.test(password)) {
            throw new ValidationError(this.localisationProvider.translate(LocalisationKey.InvalidPasswordFormat));
        }
    }

    protected validateUsernameFormat(username: string) {
        let regexp = new RegExp('.{4,}');

        if (!regexp.test(username)) {
            throw new ValidationError(this.localisationProvider.translate(LocalisationKey.InvalidUsernameFormat));
        }
    }

    protected validatePhoneFormat(phone: string) {
        if (phone) {
            const regex = new RegExp('^[0-9+-]*$');

            if (!regex.test(phone)) {
                throw new ValidationError(this.localisationProvider.translate(LocalisationKey.InvalidPhoneFormat));
            }
        }
    }

    protected validateFieldsLength(fieldsLength: Object, request: any) {
        Object.keys(fieldsLength).forEach(field => {
            if (request[field] && request[field].length > fieldsLength[field]) {
                throw new ValidationError(this.localisationProvider.translate(LocalisationKey.TooLongField));
            }
        });
    }

}