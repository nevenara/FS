import { IUserProfileValidator } from "./user-profile-validator";
import { IUserRepository } from "../user/user-repository";
import { IUserContext } from "../common/user-context";
import { GetUserProfileResponse, UserProfileImageResponse } from "./models/get-user-profile-response";
import { UpdateUserProfileRequest } from "./models/update-user-profile-request";
import { UpdateUserProfileResponse } from "./models/update-user-profile-response";
import { IUserValue } from "../user/user-value";
import { IUserAdditionalEmailsRepository } from "../additional-emails/user-additional-emails-repository";
import { IProfileImageRepository } from "../profile-image/profile-image-repository";
import { IUserAdditionalEmailsValue } from "../additional-emails/user-additional-emails-value";
import { IProfileImageValue } from "../profile-image/profile-image-value";
import { UserDbObject } from "../user/user-db-object";
import { UpdateUserPasswordRequest } from "./models/update-user-password-request";
import { UpdateUserPasswordResponse } from "./models/update-user-password-response";
import { UploadProfileImageRequest } from "./models/upload-profile-image-request";
import { UploadProfileImageResponse } from "./models/upload-profile-image-response";
import { ProfileImageDbObject } from "../profile-image/profile-image-db-object";
import { Hashing } from "../common/hashing";
import { GetUserStatusResponse } from "./models/get-user-status-response";
import { IUserActivityLogService } from "../user-activity-log/user-activity-log-service";
import { UserActivityLogRequest } from "../user-activity-log/models/user-activity-log-request";
import { UserActivityType } from "../models/user-activity-type";
import { GetUsernameAndEmailResponse } from "./models/get-username-and-email-response";
import { GetAdminPanelUserDetailsRequest } from "./models/get-admin-panel-user-details-request";
import { GetAdminPanelUserDetailsResponse } from "./models/get-admin-panel-user-details-response";
import { UserType } from "../models/user-type";
import { ValidationError } from "../common/errors/validation-error";
import { LocalisationKey } from "../localisation/localisation-key";
import { UserStatus } from "../models/user-status";
import { SearchAdminPanelUsersStatus } from "./models/search-admin-panel-users-status";
import { IUserActivityLogRepository } from "../user-activity-log/user-activity-log-repository";
import { GetUserInfoForRepersonalizationRequest } from "./models/get-user-info-for-repersonalization-request";
import { GetUserInfoForRepersonalizationResponse } from "./models/get-user-info-for-repersonalization-response";
import { UploadProfileImageHelperRequest } from "./models/upload-profile-image-helper-request";
import { BankAccountDetailsResponse } from "./models/bank-account-details-response";
import { DeleteProfileImageRequest } from "./models/delete-profile-image-request";
import { DeleteProfileImageResponse } from "./models/delete-profile-image-response";
import { GetReasonsForDeactivationResponse } from "./models/get-reasons-for-deactivation-response";
import { ReasonForInactivity } from "../user-activity-log/models/reason-for-inactivity";
import { ISelfieImageRepository } from "../selfie-image/selfie-image-repository";
import { ISelfieImageValue } from "../selfie-image/selfie-image-value";
import { IImageCompressor } from "../common/image-helper";
import { promises as fs } from 'fs';
import { Environment } from "../environment";
import { VerifyEmailAdminPanelRequest } from "./models/verify-email-admin-panel-request";
import { VerifyEmailAdminPanelResponse } from "./models/verify-email-admin-panel-response";
import { ITicketService } from "../tickets/ticket-service";
import { IAuthenticationService } from "../basic-auth/authentication-service";
import { SearchMainAccountsRequest } from "./models/search-main-accounts-request";
import { GetUsernamesAndEmailsResponse, UsernameAndEmail } from "../tickets/model/get-usernames-and-emails-repersonalization-response";
import { SearchUsersRepoRequest } from "./models/search-users-repo-request";
import { GetUserTypeResponse } from "./models/get-user-type-response";
import { ILocalisationProvider } from "../localisation/localisation-provider";
const path = require('path');


