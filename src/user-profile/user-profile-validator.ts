import { UpdateUserProfileRequest } from "./models/update-user-profile-request";
import { ValidationError } from "../common/errors/validation-error";
import { LocalisationKey } from "../localisation/localisation-key";
import { UpdateUserPasswordRequest } from "./models/update-user-password-request";
import { Hashing } from "../common/hashing";
import { UploadProfileImageHelperRequest } from "./models/upload-profile-image-helper-request";
import { EmailValidator } from "../common/email-validator";
import { AddUserAdminPanelRequest } from "./models/add-user-admin-panel-request";

export interface IUserProfileValidator {
    validateUpdateUserProfile(request: UpdateUserProfileRequest);
    validateUpdateUserPassword(request: UpdateUserPasswordRequest, currentPassword: string);
    validateUploadProfileImage(request: UploadProfileImageHelperRequest);
    validateAddUserAdminPanel(request: AddUserAdminPanelRequest);
    validateIsUnique(field: string, value: string);
}

export class UserProfileValidator extends EmailValidator implements IUserProfileValidator {
    
    public async validateAddUserAdminPanel(request: AddUserAdminPanelRequest) {
        //TODO check if something is missing from validation
        
        if(request.standardEmail){
            await this.validateEmail(request.standardEmail, true);
        }

        await this.validateIsUnique('username', request.username);
    }

    public validateUpdateUserProfile(request: UpdateUserProfileRequest) {
        this.validateFieldLength(request);
        this.validatePhoneFormat(request.phone);
    }

    public validateUpdateUserPassword(request: UpdateUserPasswordRequest, currentPassword: string) {
        if (request.newPassword != request.confirmPassword) {
            throw new ValidationError(this.localisationProvider.translate(LocalisationKey.NewPasswordAndConfirmPasswordDontMatch));
        }

        if (currentPassword != Hashing.hashPassword(request.currentPassword)) {
            throw new ValidationError(this.localisationProvider.translate(LocalisationKey.WrongPassword));
        }

        this.validatePasswordFormat(request.newPassword);
    }

    public validateUploadProfileImage(request: UploadProfileImageHelperRequest) {
        this.validateProfileImage(request.profileImage);
    }

    private validateFieldLength(request: UpdateUserProfileRequest) {
        let fieldsLength: Object = {
            'address': 255,
            'city': 255,
            'country': 255,
            'postCode': 10,
            'phone': 20
        };

        this.validateFieldsLength(fieldsLength, request);
    }

    public async validateIsUnique(field: string, value: string) {
        const users = await this.userRepository.getUserByField(field, value);

        if (users) {
            throw new ValidationError(LocalisationKey[field + 'NotUniqueAdminPanel']);
        }
    }
}