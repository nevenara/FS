import { IAdminSettingsController } from "./admin-settings-controller";
import { UploadDefaultProfileImageRequest } from "./models/upload-default-profile-image-response";
import { ValidationError } from "../../common/errors/validation-error";
import { LocalisationKey } from "../../localisation/localisation-key";
import { Validator } from "../../common/validator";

export interface IAdminSettingsValidator {
    validateUploadDefaultProfileImage(requestImage:  Object);
}

export class AdminSettingsValidator extends Validator implements IAdminSettingsValidator {
    
    public validateUploadDefaultProfileImage(requestImage: Object) {
        this.validateProfileImage(requestImage);
    }
    
}