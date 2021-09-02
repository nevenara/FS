import { LinkedAccountsValidator } from "./linked-accounts-validator";
import { IUserContext } from "../common/user-context";
import { IUserRepository } from "../user/user-repository";
import { ConnectNewAccountRequest } from "./models/connect-new-account-request";
import { ConnectNewAccountResponse } from "./models/connect-new-account-response";
import { UserDbObject } from "../user/user-db-object";
import { UserStatus } from "../models/user-status";
import { UserType } from "../models/user-type";
import { IdCheckLinkedAccountResponse } from "./models/id-check-linked-account";
import { IUserValue } from "../user/user-value";
import { ValidationError } from "../common/errors/validation-error";
import { LocalisationKey } from "../localisation/localisation-key";
import { IdCheckLinkedAccountRequest } from "./models/id-check-linked-account-request";
import { GetLinkedAccountsResponse, LinkedAccountElement } from "./models/get-linked-accounts-response";
import { IProfileImageRepository } from "../profile-image/profile-image-repository";
import { IProfileImageValue } from "../profile-image/profile-image-value";
import { GetLinkedAccountDetailsRequest } from "./models/get-linked-account-details-request";
import { GetLinkedAccountDetailsResponse } from "./models/get-linked-account-details-response";
import { EditLinkedAccountRequest } from "./models/edit-linked-account-request";
import { EditLinkedAccountResponse } from "./models/edit-linked-account-response";
import { SetLinkedAccountPasswordRequest } from "./models/set-linked-account-password-request";
import { SetLinkedAccountPasswordResponse } from "./models/set-linked-account-password-response";
import { Hashing } from "../common/hashing";
import { UploadProfileImageLinkedAccountRequest } from "./models/upload-profile-image-linked-account-request";
import { UploadProfileImageLinkedAccountResponse } from "./models/upload-profile-image-linked-account-response";
import { ProfileImageDbObject } from "../profile-image/profile-image-db-object";
import { ITicketService } from "../tickets/ticket-service";
import { IUserActivityLogService } from "../user-activity-log/user-activity-log-service";
import { UserActivityLogRequest } from "../user-activity-log/models/user-activity-log-request";
import { UserActivityType } from "../models/user-activity-type";
import { link } from "fs";
import { IRegistrationFlow } from "../registration/registration-flow";
import { LinkedAccountUtil } from "./linked-account-util";
import { StartIdVerificationFlowResponse } from "../registration/models/start-id-verification-flow-response";
import { IdVerificationFlow } from "../registration/id-verification-flow";
import { ILocalisationProvider } from "../localisation/localisation-provider";

const moment = require('moment');

export interface ILinkedAccountsController {
    uploadProfileImage(request: UploadProfileImageLinkedAccountRequest): UploadProfileImageLinkedAccountResponse | PromiseLike<UploadProfileImageLinkedAccountResponse>;
    connectNewAccount(request: ConnectNewAccountRequest): Promise<ConnectNewAccountResponse>;
    idVerifyLinkedAccount(request: IdCheckLinkedAccountRequest): Promise<IdCheckLinkedAccountResponse>;
    getLinkedAccounts(): Promise<GetLinkedAccountsResponse>;
    getLinkedAccountDetails(request: GetLinkedAccountDetailsRequest): Promise<GetLinkedAccountDetailsResponse>;
    editLinkedAccount(request: EditLinkedAccountRequest): Promise<EditLinkedAccountResponse>;
    setLinkedAccountPassword(request: SetLinkedAccountPasswordRequest): Promise<SetLinkedAccountPasswordResponse>;
}

export class LinkedAccountsController implements ILinkedAccountsController {
    constructor(
        private context: IUserContext,
        private userRepository: IUserRepository,
        private profileImageRepository: IProfileImageRepository,
        private linkedAccountsValidator: LinkedAccountsValidator,
        private ticketService: ITicketService,
        private userActivityLogService: IUserActivityLogService,
        private registrationFlow: IRegistrationFlow,
        private idVerificationFlow: IdVerificationFlow,
        private localisationProvider: ILocalisationProvider
    ) { }