export interface IUserProfileController {
    getUserType(): Promise<GetUserTypeResponse>;
    getUsernamesAndEmails(request: SearchMainAccountsRequest): Promise<GetUsernamesAndEmailsResponse>;
    verifyEmail(request: VerifyEmailAdminPanelRequest): Promise<VerifyEmailAdminPanelResponse>;
    getDefaultImage(header: boolean): Promise<any>;
    getReasonsForDeactivation(): Promise<GetReasonsForDeactivationResponse>;
    deleteProfileImage(request: DeleteProfileImageRequest): Promise<DeleteProfileImageResponse>;
    getProfileImage(userId: string): Promise<IProfileImageValue>;
    getSelfieImage(userId: string): Promise<ISelfieImageValue>;
    getBankAccountDetailsForCurrentUser(): Promise<BankAccountDetailsResponse>;
    getAdminPanelUserDetails(request: GetAdminPanelUserDetailsRequest): Promise<GetAdminPanelUserDetailsResponse>;
    getUserProfile(): Promise<GetUserProfileResponse>;
    updateUserProfile(request: UpdateUserProfileRequest): Promise<UpdateUserProfileResponse>;
    updateUserPassword(request: UpdateUserPasswordRequest): Promise<UpdateUserPasswordResponse>;
    uploadProfileImage(request: UploadProfileImageRequest): Promise<UploadProfileImageResponse>;
    uploadUserProfileImageAdminPanel(request: UploadProfileImageHelperRequest): Promise<UploadProfileImageResponse>;
    getDefaultProfileImage(): Promise<IProfileImageValue>;
    getUserStatus(): Promise<GetUserStatusResponse>;
    getUsernameAndEmail(): Promise<GetUsernameAndEmailResponse>;
    getUserInfoForRepersonalization(request: GetUserInfoForRepersonalizationRequest): Promise<GetUserInfoForRepersonalizationResponse>
}

export class UserProfileController implements IUserProfileController {
    constructor(
        private context: IUserContext,
        private userRepository: IUserRepository,
        private additionalEmailsRepository: IUserAdditionalEmailsRepository,
        private profileImageRepository: IProfileImageRepository,
        private userProfileValidator: IUserProfileValidator,
        private userActivityLogService: IUserActivityLogService,
        private userActivityLogRepository: IUserActivityLogRepository,
        private selfieImageRepository: ISelfieImageRepository,
        private imageCompressor: IImageCompressor,
        private ticketService: ITicketService,
        private localisationProvider: ILocalisationProvider
    ) { }
    
    public async getUserType(): Promise<GetUserTypeResponse> {
        this.context.validateIfAuthenticated();

        const response = new GetUserTypeResponse();
        response.userType = this.context.userType;

        return response;
    }
    
    public async getUsernamesAndEmails(request: SearchMainAccountsRequest): Promise<GetUsernamesAndEmailsResponse> {
        this.context.validateIfAuthenticated();
        this.context.validateAuthorization([UserType.Admin, UserType.SuperAdmin, UserType.SupportLevel1, UserType.SupportLevel2])
        let searchRequest: SearchUsersRepoRequest = new SearchUsersRepoRequest();
        searchRequest.accountType = [UserType.MainAccount];
        searchRequest.usernameOrEmail = request.usernameOrEmail;

        let repoResponse = await this.userRepository.search(searchRequest);

        let response: GetUsernamesAndEmailsResponse = new GetUsernamesAndEmailsResponse();
        response.users = [];

        for (let i = 0; i < repoResponse.users.length; i++) {
            let user: UsernameAndEmail = new UsernameAndEmail();
            user.userId = repoResponse.users[i]._id;
            user.usernameAndEmail = repoResponse.users[i].username;

            if (repoResponse.users[i].email) {
                user.usernameAndEmail += ' (' + repoResponse.users[i].email + ')';
            }

            response.users.push(user);
        }

        return response;
    }
    
    public async verifyEmail(request: VerifyEmailAdminPanelRequest): Promise<VerifyEmailAdminPanelResponse> {
        request.validate();

        const userDb: IUserValue =
            await this.userRepository.getUserByEmailVerificationGuid(request.emailVerificationGuid);

        if (!userDb) {
            throw new ValidationError(this.localisationProvider.translate(LocalisationKey.EmailVerificationLinkNotValid, request.lang));       
         }
         console.log(request.lang);
        
        //EmailVerified status is skipped
        userDb.status = UserStatus.RegistrationCompleted;
        
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

        const logRegistrationRequest = new UserActivityLogRequest();
        logRegistrationRequest.userId = userDb._id;
        logRegistrationRequest.activityType = UserActivityType.RegistrationCompleted;
        await this.userActivityLogService.log(logRegistrationRequest);

        const response = new VerifyEmailAdminPanelResponse();

        return response;
    }

