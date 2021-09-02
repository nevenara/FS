import { IUserRepository } from "../user/user-repository";
import { IUserAdditionalEmailsRepository } from "../additional-emails/user-additional-emails-repository";
import { LocalisationKey } from "../localisation/localisation-key";
import { ValidationError } from "./errors/validation-error";
import IsEmail = require("isemail");
import { IBlacklistedEmailsRepository } from "../blacklisted-emails-db/blacklisted-emails-repository";
import { Validator } from "./validator";
import { IUserContext } from "./user-context";
import { ILocalisationProvider } from "../localisation/localisation-provider";
const Isemail = require('isemail');
export class EmailValidator extends Validator {

    constructor(
        protected userRepository: IUserRepository,
        protected additionalEmailsRepository: IUserAdditionalEmailsRepository,
        protected blackListedEmailsRepository: IBlacklistedEmailsRepository,
        protected context: IUserContext,
        protected localisationProvider: ILocalisationProvider
    ) {
        super(context, localisationProvider);
    }

    public async validateEmail(email: string, admin: boolean) {
        await this.validateFormatAndIsBlacklisted(email);
        await this.isUnique(email, admin);
    }

    public async isUnique(email: string, admin: boolean) {
        const users = await this.userRepository.getUserByField('email', email);
        const error = admin ? new ValidationError(this.localisationProvider.translate(LocalisationKey.emailNotUniqueAdminPanel)) : new ValidationError(this.localisationProvider.translate(LocalisationKey.emailNotUnique));

        if(users) {
            throw error;
        }

        const additionalEmail = await this.additionalEmailsRepository.getAdditionalEmailByEmail(email);

        if (additionalEmail){
            throw error;
        }
    }

    public async validateFormatAndIsBlacklisted(email: string) {
        const blackDomains = await this.blackListedEmailsRepository.getAll();
    
        if (!Isemail.validate(email)){
            throw new ValidationError(this.localisationProvider.translate(LocalisationKey.EmailNotValid));
        }

        blackDomains.forEach(bd => {
            if(email.endsWith(bd.domain))
                throw new ValidationError(this.localisationProvider.translate(LocalisationKey.EmailNotValid));
            
        });
    }

   
}