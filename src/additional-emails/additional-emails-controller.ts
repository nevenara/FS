import { AddAdditionalEmailRequest } from "./models/add-additional-email-request";
import { AddAdditionalEmailResponse } from "./models/add-additional-email-response";
import { IUserContext } from "../common/user-context";
import { IUserAdditionalEmailsRepository } from "./user-additional-emails-repository";
import { UserAdditionalEmailsDbObject } from "./user-additional-emails-db-object";
import { getUUID } from "../db/uuid";
import { VerifyAdditionalEmailRequest } from "./models/verify-additional-email-request";
import { VerifyAdditionalEmailResponse } from "./models/verify-additional-email-response";
import { IUserAdditionalEmailsValue } from "./user-additional-emails-value";
import { ValidationError } from "../common/errors/validation-error";
import { LocalisationKey } from "../localisation/localisation-key";
import { UseAsStandardEmailRequest } from "./models/use-as-standard-email-request";
import { UseAsStandardEmailResponse } from "./models/use-as-standard-email-response";
import { DeleteAdditionalEmailRequest } from "./models/delete-additional-email-request";
import { DeleteAdditionalEmailResponse } from "./models/delete-additional-email-response";
import { IUserRepository } from "../user/user-repository";
import { IUserValue } from "../user/user-value";
import { UserDbObject } from "../user/user-db-object";
import { AdditionalEmailsValidator } from "./additional-emails-validator";
import { EmailSender, IEmailSender } from "../common/email-service/email-sender";
import { AdditionalEmailsRouter } from "./additional-emails-router";
import { Hashing } from "../common/hashing";
import { ITicketRepository } from "../tickets/ticket-repository";
import { TicketDbObject } from "../tickets/model/ticket-db-object";
import { TicketStatus } from "../tickets/model/ticket-status";
import { ITicketService } from "../tickets/ticket-service";
import { VerifyEmailTemplate } from "../common/email-service/models/verify-email-template";
import { IUserActivityLogService } from "../user-activity-log/user-activity-log-service";
import { UserActivityLogRequest } from "../user-activity-log/models/user-activity-log-request";
import { UserActivityType } from "../models/user-activity-type";
import { AddAdditionalEmailForUserRequest } from "./models/add-additional-email-for-user-request";
import { UserType } from "../models/user-type";
import { SetAsStandardEmailForUserRequest } from "./models/set-as-standard-email-for-user-request";
import { SetAsStandardEmailForUserHelperRequest } from "./models/set-as-standard-email-for-user-helper-request";
import { UpdateAdditionalEmailRequest } from "./models/update-additional-email-request";
import { UpdateAdditionalEmailResponse } from "./models/update-additional-email-response";
import { DeleteAdditionalEmailAdminPanelRequest } from "./models/delete-additional-email-admin-panel-request";
import { ILocalisationProvider } from "../localisation/localisation-provider";

export interface IAdditionalEmailsController {
    delete(request: DeleteAdditionalEmailAdminPanelRequest): Promise<DeleteAdditionalEmailResponse>;
    updateAdditionalEmail(request: UpdateAdditionalEmailRequest): Promise<UpdateAdditionalEmailResponse>;
    setAsStandardEmailAdminPanel(request: SetAsStandardEmailForUserRequest): Promise<UseAsStandardEmailResponse>;
    addAdditionalEmailAdminPanel(request: AddAdditionalEmailForUserRequest): Promise<AddAdditionalEmailResponse>;
    addAdditionalEmail(request: AddAdditionalEmailRequest): Promise<AddAdditionalEmailResponse>;
    verifyAdditionalEmail(request: VerifyAdditionalEmailRequest): Promise<VerifyAdditionalEmailResponse>;
    useAsStandardEmail(request: UseAsStandardEmailRequest): Promise<UseAsStandardEmailResponse>;
    deleteAdditionalEmail(request: DeleteAdditionalEmailRequest): Promise<DeleteAdditionalEmailResponse>;
}

export class AdditionalEmailsController implements IAdditionalEmailsController {

    constructor(
        private context: IUserContext, 
        private additionalEmailsRepository: IUserAdditionalEmailsRepository,
        private userRepository: IUserRepository,
        private ticketRepository: ITicketRepository,
        private additionalEmailsValidator: AdditionalEmailsValidator,
        private emailSender: IEmailSender,
        private ticketService: ITicketService,
        private userActivityLogService: IUserActivityLogService,
        private localisationProvider: ILocalisationProvider
    ) {}
    
