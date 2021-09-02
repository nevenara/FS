import { RegisterRequest } from "./models/register-request";
import { RegisterResponse } from "./models/register-response";
import { IUserRepository } from "../user/user-repository";
import { UserDbObject } from "../user/user-db-object";
import { UserType } from "../models/user-type";
import { IRegistrationValidator } from "./registration-validator";
import { getUUID } from "../db/uuid";
import { UserStatus } from "../models/user-status";
import { VerifyEmailRequest } from "./models/verify-email-request";
import { VerifyEmailResponse } from "./models/verfy-email-response";
import { ValidationError } from "../common/errors/validation-error";
import { LocalisationKey } from "../localisation/localisation-key";
import { IUserValue } from "../user/user-value";
import { CompleteRegistrationResponse } from "./models/complete-registration-response";
import { CompleteRegistrationRequest } from "./models/complete-registration-request";
import { IUserContext } from "../common/user-context";
import { IUserAdditionalEmailsRepository } from "../additional-emails/user-additional-emails-repository";
import { UserAdditionalEmailsDbObject } from "../additional-emails/user-additional-emails-db-object";
import { EmailSender, IEmailSender } from "../common/email-service/email-sender";
import { RegistrationRouter } from "./registration-router";
import { AdditionalEmailsRouter } from "../additional-emails/additional-emails-router";
import { Hashing } from "../common/hashing";
import { SessionModel } from "../http/session/session-model";
import { ISessionStore } from "../http/session/session-store";
import { ILocalisationProvider } from "../localisation/localisation-provider";
import { ITicketRepository } from "../tickets/ticket-repository";
import { TicketDbObject } from "../tickets/model/ticket-db-object";
import { VerifyIdRequest } from "./models/verify-id-request";
import { VerifyIdResponse } from "./models/verify-id-response";
import { TicketStatus } from "../tickets/model/ticket-status";
import { IRegistrationFlow } from "./registration-flow";
import { ITicketService } from "../tickets/ticket-service";
import { IAcceptServiceAgreementFlow } from "./accept-service-agreement-flow";
import { VerifyEmailTemplate } from "../common/email-service/models/verify-email-template";
import { UserActivityLogDbObject } from "../user-activity-log/user-activity-log-db-object";
import { IUserActivityLogRepository } from "../user-activity-log/user-activity-log-repository";
import { UserActivityType } from "../models/user-activity-type";
import { IUserActivityLogService } from "../user-activity-log/user-activity-log-service";
import { UserActivityLogRequest } from "../user-activity-log/models/user-activity-log-request";
import { Environment } from "../environment";
import { SessionLogDbObject } from "../session-log/session-log-db-object";
import { ISessionLogRepository } from "../session-log/session-log-repository";
import { IAuthenticationService } from "../basic-auth/authentication-service";
import { CheckUsernameRequest } from "./models/check-username-request";
import { CheckUsernameResponse } from "./models/check-username-response";
import { LinkedAccountUtil } from "../linked-accounts/linked-account-util";
import { IRedisClientWrapper } from "../common/caching/redis-client-wrapper";

export interface IRegistrationController {
    checkUsername(request: CheckUsernameRequest): Promise<CheckUsernameResponse>;
    acceptStripeTerms(ip: string);
    register(request: RegisterRequest): Promise<RegisterResponse>;
    verifyEmail(request: VerifyEmailRequest): Promise<VerifyEmailResponse>;
    completeRegistration(request: CompleteRegistrationRequest): Promise<CompleteRegistrationResponse>;
}

export class RegistrationController implements IRegistrationController {
    constructor(
        private context: IUserContext,
        private userRepository: IUserRepository,
        private additionalEmailsRepository: IUserAdditionalEmailsRepository,
        private ticketRepository: ITicketRepository,
        private userActivityLogService: IUserActivityLogService,
        private validator: IRegistrationValidator,
        private emailSender: IEmailSender,
        private sessionStore: ISessionStore,
        private localisationProvider: ILocalisationProvider,
        private registrationFlow: IRegistrationFlow,
        private ticketService: ITicketService,
        private acceptStripeTermsFlow: IAcceptServiceAgreementFlow,
        private authenticationService: IAuthenticationService,
        private redis: IRedisClientWrapper) { }
    
    public async checkUsername(request: CheckUsernameRequest): Promise<CheckUsernameResponse> {
        this.context.validateIfAuthenticated();
        request.validate();

        const users = await this.userRepository.getUserByField("username", request.username);
        const response = new CheckUsernameResponse();

        response.isUnique = !users ? true : false;
        
        return response;
    }


    public async acceptStripeTerms(ip: string) {
        this.context.validateIfAuthenticated();

        const user = await this.userRepository.getUserById(this.context.userId);

        await this.acceptStripeTermsFlow.acceptServiceAgreement(ip, user);
    }

