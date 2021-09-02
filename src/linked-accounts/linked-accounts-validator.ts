import { ConnectNewAccountRequest } from "./models/connect-new-account-request";
import { IUserRepository } from "../user/user-repository";
import { ValidationError } from "../common/errors/validation-error";
import { LocalisationKey } from "../localisation/localisation-key";
import { IUserValue } from "../user/user-value";
import { Validator } from "../common/validator";
import { EditLinkedAccountRequest } from "./models/edit-linked-account-request";
import { SetLinkedAccountPasswordRequest } from "./models/set-linked-account-password-request";
import { UploadProfileImageLinkedAccountRequest } from "./models/upload-profile-image-linked-account-request";
import { UserStatus } from "../models/user-status";
import { ConfigService } from "../common/config-service";
import { IUserContext } from "../common/user-context";
import { ILocalisationProvider } from "../localisation/localisation-provider";

export class LinkedAccountsValidator extends Validator {
    constructor(private userRepository: IUserRepository, 
                private configService: ConfigService,
                protected context: IUserContext,
                protected localisationProvider: ILocalisationProvider) {
        super(context, localisationProvider);
    }

    public validateUploadProfileImage(request: UploadProfileImageLinkedAccountRequest) {
        this.validateProfileImage(request.profileImage);
    }

    public async validateConnectNewAccount(request: ConnectNewAccountRequest, userId: string) {
        await this.isUnique('username', request.username);
        await this.checkNumberOfLinkedAccounts(userId);
        
        this.validateUsernameFormat(request.username);

        let fieldsLength: Object = {
            'username': 255,
            'firstname': 255,
            'lastname': 255,
            'address': 255,
            'city': 255,
            'country': 255,
            'postCode': 10
        };

        this.validateFieldsLength(fieldsLength, request);

        if(request.profileImage) {
            this.validateProfileImage(request.profileImage);
        }
    }

    public validateUpdateLinkedAccount(request: EditLinkedAccountRequest) {
        let fieldsLength: Object = {
            'address': 255,
            'city': 255,
            'country': 255,
            'postCode': 10
        };

        this.validateFieldsLength(fieldsLength, request);
    }

    public validateSetPassword(request: SetLinkedAccountPasswordRequest) {
        if (request.password != request.confirmPassword) {
            throw new ValidationError(this.localisationProvider.translate(LocalisationKey.NewPasswordAndConfirmPasswordDontMatch));
        }

        this.validatePasswordFormat(request.password);
    }

    private async isUnique(field: string, value: any) {
        const user = await this.userRepository.getUserByField(field, value);

        if (user) {
            throw new ValidationError(this.localisationProvider.translate(LocalisationKey.usernameNotUnique));
        }
    }

    private async checkNumberOfLinkedAccounts(userId: string) {
        const linkedAccounts: Array<IUserValue> = await this.userRepository.getLinkedAccounts(userId);

        const maxNumberOfLinkedAccounts = await this.configService.getConfig('maxNumberOfLinkedAccounts', 4);
        if (linkedAccounts && linkedAccounts.length >= maxNumberOfLinkedAccounts) {
            throw new ValidationError(this.localisationProvider.translate(LocalisationKey.MaxNumOfLinkedAccountsExceeded));
        }
    }
}