    public async delete(request: DeleteAdditionalEmailAdminPanelRequest): Promise<DeleteAdditionalEmailResponse> {
        this.context.validateIfAuthenticated();
        this.context.validateAuthorization([UserType.Admin, UserType.SuperAdmin, UserType.EventManager, UserType.SupportLevel2]);

        request.validate(this.context.lang);
        const additionalEmail = await this.additionalEmailsRepository.getAdditionalEmailByUserIdAndEmail(request.userId, request.email.toLowerCase());

        if (!additionalEmail) {
            throw new ValidationError(this.localisationProvider.translate(LocalisationKey.EmailNotExisting));
        }

        await this.additionalEmailsRepository.deleteObjectById(additionalEmail._id);

        return new DeleteAdditionalEmailResponse();
    }
    
    public async updateAdditionalEmail(request: UpdateAdditionalEmailRequest): Promise<UpdateAdditionalEmailResponse> {
        this.context.validateIfAuthenticated();
        this.context.validateAuthorization([UserType.Admin, UserType.SuperAdmin, UserType.SupportLevel1, UserType.SupportLevel2, UserType.EventManager]);

        request.validate(this.context.lang);
        await this.additionalEmailsValidator.validateEmail(request.newEmail.toLowerCase(), true);

        const additionalEmail = await this.additionalEmailsRepository.getAdditionalEmailByUserIdAndEmail(request.userId, request.oldEmail.toLowerCase());
        additionalEmail.email = request.newEmail.toLowerCase();

        await this.additionalEmailsRepository.updateObjectById(additionalEmail._id, new UserAdditionalEmailsDbObject(additionalEmail));



        const response = new UpdateAdditionalEmailResponse();
        return response;
    }
    
    public async setAsStandardEmailAdminPanel(request: SetAsStandardEmailForUserRequest): Promise<UseAsStandardEmailResponse> {
        this.context.validateIfAuthenticated();
        this.context.validateAuthorization([UserType.Admin, UserType.SuperAdmin, UserType.EventManager, UserType.SupportLevel2]);

        request.validate(this.context.lang);

        const user: IUserValue = await this.userRepository.getUserById(request.userId);

        const requestHelper = new SetAsStandardEmailForUserHelperRequest();
        requestHelper.email = request.email.toLowerCase();
        requestHelper.user = user;

        await this.setAsStandardEmailHelper(requestHelper);
       
        return new UseAsStandardEmailResponse();
    }

    public async addAdditionalEmailAdminPanel(request: AddAdditionalEmailForUserRequest): Promise<AddAdditionalEmailResponse> {
        this.context.validateIfAuthenticated();
        this.context.validateAuthorization([UserType.Admin, UserType.SuperAdmin, UserType.EventManager, UserType.SupportLevel2]);

        request.validate(this.context.lang);

        const requestHelper: AddAdditionalEmailForUserRequest = new AddAdditionalEmailForUserRequest();
        requestHelper.email = request.email.toLowerCase();
        requestHelper.userId = request.userId;

        await this.addAdditionalEmailHelper(requestHelper);

        let response = new AddAdditionalEmailResponse();
        response.email = request.email.toLowerCase();
        return response;
    }

    public async addAdditionalEmail(request: AddAdditionalEmailRequest): Promise<AddAdditionalEmailResponse> {
        this.context.validateIfAuthenticated();

        request.validate(this.context.lang);

        const requestHelper: AddAdditionalEmailForUserRequest = new AddAdditionalEmailForUserRequest();
        requestHelper.email = request.email.toLowerCase();
        requestHelper.userId = this.context.userId;

        await this.addAdditionalEmailHelper(requestHelper);

        let response = new AddAdditionalEmailResponse();
        response.email = request.email.toLowerCase();
        return response;
    }

