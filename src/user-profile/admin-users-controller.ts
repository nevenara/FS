import Stripe from "stripe";
import { IUserAdditionalEmailsRepository } from "../additional-emails/user-additional-emails-repository";
import { IEmailSender } from "../common/email-service/email-sender";
import { VerifyEmailTemplate } from "../common/email-service/models/verify-email-template";
import { Guard } from "../common/errors/guard";
import { ValidationError } from "../common/errors/validation-error";
import { IUserContext } from "../common/user-context";
import { getUUID } from "../db/uuid";
import { LinkedAccountUtil } from "../linked-accounts/linked-account-util";
import { LinkedAccountsValidator } from "../linked-accounts/linked-accounts-validator";
import { ConnectNewAccountRequest } from "../linked-accounts/models/connect-new-account-request";
import { LocalisationKey } from "../localisation/localisation-key";
import { ILocalisationProvider } from "../localisation/localisation-provider";
import { UserActivityType } from "../models/user-activity-type";
import { UserStatus } from "../models/user-status";
import { UserType } from "../models/user-type";
import { ProfileImageDbObject } from "../profile-image/profile-image-db-object";
import { IProfileImageRepository } from "../profile-image/profile-image-repository";
import { IRegistrationFlow } from "../registration/registration-flow";
import { RegistrationRouter } from "../registration/registration-router";
import { IStripeFactory } from "../stripe/stripe-factory";
import { SearchTicketRepoRequest } from "../tickets/model/search-ticket-repo-request";
import { ITicketValue } from "../tickets/model/ticket";
import { TicketDbObject } from "../tickets/model/ticket-db-object";
import { TicketStatus } from "../tickets/model/ticket-status";
import { ITicketRepository } from "../tickets/ticket-repository";
import { ReasonForInactivity } from "../user-activity-log/models/reason-for-inactivity";
import { UserActivityLogRequest } from "../user-activity-log/models/user-activity-log-request";
import { IUserActivityLogRepository } from "../user-activity-log/user-activity-log-repository";
import { IUserActivityLogService } from "../user-activity-log/user-activity-log-service";
import { IUserActivityLogValue } from "../user-activity-log/user-activity-log-value";
import { UserDbObject } from "../user/user-db-object";
import { IUserRepository } from "../user/user-repository";
import { IUserValue } from "../user/user-value";
import { AddUserAdminPanelRequest } from "./models/add-user-admin-panel-request";
import { AddUserAdminPanelResponse } from "./models/add-user-admin-panel-response";
import { DeactivateUserAdminPanelRequest } from "./models/deactivate-user-admin-panel-request";
import { DeactivateUserAdminPanelResponse } from "./models/deactivate-user-admin-panel-response";
import { DeleteUserRequest } from "./models/delete-user-request";
import { DeleteUserResponse } from "./models/delete-user-response";
import { GetAccountDetailsAdminPanelRequest } from "./models/get-account-details-admin-panel-request";
import { GetAccountDetailsAdminPanelResponse } from "./models/get-account-details-admin-panel-response";
import { GetLinkedAccountsAdminPanelRequest } from "./models/get-linked-accounts-admin-panel-request";
import { GetLinkedAccountAdminPanelResponse, GetLinkedAccountsAdminPanelResponse } from "./models/get-linked-accounts-admin-panel-response";
import { GetReasonsForDeactivationResponse } from "./models/get-reasons-for-deactivation-response";
import { GetStripeAccountBalanceRequest, GetStripeAccountBalanceResponse } from "./models/get-stripe-account-balance-request";
import { UpdateUserAdminPanelRequest } from "./models/update-user-admin-panel-request";
import { UpdateUserAdminPanelResponse } from "./models/update-user-admin-panel-response";
import { UserProfileRouter } from "./user-profile-router";
import { IUserProfileValidator } from "./user-profile-validator";

const moment = require('moment');

