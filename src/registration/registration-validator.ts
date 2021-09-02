import { RegisterRequest } from "./models/register-request";
import { CompleteRegistrationRequest } from "./models/complete-registration-request";
import { ValidationError } from "../common/errors/validation-error";
import { LocalisationKey } from "../localisation/localisation-key";
import { IUserRepository } from "../user/user-repository";
import { IUserValue } from "../user/user-value";
import { EmailValidator } from "../common/email-validator";
import { IUserAdditionalEmailsRepository } from "../additional-emails/user-additional-emails-repository";
import { IBlacklistedEmailsRepository } from "../blacklisted-emails-db/blacklisted-emails-repository";
import { validate } from "isemail";
import { IUserContext } from "../common/user-context";
import { ILocalisationProvider } from "../localisation/localisation-provider";

export interface IRegistrationValidator {
    validateRegistration(request: RegisterRequest);
    validateCompleteRegistration(request: CompleteRegistrationRequest, user: IUserValue);
}

export class RegistrationValidator extends EmailValidator implements IRegistrationValidator {

    constructor(
        userRepository: IUserRepository,
        additionalEmailRepository: IUserAdditionalEmailsRepository,
        blackListedEmailsRepository: IBlacklistedEmailsRepository,
        context: IUserContext,
        localisationProvider: ILocalisationProvider
    ) {
        super(userRepository, additionalEmailRepository, blackListedEmailsRepository, context, localisationProvider);
    }

    public async validateRegistration(request: RegisterRequest) {
        this.validatePasswordFormat(request.password1);
        await this.validateEmail(request.email, false);
    }

    public async validateCompleteRegistration(request: CompleteRegistrationRequest, user: IUserValue) {
        await this.validateIsUnique("username", request.username);

        try {
            const date = new Date(request.birthDate);
            request.birthDate = date;
        } catch (error) {
            throw new ValidationError(this.localisationProvider.translate(LocalisationKey.InvalidBirthDate));
        } 

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

        if (request.otherEmails) {

            if ((new Set(request.otherEmails)).size !== request.otherEmails.length) {
                throw new ValidationError(this.localisationProvider.translate(LocalisationKey.DuplicatedEmails));
            }

            request.otherEmails.forEach(async email => {
                await this.validateEmail(email, false);
            });
        }
    }

    private async validateIsUnique(field: string, value: string) {
        const users = await this.userRepository.getUserByField(field, value);

        if (users) {
            throw new ValidationError(LocalisationKey[field + 'NotUnique']);
        }
    }
}