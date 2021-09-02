import { response } from "express";
import moment = require("moment");
import { isConstructorDeclaration } from "typescript";
import { EmailSender, IEmailSender } from "../common/email-service/email-sender";
import { Hashing } from "../common/hashing";
import { IUserContext } from "../common/user-context";
import { getUUID } from "../db/uuid";
import { PasswordRecoveryRequestDbObject } from "./password-recovery-request-db-object";
import { IPasswordRecoveryRequestRepository } from "./password-recovery-request-repository";
import { UserDbObject } from "../user/user-db-object";
import { IUserRepository } from "../user/user-repository";
import { PasswordRecoveryInitRequest } from "./models/password-recovery-init-request";
import { PasswordRecoveryInitResponse } from "./models/password-recovery-init-response";
import { PasswordRecoveryRequest } from "./models/password-recovery-request";
import { PasswordRecoveryResponse } from "./models/password-recovery-response";
import { IPasswordRecoveryValidator } from "./password-recovery-validator";
import { Email } from "../common/email-service/models/email";
import { Environment } from "../environment";
import { ForgottenPasswordTemplate } from "../common/email-service/models/forgotten-password-template";
import { ValidationError } from "../common/errors/validation-error";
import { LocalisationKey } from "../localisation/localisation-key";
import { UserActivityLogRequest } from "../user-activity-log/models/user-activity-log-request";
import { UserActivityType } from "../models/user-activity-type";
import { IUserActivityLogService } from "../user-activity-log/user-activity-log-service";
import { ConfigService } from "../common/config-service";
import { UserType } from "../models/user-type";
import { ApplicationType } from "../basic-auth/models/application-type";
import { ILocalisationProvider } from "../localisation/localisation-provider";

export interface IPasswordRecoveryController {
    resetPasswordGenerateLink(request: PasswordRecoveryInitRequest): Promise<PasswordRecoveryInitResponse>;
    resetPassword(request: PasswordRecoveryRequest): Promise<PasswordRecoveryResponse>
}

export class PasswordRecoveryController implements IPasswordRecoveryController{

    constructor(
        private passwordRecoveryRepository: IPasswordRecoveryRequestRepository,
        private passwordRecoveryValidator: IPasswordRecoveryValidator,
        private userRepository: IUserRepository,
        private emailSender: IEmailSender,
        private userActivityLogService: IUserActivityLogService,
        private configService: ConfigService,
        private localisationProvider: ILocalisationProvider
        ){}

    public async resetPasswordGenerateLink(request: PasswordRecoveryInitRequest): Promise<PasswordRecoveryInitResponse> {
        request.validate();
        const VALID_TIME_IN_DAYS = await this.configService.getConfig('maxPasswordRecoveryPeriod', 1);
        let uuid = getUUID();

        let passwordRecoveryRequest: PasswordRecoveryRequestDbObject = new PasswordRecoveryRequestDbObject();
        passwordRecoveryRequest.uuid = uuid;
        passwordRecoveryRequest.email = request.email.toLowerCase();
        passwordRecoveryRequest.expirationTime = moment().add(VALID_TIME_IN_DAYS, "days").toDate();

        const user = await this.userRepository.getUserByField('email', request.email.toLowerCase());
        if (!user) {
            throw new ValidationError(this.localisationProvider.translate(LocalisationKey.EmailDoesntExist, request.lang));
        }

        await this.passwordRecoveryRepository.create(passwordRecoveryRequest);
        let attributes = new ForgottenPasswordTemplate();
        attributes.firstname = user.firstname;
        attributes.lastname = user.lastname;
        attributes.uuid = uuid;
        attributes.appType = (user.usertype == UserType.LinkedAccount || user.usertype == UserType.MainAccount) ? 
            ApplicationType.WEB : (user.usertype == UserType.Organizer) ?
            ApplicationType.ORGANIZER : ApplicationType.ADMIN_PANEL;
        attributes.lang = request.lang;
        await this.emailSender.sendForgottenPasswordLink(request.email.toLowerCase(), attributes);

        let response = new PasswordRecoveryInitResponse();
        return response;
    }

    public async resetPassword(request: PasswordRecoveryRequest): Promise<PasswordRecoveryResponse> {
        request.validate();
        this.passwordRecoveryValidator.validatePasswordRecovery(request);

        var passwordRecoveryRequest = await this.passwordRecoveryRepository.getPasswordRecoveryRequestByUuid(request.uuid);
        this.passwordRecoveryValidator.validateUuid(passwordRecoveryRequest);

        var user = await this.userRepository.getUserByField("email", passwordRecoveryRequest.email);
        user.password = Hashing.hashPassword(request.password);

        await this.userRepository.updateObjectById(user._id, new UserDbObject(user));
        passwordRecoveryRequest.expirationTime = moment().toDate();
        this.passwordRecoveryRepository.updateObjectById(passwordRecoveryRequest._id, new PasswordRecoveryRequestDbObject(passwordRecoveryRequest));

        const logRequest = new UserActivityLogRequest();
        logRequest.userId = user._id;
        logRequest.activityType = UserActivityType.PasswordRecovered;
        
        await this.userActivityLogService.log(logRequest);

        let response = new PasswordRecoveryResponse();
        return response;
    }


}