    public async uploadProfileImage(request: UploadProfileImageLinkedAccountRequest): Promise<UploadProfileImageLinkedAccountResponse> {
        this.context.validateIfAuthenticated();

        request.validate(this.context.lang);

        //check size and format
        this.linkedAccountsValidator.validateUploadProfileImage(request);

        let profileImage: IProfileImageValue = await this.profileImageRepository.getProfileImageByUserId(request.linkedAccountId);

        if (profileImage) {
            profileImage.image = request.profileImage['buffer'];
            profileImage.originalname = request.profileImage['originalname'];
            profileImage.mimetype = request.profileImage['mimetype'];
            profileImage.size = request.profileImage['size'];

            await this.profileImageRepository.updateObjectById(profileImage._id, new ProfileImageDbObject(profileImage));
        }
        else {
            const newProfileImage = new ProfileImageDbObject();

            newProfileImage.userId = request.linkedAccountId;
            newProfileImage.image = request.profileImage['buffer'];
            newProfileImage.originalname = request.profileImage['originalname'];
            newProfileImage.mimetype = request.profileImage['mimetype'];
            newProfileImage.size = request.profileImage['size'];

            await this.profileImageRepository.create(newProfileImage);
        }

        const logRequest = new UserActivityLogRequest();
        logRequest.userId = this.context.userId;
        logRequest.activityType = UserActivityType.LinkedAccountProfileEdited;
        logRequest.details = request.linkedAccountId;

        await this.userActivityLogService.log(logRequest);

        const response = new UploadProfileImageLinkedAccountResponse();
        response.image = request.profileImage['buffer'].toString('base64');
        response.mimetype = request.profileImage['mimetype'];
        response.originalname = request.profileImage['originalname'];
        response.size = request.profileImage['size'];

        return response;
    }

    public async connectNewAccount(request: ConnectNewAccountRequest): Promise<ConnectNewAccountResponse> {
        this.context.validateIfAuthenticated();

        request.validate(this.context.lang);

        await this.linkedAccountsValidator.validateConnectNewAccount(request, this.context.userId);

        const user: UserDbObject = new UserDbObject();

        const olderThenSixteen =
            LinkedAccountUtil.olderThanSixteen(request.birthDate);

        user.username = request.username;
        user.firstname = request.firstname.trim();
        user.lastname = request.lastname.trim();
        user.address = request.address;
        user.city = request.city;
        user.country = request.country;
        user.gender = request.gender;
        user.birthDate = request.birthDate;
        user.postCode = request.postCode;
        user.relationToMainAccount = request.relationToMainAccount;
        user.status = olderThenSixteen ? UserStatus.RegistrationCompleted : UserStatus.IdVerified;
        user.userType = UserType.LinkedAccount;
        user.mainAccountId = this.context.userId;

        if (olderThenSixteen) {
            const registrationStripeResponse =
                await this.registrationFlow.registerUserOnStripe(user);

            user.stripeAccountId = registrationStripeResponse.stripeAccountId;
            user.stripeAccountStatus = registrationStripeResponse.stripeAccountStatus;
        }

        const createResponse = await this.userRepository.create(user);

        if (request.profileImage) {
            const newProfileImage = new ProfileImageDbObject();

            newProfileImage.userId = createResponse['_id'];
            newProfileImage.image = request.profileImage['buffer'];
            newProfileImage.originalname = request.profileImage['originalname'];
            newProfileImage.mimetype = request.profileImage['mimetype'];
            newProfileImage.size = request.profileImage['size'];

            await this.profileImageRepository.create(newProfileImage);
        }

        const logRequest = new UserActivityLogRequest();
        logRequest.userId = this.context.userId;
        logRequest.activityType = UserActivityType.LinkedAccountCreated;
        logRequest.details = user.id;

        await this.userActivityLogService.log(logRequest);


        const response: ConnectNewAccountResponse = new ConnectNewAccountResponse();
        response.id = createResponse['_id'];
        response.idVerificationNeeded = olderThenSixteen;

        return response;
    }

    public async idVerifyLinkedAccount(request: IdCheckLinkedAccountRequest): Promise<IdCheckLinkedAccountResponse> {
        this.context.validateIfAuthenticated();

        const user: IUserValue = await this.userRepository.getUserById(request.linkedAccountId);

        if (!user) {
            throw new ValidationError(this.localisationProvider.translate(LocalisationKey.InvalidUser));
        }

        if (!user.mainAccountId || user.mainAccountId != this.context.userId) {
            throw new ValidationError(this.localisationProvider.translate(LocalisationKey.NotLinkedAccountUser));
        }

        const startIdVerificationFlowResponse: StartIdVerificationFlowResponse =
            await this.idVerificationFlow.startIdVerificationFlow(user, request.idDocumentFile, request.selfieImage);

        return new IdCheckLinkedAccountResponse();
    }