    public async getReasonsForDeactivation(): Promise<GetReasonsForDeactivationResponse> {
        this.context.validateIfAuthenticated();
        this.context.validateAuthorization([UserType.Admin, UserType.SuperAdmin, UserType.SupportLevel1, UserType.SupportLevel2, UserType.EventManager]);

        const response: GetReasonsForDeactivationResponse = new GetReasonsForDeactivationResponse();
        response.reasons = Object.keys(ReasonForInactivity).map(k => ReasonForInactivity[k as any]);
        
        return response;
    }

    public async deleteProfileImage(request: DeleteProfileImageRequest): Promise<DeleteProfileImageResponse> {
        this.context.validateIfAuthenticated();

        const linkedAccounts: Array<IUserValue> = await this.userRepository.getLinkedAccounts(this.context.userId);
        const linkedIds = linkedAccounts.map(n => { return n._id.toString(); });
        console.log(linkedAccounts, linkedIds)
        if (request.userId && !linkedIds.includes(request.userId.toString())) {
            this.context.validateAuthorization([UserType.Admin, UserType.SuperAdmin, UserType.SupportLevel1, UserType.SupportLevel2]);
        }

        const userId = request.userId || this.context.userId;

        const image: IProfileImageValue = await this.profileImageRepository.getProfileImageByUserId(userId);

        if (!image) {
            return;
        }

        await this.profileImageRepository.deleteObjectById(image._id);

        const response: DeleteProfileImageResponse = new DeleteProfileImageResponse();
        return response;
    }

    public async getSelfieImage(userId: string): Promise<ISelfieImageValue> {

        const selfieImage = await this.selfieImageRepository.getSelfieImageByUserId(userId);
        return selfieImage;
    }

    public async getProfileImage(userId: string): Promise<IProfileImageValue> {
        this.context.validateIfAuthenticated();
        const id = userId || this.context.userId;

        let profileImage: IProfileImageValue = await this.profileImageRepository.getProfileImageByUserId(id);


        return profileImage;
    }

    public async getDefaultImage(header: boolean): Promise<any> {
        try{
            let imagePath = Environment.isInsideDocker()
            ? path.join('out', 'src', 'images', 'default-profile-image.png')
            : path.join('src', 'images', 'default-profile-image.png');


            if(header){
                imagePath = Environment.isInsideDocker()
                ? path.join('out', 'src', 'images', 'default-user-header.png')
                : path.join('src', 'images', 'default-user-header.png');
    
            }
           
            const image = await fs.readFile(imagePath);
            return image;
        }
        catch(error){
            console.log('Default profile image not found.');
            throw error;
        }
       
        
    }

    public async getBankAccountDetailsForCurrentUser(): Promise<BankAccountDetailsResponse> {
        this.context.validateIfAuthenticated();

        const user = await this.userRepository.getUserById(this.context.userId);

        const response = new BankAccountDetailsResponse();

        response.bankAccountId = user.bankAccountId;
        response.stripeAccountStatus = user.stripeAccountStatus;
        response.userStatus = user.status;

        return response;

    }

    public async getUserInfoForRepersonalization(request: GetUserInfoForRepersonalizationRequest): Promise<GetUserInfoForRepersonalizationResponse> {
        this.context.validateIfAuthenticated();
        request.validate(this.context.lang);
        const user = await this.userRepository.getUserByUserNameOrEmail(request.usernameOrEmail);

        if (!user) {
            throw new ValidationError(this.localisationProvider.translate(LocalisationKey.UserDoesNotExist));
        }

        if (user._id == this.context.userId) {
            throw new ValidationError(this.localisationProvider.translate(LocalisationKey.SameUserSelected));
        }

        const response: GetUserInfoForRepersonalizationResponse = new GetUserInfoForRepersonalizationResponse();
        response.userId = user._id;
        response.firstName = user.firstname;
        response.lastName = user.lastname;
        response.email = user.email;
        response.username = user.username;

        return response;
    }