export interface IAdminUsersController {
    activateUser(userId: string);
    getStripeAccountBalance(request: GetStripeAccountBalanceRequest): Promise<GetStripeAccountBalanceResponse>;
    addUser(request: AddUserAdminPanelRequest): Promise<AddUserAdminPanelResponse>;
    getLinkedAccounts(request: GetLinkedAccountsAdminPanelRequest): Promise<GetLinkedAccountsAdminPanelResponse>;
    getAccountDetails(request: GetAccountDetailsAdminPanelRequest): Promise<GetAccountDetailsAdminPanelResponse>;
    deactivateUser(request: DeactivateUserAdminPanelRequest): Promise<DeactivateUserAdminPanelResponse>;
    deleteUser(request: DeleteUserRequest): Promise<DeleteUserResponse>;
    updateUser(request: UpdateUserAdminPanelRequest): Promise<UpdateUserAdminPanelResponse>;
}

export class AdminUsersController implements IAdminUsersController {
    constructor(
        private context: IUserContext,
        private userRepository: IUserRepository,
        private userActivityLogRepository: IUserActivityLogRepository,
        private additionalEmailsRepository: IUserAdditionalEmailsRepository,
        private profileImageRepository: IProfileImageRepository,
        private userActivityLogService: IUserActivityLogService,
        private userProfileValidator: IUserProfileValidator,
        private emailSender: IEmailSender,
        private stripeFactory: IStripeFactory,
        private registrationFlow: IRegistrationFlow,
        private linkedAccounsValidator: LinkedAccountsValidator,
        private ticketRepository: ITicketRepository,
        private localisationProvider: ILocalisationProvider
    ) {
    }

    public async getStripeAccountBalance(request: GetStripeAccountBalanceRequest): Promise<GetStripeAccountBalanceResponse> {
        this.context.validateIfAuthenticated();
        this.context.validateAuthorization([UserType.Admin, UserType.SuperAdmin, UserType.SupportLevel1, UserType.SupportLevel2, UserType.MainAccount, UserType.EventManager]);
        request.validate(this.context.lang);

        const response = new GetStripeAccountBalanceResponse();

        const user = await this.userRepository.getUserById(request.userId);

        Guard.isTruthy(user, `No user found for ${request.userId}`);

        if (!user.stripeAccountId) {
            throw new ValidationError(this.localisationProvider.translate(LocalisationKey.UserDoesNotHaveStripeAccountId));
        }

        const stripe: Stripe = this.stripeFactory.createStripe();

        const balanceResponse = await stripe.balance.retrieve({

        }, {
            stripeAccount: user.stripeAccountId,
        })

        response.available = balanceResponse.available



        if(this.context.userType != UserType.MainAccount) {
            const payoutList: Stripe.Response<Stripe.ApiList<Stripe.Payout>> =
            await stripe.payouts.list({}, { stripeAccount: user.stripeAccountId })

            response.payoutList = payoutList;
        }
       
        return response;
    }