    public async verifyAdditionalEmail(request: VerifyAdditionalEmailRequest): Promise<VerifyAdditionalEmailResponse> {
        request.validate();

        const additionalEmail: IUserAdditionalEmailsValue =
            await this.additionalEmailsRepository.getAdditionalEmailByUuid(request.uuid);

        if (!additionalEmail) {
            throw new ValidationError(this.localisationProvider.translate(LocalisationKey.EmailVerificationLinkNotValid, request.lang));
        }

        //update status of user, email is now verified.
        additionalEmail.isVerified = true;
        //Guid will be removed. No need to verify email twice.
        additionalEmail.uuid = null;

        await this.additionalEmailsRepository.updateObjectById(additionalEmail._id, new UserAdditionalEmailsDbObject(additionalEmail));

         //Check if there are tickets already assigned to this email
        await this.ticketService.assignAlreadyStoredTickets(additionalEmail.email, additionalEmail.userId, true);
        
        //insert into logs
        const logRequest = new UserActivityLogRequest();
        logRequest.userId = additionalEmail.userId;
        logRequest.activityType = UserActivityType.AdditionalEmailVerified;
        await this.userActivityLogService.log(logRequest);

        
        const response = new VerifyAdditionalEmailResponse();

        return response;
    }

    public async useAsStandardEmail(request: UseAsStandardEmailRequest): Promise<UseAsStandardEmailResponse> {
        this.context.validateIfAuthenticated();
        request.validate(this.context.lang);

        const user: IUserValue = await this.userRepository.getUserById(this.context.userId);

        if (user.password !== Hashing.hashPassword(request.password)) {
            throw new ValidationError(this.localisationProvider.translate(LocalisationKey.WrongPassword));
        }

        const requestHelper = new SetAsStandardEmailForUserHelperRequest();
        requestHelper.email = request.email.toLowerCase();
        requestHelper.user = user;

        await this.setAsStandardEmailHelper(requestHelper);
       
        return new UseAsStandardEmailResponse();
    }

    public async deleteAdditionalEmail(request: DeleteAdditionalEmailRequest): Promise<DeleteAdditionalEmailResponse> {
        request.validate(this.context.lang);

        const additionalEmail: IUserAdditionalEmailsValue =
            await this.additionalEmailsRepository.getAdditionalEmailByUserIdAndEmail(this.context.userId, request.email.toLowerCase());

        if (!additionalEmail) {
            throw new ValidationError(this.localisationProvider.translate(LocalisationKey.EmailNotExisting));
        }

        const logRequest = new UserActivityLogRequest();
        logRequest.userId = additionalEmail.userId;
        logRequest.activityType = UserActivityType.AdditionalEmailDeleted;
        await this.userActivityLogService.log(logRequest);


        await this.additionalEmailsRepository.deleteObjectById(additionalEmail._id);

        return new DeleteAdditionalEmailResponse();
    }

    private async addAdditionalEmailHelper(request: AddAdditionalEmailForUserRequest) {
        await this.additionalEmailsValidator.validateAddAdditionalEmail(request, request.userId);

        const additionalEmail: UserAdditionalEmailsDbObject = new UserAdditionalEmailsDbObject();

        additionalEmail.userId = request.userId;
        additionalEmail.email = request.email;
        additionalEmail.isVerified = false;
        additionalEmail.uuid = getUUID();

        await this.additionalEmailsRepository.create(additionalEmail);
        let user = await this.userRepository.getUserById(additionalEmail.userId);

        //send verification email
        let attributes = new VerifyEmailTemplate();
        attributes.firstname = user.firstname;
        attributes.lastname = user.lastname;
        attributes.uuid = additionalEmail.uuid;
        attributes.route = '/profile/verifyEmail';
        attributes.additional = true;
        attributes.lang = this.context.userId == request.userId ? this.context.lang : 'de';
        await this.emailSender.sendVerificationEmail(additionalEmail.email, attributes);

    }

    private async setAsStandardEmailHelper(request: SetAsStandardEmailForUserHelperRequest) {
        const additionalEmail = await this.additionalEmailsRepository.getAdditionalEmailByUserIdAndEmail(request.user._id, request.email);

        if (!additionalEmail.isVerified) {
            throw new ValidationError(this.localisationProvider.translate(LocalisationKey.EmailNotVerified));
        }

        let tempEmail = request.user.email;
        request.user.email = additionalEmail.email;
        additionalEmail.email = tempEmail;

        await this.userRepository.updateObjectById(request.user._id, new UserDbObject(request.user));
        await this.additionalEmailsRepository.updateObjectById(additionalEmail._id, new UserAdditionalEmailsDbObject(additionalEmail));
    }
}