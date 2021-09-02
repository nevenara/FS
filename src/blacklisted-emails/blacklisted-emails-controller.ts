import { IUserContext } from "../common/user-context";
import { IBlacklistedEmailsRepository } from "../blacklisted-emails-db/blacklisted-emails-repository";
import { IBlacklistedEmailsValidator } from "./blacklisted-emails-validator";
import { IBlacklistedEmailsValue } from "../blacklisted-emails-db/blacklisted-emails-value";
import { AddBlacklistedEmailRequest } from "./models/add-blacklisted-email-request";
import { AddBlacklistedEmailResponse } from "./models/add-blacklisted-email-response";
import { GetBlackListedEmailsResponse } from "./models/get-blacklisted-emails-response";
import { UserType } from "../models/user-type";
import { BlacklistedEmailsDbObject } from "../blacklisted-emails-db/blacklisted-emails-db-object";

export interface IBlacklistedEmailsController {
    getBlacklistedEmails(): Promise<GetBlackListedEmailsResponse>;
    addBlacklistedEmail(request: AddBlacklistedEmailRequest): Promise<AddBlacklistedEmailResponse>;
}

export class BlacklistedEmailsController implements IBlacklistedEmailsController {
    public static AUTHORIZED_USER_TYPES = [UserType.Admin, UserType.SuperAdmin];

    constructor(
        private context: IUserContext, 
        private blacklistedEmailsRepository: IBlacklistedEmailsRepository,
        private blacklistedEmailsValidator: IBlacklistedEmailsValidator
    ) {}

    public async getBlacklistedEmails(): Promise<GetBlackListedEmailsResponse> {
        this.context.validateIfAuthenticated();
        this.context.validateAuthorization(BlacklistedEmailsController.AUTHORIZED_USER_TYPES);

        const blacklistedEmails: Array<IBlacklistedEmailsValue> = await this.blacklistedEmailsRepository.getAll();

        let response: GetBlackListedEmailsResponse = new GetBlackListedEmailsResponse();

        blacklistedEmails.forEach(email => {
            response.domains.push(email.domain);
        });

        return response;
    }

    public async addBlacklistedEmail(request: AddBlacklistedEmailRequest): Promise<AddBlacklistedEmailResponse> {
        this.context.validateIfAuthenticated();
        this.context.validateAuthorization(BlacklistedEmailsController.AUTHORIZED_USER_TYPES);

        request.validate(this.context.lang);

        await this.blacklistedEmailsValidator.validateAddBlacklistedEmail(request);

        const blacklistedEmail: BlacklistedEmailsDbObject = new BlacklistedEmailsDbObject();
        blacklistedEmail.domain = request.domain;

        await this.blacklistedEmailsRepository.create(blacklistedEmail);

        return new AddBlacklistedEmailResponse();
    }
}