    public async addUser(request: AddUserAdminPanelRequest): Promise<AddUserAdminPanelResponse> {
        this.context.validateIfAuthenticated();
        this.context.validateAuthorization([UserType.Admin, UserType.SuperAdmin, UserType.EventManager, UserType.SupportLevel2]);

        request.validate(this.context.lang);
        request.standardEmail = request.standardEmail ? request.standardEmail.toLowerCase() : null;
        await this.userProfileValidator.validateAddUserAdminPanel(request);

        const user: UserDbObject = new UserDbObject();
        user.username = request.username;
        user.firstname = request.firstname.trim();
        user.lastname = request.lastname.trim();
        user.gender = request.gender;
        user.address = request.address;
        user.birthDate = new Date(request.birthDate);
        user.postCode = request.postCode;
        user.phone = request.phone;
        user.city = request.city
        user.country = request.country;
        user.userType = request.isMainAccount ? UserType.MainAccount : UserType.LinkedAccount;
       	
        const olderThanSixteen = LinkedAccountUtil.olderThanSixteen(request.birthDate);	
        const olderThanSixteenOrSixteen = LinkedAccountUtil.olderThanSixteenOrSixteen(request.birthDate);
        if (request.isMainAccount && !olderThanSixteenOrSixteen){	
            throw new ValidationError(this.localisationProvider.translate(LocalisationKey.AgeNotAllowed));	
        }

        if (request.isMainAccount || (!request.isMainAccount && olderThanSixteen)){	
            const registrationStripeResponse =	
            await this.registrationFlow.registerUserOnStripe(user as IUserValue);	
    	
            user.stripeAccountId = registrationStripeResponse.stripeAccountId;	
            user.stripeAccountStatus = registrationStripeResponse.stripeAccountStatus;	
        }

        const logRequest = new UserActivityLogRequest();

        if (request.isMainAccount) {
            user.emailVerificationGuid = getUUID();
            user.email = request.standardEmail;

            user.status = UserStatus.EmailNotVerified;

            let attributes = new VerifyEmailTemplate();
            attributes.firstname = null;
            attributes.lastname = null;
            attributes.uuid = user.emailVerificationGuid;
            attributes.route = UserProfileRouter.VERIFY_EMAIL_USER_ADMIN_PANEL;
            
            await this.emailSender.sendVerificationEmail(user.email, attributes);


        }
        else {
            const mainAccount = await this.userRepository.getUserByUserNameOrEmail(request.linkedToMainAccount);
            if (!mainAccount) {
                throw new ValidationError(this.localisationProvider.translate(LocalisationKey.UserDoesNotExist));
            }

            const linkedAccountRequest = new ConnectNewAccountRequest();
            linkedAccountRequest.address = request.address;
            linkedAccountRequest.birthDate = request.birthDate;
            linkedAccountRequest.city = request.city;
            linkedAccountRequest.country = request.country;
            linkedAccountRequest.firstname = request.firstname;
            linkedAccountRequest.lastname = request.lastname;
            linkedAccountRequest.gender = request.gender;
            linkedAccountRequest.postCode = request.postCode;
            linkedAccountRequest.profileImage = request.profileImage;
            linkedAccountRequest.username = request.username;
            

            await this.linkedAccounsValidator.validateConnectNewAccount(linkedAccountRequest, mainAccount._id)

            user.mainAccountId = mainAccount._id;
            user.status = this.olderThanSixteen(user.birthDate) ? UserStatus.RegistrationCompleted : UserStatus.IdVerified;

        }
        const createResponse = await this.userRepository.create(user);


        //image
        if (request.profileImage) {
            const newProfileImage = new ProfileImageDbObject();

            newProfileImage.userId = createResponse['_id'];
            newProfileImage.image = request.profileImage['buffer'];
            newProfileImage.originalname = request.profileImage['originalname'];
            newProfileImage.mimetype = request.profileImage['mimetype'];
            newProfileImage.size = request.profileImage['size'];

            await this.profileImageRepository.create(newProfileImage);
        }

        //insert into activity logs
        if (request.isMainAccount) {
            logRequest.userId = user.id;
            logRequest.activityType = UserActivityType.Registered;
        }
        else {
            logRequest.userId = user.mainAccountId;
            logRequest.activityType = UserActivityType.LinkedAccountCreated;
            logRequest.details = user.id;
        }
        logRequest.performedBy = this.context.userId;
        await this.userActivityLogService.log(logRequest);

        const response: AddUserAdminPanelResponse = new AddUserAdminPanelResponse();
        return response;
    }

    public async getLinkedAccounts(request: GetLinkedAccountsAdminPanelRequest): Promise<GetLinkedAccountsAdminPanelResponse> {
        this.context.validateIfAuthenticated();
        this.context.validateAuthorization([UserType.Admin, UserType.SuperAdmin, UserType.SupportLevel1, UserType.SupportLevel2, UserType.EventManager]);

        request.validate(this.context.lang);
        const response: GetLinkedAccountsAdminPanelResponse = new GetLinkedAccountsAdminPanelResponse();
        response.linkedAccounts = [];
        const linkedAccounts = await this.userRepository.getLinkedAccounts(request.userId);

        for (let i = 0; i < linkedAccounts.length; i++) {
            const linkedAccount = linkedAccounts[i];

            const res: GetLinkedAccountAdminPanelResponse = new GetLinkedAccountAdminPanelResponse();
            res.userId = linkedAccount._id;
            res.firstname = linkedAccount.firstname;
            res.lastname = linkedAccount.lastname;
            res.username = linkedAccount.username;

            response.linkedAccounts.push(res);
        }

        return response;
    }