    public async register(request: RegisterRequest): Promise<RegisterResponse> {

        //validate data
        //first level validation is on request object itself
        request.validate();

        //validator will cover second level of validation, more complex one.
        await this.validator.validateRegistration(request);

        //call repository        
        const user: UserDbObject = new UserDbObject();
        user.email = request.email.toLowerCase();
        user.password = Hashing.hashPassword(request.password1);
        user.userType = UserType.MainAccount;
        user.status = UserStatus.EmailNotVerified;
        user.emailVerificationGuid = getUUID();
        user.createdOn = new Date();

        await this.userRepository.create(user);

        let attributes = new VerifyEmailTemplate();
        attributes.firstname = null;
        attributes.lastname = null;
        attributes.uuid = user.emailVerificationGuid;
        attributes.route = RegistrationRouter.VERIFYEMAILURL;
        attributes.lang = this.context.lang;

        const verificationLink =
            await this.emailSender.sendVerificationEmail(user.email, attributes);

        //insert into activity logs
        const logRequest = new UserActivityLogRequest();
        logRequest.userId = user.id;
        logRequest.activityType = UserActivityType.Registered;
        await this.userActivityLogService.log(logRequest);

        const response = new RegisterResponse();

        if (!Environment.isProductionMode()) {
            response.emailVerificationGuid = verificationLink;
        }

        response.message = this.localisationProvider.translate(LocalisationKey.RegistrationSuccessfull)
        return response;
    }

    public async verifyEmail(request: VerifyEmailRequest): Promise<VerifyEmailResponse> {

        request.validate();

        const userDb: IUserValue =
            await this.userRepository.getUserByEmailVerificationGuid(request.emailVerificationGuid);
        // problem with lang
        if (!userDb) {
            throw new ValidationError(this.localisationProvider.translate(LocalisationKey.EmailVerificationLinkNotValid, request.lang));
        }
        console.log(request.lang)
        //update status of user, email is now verified.
        userDb.status = UserStatus.EmailVerified;
        //Guid will be removed. No need to verify email twice.
        userDb.emailVerificationGuid = null;

        await this.userRepository.updateObjectById(userDb._id, new UserDbObject(userDb));


        //Check if there are tickets already assigned to this email
        await this.ticketService.assignAlreadyStoredTickets(userDb.email, userDb._id, false);

        //insert into activity logs
        const logRequest = new UserActivityLogRequest();
        logRequest.userId = userDb._id;
        logRequest.activityType = UserActivityType.EmailVerified;
        await this.userActivityLogService.log(logRequest);

        const response = new VerifyEmailResponse();

        const authResponse = await this.authenticationService.authenticate(userDb, request.userAgent, request.lang);

        response.sessionId = authResponse.sessionId;

        return response;
    }

    public async completeRegistration(request: CompleteRegistrationRequest): Promise<CompleteRegistrationResponse> {

        this.context.validateIfAuthenticated();

        request.validate(this.context.lang);

        const user = await this.userRepository.getUserById(this.context.userId);

        if (!user) {
            throw new ValidationError(this.localisationProvider.translate(LocalisationKey.UserNotFound));
        }

        if (user.status == UserStatus.EmailNotVerified) {
            throw new ValidationError(this.localisationProvider.translate(LocalisationKey.EmailIsNotVerified));
        }

        if (user.status == UserStatus.RegistrationCompleted || user.status == UserStatus.IdVerified || user.status == UserStatus.Blocked) {
            throw new ValidationError(this.localisationProvider.translate(LocalisationKey.RegistrationIsAlreadyCompleted));
        }

        const olderThanSixteen = LinkedAccountUtil.olderThanSixteenOrSixteen(request.birthDate);

        if(!olderThanSixteen){
            throw new ValidationError(this.localisationProvider.translate(LocalisationKey.AgeNotAllowed));
        }

        //validator will cover second level of validation, more complex one.
        await this.validator.validateCompleteRegistration(request, user);

        user.username = request.username;
        user.gender = request.gender;
        user.firstname = request.firstname.trim();
        user.lastname = request.lastname.trim();
        user.birthDate = request.birthDate;
        user.address = request.address;
        user.postCode = request.postCode;
        user.city = request.city;
        user.country = request.country;
        user.phone = request.phone;

        const registrationStripeResponse =
            await this.registrationFlow.registerUserOnStripe(user);

        user.stripeAccountId = registrationStripeResponse.stripeAccountId;
        user.stripeAccountStatus = registrationStripeResponse.stripeAccountStatus;
        user.status = UserStatus.RegistrationCompleted;

        //call repository 

        await this.userRepository.updateObjectById(user._id, new UserDbObject(user));

        let otherEmails = request.otherEmails;

        if (otherEmails) {
            otherEmails.forEach(async (email) => await this.addAditionalEmail(user, email));
        }

        //insert into activity logs
        const logRequest = new UserActivityLogRequest();
        logRequest.userId = user._id;
        logRequest.activityType = UserActivityType.RegistrationCompleted;
        await this.userActivityLogService.log(logRequest);

        // TODO custom response
        const response = new CompleteRegistrationResponse();

        //update context
        
        const sessionId = this.context.sessionId;
        const sessionValue = await this.redis.get(sessionId);
        const sessionModel = JSON.parse(sessionValue) as SessionModel;

        sessionModel.country = user.country;

        await this.redis.set(sessionId, JSON.stringify(sessionModel));

        

        return response;
    }

    private async addAditionalEmail(user: IUserValue, email: string) {

        const additionalEmail: UserAdditionalEmailsDbObject = new UserAdditionalEmailsDbObject();

        additionalEmail.userId = user._id;
        additionalEmail.email = email;
        additionalEmail.isVerified = false;
        additionalEmail.uuid = getUUID();

        await this.additionalEmailsRepository.create(additionalEmail);

        let attributes = new VerifyEmailTemplate();
        attributes.firstname = user.firstname;
        attributes.lastname = user.lastname;
        attributes.uuid = additionalEmail.uuid;
        attributes.route = AdditionalEmailsRouter.VERIFY_ADDITIONAL_EMAIL_URL;
        attributes.lang = this.context.lang;
        await this.emailSender.sendVerificationEmail(email, attributes);
    }
}