    public async getAdminPanelUserDetails(request: GetAdminPanelUserDetailsRequest): Promise<GetAdminPanelUserDetailsResponse> {
        this.context.validateIfAuthenticated();
        this.context.validateAuthorization([UserType.Admin, UserType.SuperAdmin, UserType.SupportLevel1, UserType.SupportLevel2, UserType.EventManager]);
        request.validate(this.context.lang);
        const user = await this.userRepository.getUserById(request.userId);
        if (!user) return;

        if (user.usertype != UserType.MainAccount && user.usertype != UserType.LinkedAccount) {
            throw new ValidationError(this.localisationProvider.translate(LocalisationKey.ActionNotAllowed));
        }


        const response: GetAdminPanelUserDetailsResponse = new GetAdminPanelUserDetailsResponse();
        response.userId = user._id;
        response.username = user.username;
        response.faceMatchScore = user.faceMatchScore;
        response.faceMatchStatus = user.faceMatchStatus;
        response.bankAccountId = user.bankAccountId;
        response.stripeErrors = user.stripeErrors || [];
        
        //Profile image
        let profileImage: IProfileImageValue = await this.profileImageRepository.getProfileImageByUserId(this.context.userId);

        if (!profileImage) {
            profileImage = await this.profileImageRepository.getDefaultProfileImage();
        }

        //map status 
        let status = null;
        switch (user.status) {
            case UserStatus.Blocked:
                status = SearchAdminPanelUsersStatus.Inactive;
                break;
            case UserStatus.IdVerified:
                if (user.bankAccountId) {
                    status = SearchAdminPanelUsersStatus.VerifiedInclBankAccount;
                }
                else {
                    status = SearchAdminPanelUsersStatus.Verified;
                }
                break;
            case UserStatus.EmailVerified:
                status = SearchAdminPanelUsersStatus.Registered;
                break;
            case UserStatus.RegistrationCompleted:
                status = SearchAdminPanelUsersStatus.Registered;
                break;
            default:
                break;
        }

        response.status = status;
        response.verificationDate = await this.userActivityLogRepository.getVerificationDateForUser(user._id);
        response.lastChangeLinkedAccounts = await this.userActivityLogRepository.getLastChangeLinkedAccounts(user._id);
        response.standardEmail = user.email;
        response.isMainAccount = user.usertype == UserType.MainAccount;
        response.gender = user.gender;
        response.firstName = user.firstname;
        response.lastName = user.lastname;
        response.dayOfBirth = user.birthDate;
        response.address = user.address;
        response.postalCode = user.postCode;
        response.city = user.city;
        response.country = user.country;
        response.phone = user.phone;

        return response;
    }

    public async getUserProfile(): Promise<GetUserProfileResponse> {
        this.context.validateIfAuthenticated();

        const user: IUserValue = await this.userRepository.getUserById(this.context.userId);

        const response = new GetUserProfileResponse();

        response.userId = this.context.userId;
        response.email = user.email;
        response.username = user.username;
        response.firstName = user.firstname;
        response.lastName = user.lastname;
        response.gender = user.gender;
        response.birthDate = user.birthDate;
        response.address = user.address;
        response.postCode = user.postCode;
        response.city = user.city;
        response.country = user.country;
        response.phone = user.phone || '';
        response.status = user.status;
        response.userType = user.usertype;

        const additionalEmails: Array<IUserAdditionalEmailsValue> = await this.additionalEmailsRepository.getAdditionalEmailsByUserId(this.context.userId);

        response.additionalEmails = [];

        if (additionalEmails) {
            additionalEmails.forEach(email => {
                let emailResponse = {
                    'email': email.email,
                    'isVerified': email.isVerified
                }

                response.additionalEmails.push(emailResponse);
            });
        }

        let profileImage: IProfileImageValue = await this.profileImageRepository.getProfileImageByUserId(this.context.userId);

        if (!profileImage) {
            profileImage = await this.profileImageRepository.getDefaultProfileImage();
        }

        response.profileImage = new UserProfileImageResponse();
        response.profileImage.image =
            profileImage ? Buffer.from(profileImage.image).toString("base64") : null;

        response.profileImage.mimetype = profileImage ? profileImage.mimetype : null;
        response.profileImage.originalname = profileImage ? profileImage.originalname : null;

        return response;
    }

    public async updateUserProfile(request: UpdateUserProfileRequest): Promise<UpdateUserProfileResponse> {
        this.context.validateIfAuthenticated();

        this.userProfileValidator.validateUpdateUserProfile(request);

        const user: IUserValue = await this.userRepository.getUserById(this.context.userId);

        user.address = request.address || user.address;
        user.city = request.city || user.city;
        user.country = request.country || user.country;
        user.postCode = request.postCode || user.postCode;

        if (request.phone) {
            user.phone = request.phone;
        }

        await this.userRepository.updateObjectById(user._id, new UserDbObject(user));

        const logRequest = new UserActivityLogRequest();
        logRequest.userId = user._id;
        logRequest.activityType = UserActivityType.ProfileEdited;
        await this.userActivityLogService.log(logRequest);

        return new UpdateUserProfileResponse();
    }