    public async getAccountDetails(request: GetAccountDetailsAdminPanelRequest): Promise<GetAccountDetailsAdminPanelResponse> {
        this.context.validateIfAuthenticated();
        this.context.validateAuthorization([UserType.Admin, UserType.SuperAdmin, UserType.SupportLevel1, UserType.SupportLevel2, UserType.EventManager]);

        request.validate(this.context.lang);
        const user = await this.userRepository.getUserById(request.userId);
        const response: GetAccountDetailsAdminPanelResponse = new GetAccountDetailsAdminPanelResponse();

        response.username = user.username;
        response.standardEmail = user.email;
        response.additionalEmails = [];
        const additionalEmailsObjects = await this.additionalEmailsRepository.getAdditionalEmailsByUserId(user._id);
        if (additionalEmailsObjects)
            response.additionalEmails = additionalEmailsObjects.map(emailDb => { return { email: emailDb.email, isVerified: emailDb.isVerified } });

        return response;
    }

    public async activateUser(userId: string) {
        this.context.validateIfAuthenticated();
        this.context.validateAuthorization([UserType.Admin, UserType.SuperAdmin, UserType.EventManager, UserType.SupportLevel2]);


        const logs: IUserActivityLogValue[] = 
             await this.userActivityLogRepository.getUserActivity(userId);

        let previousStatus: UserStatus; 
        
        if(logs.find(n => n.activityType === UserActivityType.IdVerified)){
            previousStatus = UserStatus.IdVerified;
        }else if(logs.find(n => n.activityType === UserActivityType.RegistrationCompleted
            || n.activityType === UserActivityType.Registered)){
            previousStatus = UserStatus.RegistrationCompleted;
        }else if(logs.find(n => n.activityType === UserActivityType.EmailVerified)){
            previousStatus = UserStatus.EmailVerified;
        }else if(logs.find(n => n.activityType === UserActivityType.Registered)){
            previousStatus = UserStatus.EmailNotVerified;
        }

        const user = await this.userRepository.getUserById(userId);
        user.status = previousStatus;

        await this.userRepository.updateObjectById(user._id, new UserDbObject(user));

        //logs
        const logRequest = new UserActivityLogRequest();
        logRequest.userId = this.context.userId;
        logRequest.activityType = UserActivityType.UnBlocked;
        logRequest.performedBy = this.context.userId;
        await this.userActivityLogService.log(logRequest);

    }


    public async deactivateUser(request: DeactivateUserAdminPanelRequest): Promise<DeactivateUserAdminPanelResponse> {
        this.context.validateIfAuthenticated();
        this.context.validateAuthorization([UserType.Admin, UserType.SuperAdmin, UserType.EventManager, UserType.SupportLevel2]);

        request.validate(this.context.lang);

        const user = await this.userRepository.getUserById(request.userId);
        if(!user){
            throw new ValidationError(this.localisationProvider.translate(LocalisationKey.UserNotFound));
        }
        user.status = UserStatus.Blocked;

        await this.userRepository.updateObjectById(user._id, new UserDbObject(user));

        //logs
        const logRequest = new UserActivityLogRequest();
        logRequest.userId = request.userId;
        logRequest.activityType = UserActivityType.Blocked;
        logRequest.performedBy = this.context.userId;
        logRequest.details = request.reasonForDeactivation;
        await this.userActivityLogService.log(logRequest);

        const response: DeactivateUserAdminPanelResponse = new DeactivateUserAdminPanelResponse();
        return response;
    }