    public async getLinkedAccounts(): Promise<GetLinkedAccountsResponse> {
        this.context.validateIfAuthenticated();

        const linkedAccounts = await this.userRepository.getLinkedAccounts(this.context.userId);

        const response: GetLinkedAccountsResponse = new GetLinkedAccountsResponse();

        for (let index = 0; index < linkedAccounts.length; index++) {
            let linkedAccount = new LinkedAccountElement();

            linkedAccount.id = linkedAccounts[index]._id;
            linkedAccount.firstname = linkedAccounts[index].firstname;
            linkedAccount.lastname = linkedAccounts[index].lastname;
            linkedAccount.username = linkedAccounts[index].username;

            response.linkedAccounts.push(linkedAccount);
        }

        return response;
    }

    public async getLinkedAccountDetails(request: GetLinkedAccountDetailsRequest): Promise<GetLinkedAccountDetailsResponse> {
        this.context.validateIfAuthenticated();

        request.validate(this.context.lang);

        const linkedAccount = await this.userRepository.getUserById(request.linkedAccountId);

        if (!linkedAccount) {
            throw new ValidationError(this.localisationProvider.translate(LocalisationKey.LinkedAccountDoesntExist));
        }

        let response: GetLinkedAccountDetailsResponse = new GetLinkedAccountDetailsResponse();

        response.id = linkedAccount._id;
        response.address = linkedAccount.address;
        response.birthDate = linkedAccount.birthDate;
        response.city = linkedAccount.city;
        response.country = linkedAccount.country;
        response.firstname = linkedAccount.firstname;
        response.gender = linkedAccount.gender;
        response.lastname = linkedAccount.lastname;
        response.postCode = linkedAccount.postCode;
        response.relationToMainAccount = linkedAccount.relationToMainAccount;
        response.username = linkedAccount.username;

        let profileImage: IProfileImageValue = await this.profileImageRepository.getProfileImageByUserId(linkedAccount._id);

        if (!profileImage) {
            profileImage = await this.profileImageRepository.getDefaultProfileImage();
        }

        response.profileImage = profileImage ? Buffer.from(profileImage.image).toString("base64") : null;
        response.mimetype = profileImage ? profileImage.mimetype : null;
        response.originalname = profileImage ? profileImage.originalname : null;

        return response;
    }

    public async editLinkedAccount(request: EditLinkedAccountRequest): Promise<EditLinkedAccountResponse> {
        this.context.validateIfAuthenticated();

        this.linkedAccountsValidator.validateUpdateLinkedAccount(request);

        const linkedAccount: IUserValue = await this.userRepository.getUserById(request.linkedAccountId);

        linkedAccount.address = request.address || linkedAccount.address;
        linkedAccount.city = request.city || linkedAccount.city;
        linkedAccount.country = request.country || linkedAccount.country;
        linkedAccount.postCode = request.postCode || linkedAccount.postCode;

        await this.userRepository.updateObjectById(linkedAccount._id, new UserDbObject(linkedAccount));

        const logRequest = new UserActivityLogRequest();
        logRequest.userId = this.context.userId;
        logRequest.activityType = UserActivityType.LinkedAccountProfileEdited;
        logRequest.details = linkedAccount._id;

        await this.userActivityLogService.log(logRequest);

        return new EditLinkedAccountResponse();
    }

    public async setLinkedAccountPassword(request: SetLinkedAccountPasswordRequest): Promise<SetLinkedAccountPasswordResponse> {
        this.context.validateIfAuthenticated();

        request.validate(this.context.lang);

        const linkedAccount: IUserValue = await this.userRepository.getUserById(request.linkedAccountId);

        this.linkedAccountsValidator.validateSetPassword(request);

        linkedAccount.password = Hashing.hashPassword(request.password);

        await this.userRepository.updateObjectById(linkedAccount._id, new UserDbObject(linkedAccount));

        const logRequest = new UserActivityLogRequest();
        logRequest.userId = this.context.userId;
        logRequest.activityType = UserActivityType.LinkedAccountProfileEdited;
        logRequest.details = linkedAccount._id;

        await this.userActivityLogService.log(logRequest);
        return new SetLinkedAccountPasswordResponse();
    }
}