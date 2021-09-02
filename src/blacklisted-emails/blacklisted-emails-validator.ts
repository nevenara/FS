import { AddBlacklistedEmailRequest } from "./models/add-blacklisted-email-request";
import { IBlacklistedEmailsRepository } from "../blacklisted-emails-db/blacklisted-emails-repository";
import { ValidationError } from "../common/errors/validation-error";
import { LocalisationKey } from "../localisation/localisation-key";
import { IUserContext } from "../common/user-context";
import { ILocalisationProvider } from "../localisation/localisation-provider";

export interface IBlacklistedEmailsValidator {
    validateAddBlacklistedEmail(request: AddBlacklistedEmailRequest);
}

export class BlacklistedEmailsValidator implements IBlacklistedEmailsValidator {

    constructor(private blacklistedEmailsRepository: IBlacklistedEmailsRepository, private context: IUserContext, private localisationProvider: ILocalisationProvider) {}

    public async validateAddBlacklistedEmail(request: AddBlacklistedEmailRequest) {
        const email = await this.blacklistedEmailsRepository.getBlacklistedEmailByDomain(request.domain);

        if (email) {
            throw new ValidationError(this.localisationProvider.translate(LocalisationKey.BlacklistedEmailAlreadyExists));
        }
    }
}