    public async deleteUser(request: DeleteUserRequest): Promise<DeleteUserResponse> {
        this.context.validateIfAuthenticated();
        this.context.validateAuthorization([UserType.Admin, UserType.SuperAdmin]);

        request.validate(this.context.lang);

        const user = await this.userRepository.getUserById(request.userId);

        //check if it is linked account and if linked account has been deleted for his main account in the last year
        const linkedAccountFlag = user.usertype == UserType.LinkedAccount;

        if (linkedAccountFlag) {
            const mainAccount = await this.userRepository.getUserById(user.mainAccountId);
            const lastDeletedAccountDate = moment(await this.userActivityLogRepository.getLastChangeLinkedAccounts(mainAccount._id));

            if (lastDeletedAccountDate && moment().diff(lastDeletedAccountDate, 'days') < 365) {
                throw new ValidationError(this.localisationProvider.translate(LocalisationKey.DeletingLinkedAccountNotAllowed));
            }

            const logRequest = new UserActivityLogRequest();
            logRequest.performedBy = this.context.userId;
            logRequest.activityType = UserActivityType.LinkedAccountDeleted;
            logRequest.details = user._id;
            logRequest.userId = mainAccount._id;


            await this.userActivityLogService.log(logRequest);

            user.mainAccountId = null;
        }

        if (!linkedAccountFlag) {
            //logs
            const logRequest = new UserActivityLogRequest();
            logRequest.userId = user._id;
            logRequest.activityType = UserActivityType.Deleted;
            logRequest.performedBy = this.context.userId;
            await this.userActivityLogService.log(logRequest);

            //if it is main account, get his linked accounts, deactivate them with reason MainAccountDeleted 
            const linkedAccounts = await this.userRepository.getLinkedAccounts(user._id);
            for (let i = 0; i < linkedAccounts.length; i++) {
                const linkedAccount = linkedAccounts[i];
                linkedAccount.status = UserStatus.Blocked;

                await this.userRepository.updateObjectById(linkedAccount._id, new UserDbObject(linkedAccount));

                //logs
                const logRequest = new UserActivityLogRequest();
                logRequest.userId = linkedAccount._id;
                logRequest.activityType = UserActivityType.Blocked;
                logRequest.performedBy = this.context.userId;
                logRequest.details = ReasonForInactivity.MainAccountDeleted;
                await this.userActivityLogService.log(logRequest);
            }
        }

        user.status = UserStatus.Deleted;
        user.email = 'Deleted User';
        user.username = 'Deleted User';
        user.firstname = 'Deleted User';
        user.lastname = 'Deleted User';
        user.postCode = 'Deleted User';
        user.city = 'Deleted User';

        await this.userRepository.updateObjectById(user._id, new UserDbObject(user));

        const repoRequest = new SearchTicketRepoRequest();
        repoRequest.userId = user._id;
        const repoResponse = await this.ticketRepository.search(repoRequest);

        for (let i = 0; i < repoResponse.tickets.length; i++) {
            const ticket = repoResponse.tickets[i] as ITicketValue;
            ticket.status = TicketStatus.NotAvailable;

            await this.ticketRepository.updateObjectById(ticket._id, new TicketDbObject(ticket));
        }

        const response: DeactivateUserAdminPanelResponse = new DeactivateUserAdminPanelResponse();
        return response;
    }

    public async updateUser(request: UpdateUserAdminPanelRequest): Promise<UpdateUserAdminPanelResponse> {
        this.context.validateIfAuthenticated();
        this.context.validateAuthorization([UserType.Admin, UserType.SuperAdmin, UserType.SupportLevel1, UserType.SupportLevel2, UserType.EventManager]);

        request.validate(this.context.lang);

        const user: IUserValue = await this.userRepository.getUserById(request.userId);
        user.gender = request.gender;
        user.firstname = request.firstname.trim();
        user.lastname = request.lastname.trim();

        user.address = request.address;
        user.birthDate = request.birthDate;
        user.postCode = request.postCode;

        user.city = request.city;
        user.country = request.country;
        user.phone = request.phone;

        await this.userRepository.updateObjectById(user._id, new UserDbObject(user));

        //logs
        const logRequest = new UserActivityLogRequest();
        logRequest.userId = this.context.userId;
        logRequest.activityType = UserActivityType.ProfileEdited;
        logRequest.performedBy = this.context.userId;
        await this.userActivityLogService.log(logRequest);


        const response: UpdateUserAdminPanelResponse = new UpdateUserAdminPanelResponse();
        return response;
    }

    private olderThanSixteen(birthDate: Date): boolean {
        const diff = moment().diff(birthDate, 'years');

        if (diff > 16) return true;
        return false;
    }
}