import { ValidationError } from "../../common/errors/validation-error";
import { IUserContext } from "../../common/user-context";
import { Validator } from "../../common/validator";
import { LocalisationKey } from "../../localisation/localisation-key";
import { ILocalisationProvider } from "../../localisation/localisation-provider";
import { IOrganizerRepository } from "../../organizer/organizer-repository";
import { UploadOrganizerPlaceholderImageRequest } from "./models/upload-organizer-placeholder-image-request";

export interface IOrganizerValidator {
    validateOrganizerPlaceholderImage(request: UploadOrganizerPlaceholderImageRequest);
    isCompanyNameUnique(companyName: string);
}

export class OrganizerValidator extends Validator implements IOrganizerValidator {
     constructor(
        private organizerRepository: IOrganizerRepository,
        protected context: IUserContext,
        protected localisationProvider: ILocalisationProvider
    ) {
        super(context, localisationProvider);
    }

    public async isCompanyNameUnique(companyName: string) {
        const organizer = await this.organizerRepository.getOrganizerByCompanyName(companyName);

        if (organizer) {
            throw new ValidationError(this.localisationProvider.translate(LocalisationKey.CompanyNameNotUnique));
        }
    }
    
    public validateOrganizerPlaceholderImage(request: UploadOrganizerPlaceholderImageRequest) {
        this.validateProfileImage(request.image);
    }
    
}