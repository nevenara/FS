import { EmailValidator } from "../common/email-validator";
import { IUserAdditionalEmailsRepository } from "./user-additional-emails-repository";
import { IUserRepository } from "../user/user-repository";
import { AddAdditionalEmailRequest } from "./models/add-additional-email-request";
import { ValidationError } from "../common/errors/validation-error";
import { LocalisationKey } from "../localisation/localisation-key";
import { IBlacklistedEmailsRepository } from "../blacklisted-emails-db/blacklisted-emails-repository";
import { IUserContext } from "../common/user-context";
import { ILocalisationProvider } from "../localisation/localisation-provider";

export class AdditionalEmailsValidator extends EmailValidator {

    public MAX_NUMBER_OF_OTHER_EMAILS = 4;

    constructor(
        userRepository: IUserRepository, 
        addtionalEmailsRepository: IUserAdditionalEmailsRepository,
        blackListedEmailsRepository: IBlacklistedEmailsRepository,
        context: IUserContext,
        protected localisationProvider: ILocalisationProvider
    ) {
        super(userRepository, addtionalEmailsRepository, blackListedEmailsRepository, context, localisationProvider);
    }

    public async validateAddAdditionalEmail(request: AddAdditionalEmailRequest, userId: string) {
        await this.validateCountOfAdditionalEmails(userId);
        await this.validateEmail(request.email, false);
    }

    private async validateCountOfAdditionalEmails(userId: string) {
        const additionalEmails = await this.additionalEmailsRepository.getAdditionalEmailsByUserId(userId);

        if (additionalEmails && additionalEmails.length >= this.MAX_NUMBER_OF_OTHER_EMAILS) {
            throw new ValidationError(this.localisationProvider.translate(LocalisationKey.MaxNumberOfOtherEmailsExceeded));
        }
    }
    
}