    public async updateUserPassword(request: UpdateUserPasswordRequest): Promise<UpdateUserPasswordResponse> {
        this.context.validateIfAuthenticated();

        request.validate(this.context.lang);

        const user: IUserValue = await this.userRepository.getUserById(this.context.userId);

        this.userProfileValidator.validateUpdateUserPassword(request, user.password);

        user.password = Hashing.hashPassword(request.newPassword);

        await this.userRepository.updateObjectById(user._id, new UserDbObject(user));

        const logRequest = new UserActivityLogRequest();
        logRequest.userId = user._id;
        logRequest.activityType = UserActivityType.ProfileEdited;
        await this.userActivityLogService.log(logRequest);

        return new UpdateUserPasswordResponse();
    }

    public async uploadProfileImage(request: UploadProfileImageRequest): Promise<UploadProfileImageResponse> {

        this.context.validateIfAuthenticated();

        request.validate(this.context.lang);

        const requestHelper = new UploadProfileImageHelperRequest();
        requestHelper.profileImage = request.profileImage;
        requestHelper.userId = this.context.userId;

        await this.uploadProfileImageHelper(requestHelper);


        const logRequest = new UserActivityLogRequest();
        logRequest.userId = this.context.userId;
        logRequest.activityType = UserActivityType.ProfileEdited;
        await this.userActivityLogService.log(logRequest);

        const response = new UploadProfileImageResponse();
        return response;
    }

    public async uploadUserProfileImageAdminPanel(request: UploadProfileImageHelperRequest): Promise<UploadProfileImageResponse> {

        this.context.validateIfAuthenticated();
        this.context.validateAuthorization([UserType.Admin, UserType.SuperAdmin, UserType.SupportLevel1, UserType.SupportLevel2]);
        request.validate(this.context.lang);

        const requestHelper = new UploadProfileImageHelperRequest();
        requestHelper.profileImage = request.profileImage;
        requestHelper.userId = request.userId;

        await this.uploadProfileImageHelper(requestHelper);

        const logRequest = new UserActivityLogRequest();
        logRequest.userId = this.context.userId;
        logRequest.activityType = UserActivityType.ProfileEdited;
        logRequest.performedBy = this.context.userId;
        await this.userActivityLogService.log(logRequest);

        const response = new UploadProfileImageResponse();
        return response;
    }



    public async getDefaultProfileImage(): Promise<IProfileImageValue> {
        const profileImage = await this.profileImageRepository.getDefaultProfileImage();

        return profileImage;
    }

    public async getUserStatus(): Promise<GetUserStatusResponse> {
        this.context.validateIfAuthenticated();

        const user = await this.userRepository.getUserById(this.context.userId);

        let response = new GetUserStatusResponse();
        response.status = user.status;

        return response;
    }

    public async getUsernameAndEmail(): Promise<GetUsernameAndEmailResponse> {
        this.context.validateIfAuthenticated();
        const user = await this.userRepository.getUserById(this.context.userId);

        const response = new GetUsernameAndEmailResponse();
        response.username = user.username;
        response.email = user.email;

        return response;
    }

    private async uploadProfileImageHelper(request: UploadProfileImageHelperRequest) {
        //check size and format
        this.userProfileValidator.validateUploadProfileImage(request);

        let profileImage: IProfileImageValue = await this.profileImageRepository.getProfileImageByUserId(request.userId);

        const compressedImage =
            await this.imageCompressor.compressImage(request.profileImage['buffer'])

        if (profileImage) {
            profileImage.image = compressedImage || request.profileImage['buffer'];
            profileImage.originalname = request.profileImage['originalname'];
            profileImage.mimetype = request.profileImage['mimetype'];
            profileImage.size = request.profileImage['size'];

            await this.profileImageRepository.updateObjectById(profileImage._id, new ProfileImageDbObject(profileImage));
        }
        else {
            const newProfileImage = new ProfileImageDbObject();
            newProfileImage.userId = request.userId;
            newProfileImage.image = compressedImage || request.profileImage['buffer'];
            newProfileImage.originalname = request.profileImage['originalname'];
            newProfileImage.mimetype = request.profileImage['mimetype'];
            newProfileImage.size = request.profileImage['size'];

            await this.profileImageRepository.create(newProfileImage);
        }

    }

}