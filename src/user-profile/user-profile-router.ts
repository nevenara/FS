import { ExpressAppWrapper } from "../http/express-app-wrapper";
import { Bootstrapper } from "../bootstrapper";
import { IUserProfileController } from "./user-profile-controller";
import { GetUserProfileResponse } from "./models/get-user-profile-response";
import { IUserContext } from "../common/user-context";
import { UpdateUserProfileRequest } from "./models/update-user-profile-request";
import { UpdateUserProfileResponse } from "./models/update-user-profile-response";
import { UpdateUserPasswordRequest } from "./models/update-user-password-request";
import { UpdateUserPasswordResponse } from "./models/update-user-password-response";
import { UploadProfileImageRequest } from "./models/upload-profile-image-request";
import { UploadProfileImageResponse } from "./models/upload-profile-image-response";
import { ISearchUserController } from "./search-user-controller";
import { GetUserAndLinkedAccountsResponse } from "./models/get-user-and-linked-accounts-response";
import { SearchUsersRequest } from "./models/search-users-request";
import { SearchUsersResponse } from "./models/search-users-response";
import { SearchAdminPanelUsersRequest } from "./models/search-admin-panel-users-request";
import { GetAdminPanelUserDetailsRequest } from "./models/get-admin-panel-user-details-request";
import { GetAdminPanelUserDetailsResponse } from "./models/get-admin-panel-user-details-response";
import { SearchAdminPanelUsersResponse } from "./models/search-admin-panel-users-response";
import { IExportUsersController } from "./export-users-controller";
import { ExportPdfUsersController } from "./export-pdf-users-controller";
import { GetUserInfoForRepersonalizationRequest } from "./models/get-user-info-for-repersonalization-request";
import { DeactivateUserAdminPanelRequest } from "./models/deactivate-user-admin-panel-request";
import { DeactivateUserAdminPanelResponse } from "./models/deactivate-user-admin-panel-response";
import { IAdminUsersController } from "./admin-users-controller";
import { GetReasonsForDeactivationResponse } from "./models/get-reasons-for-deactivation-response";
import { DeleteUserRequest } from "./models/delete-user-request";
import { DeleteUserResponse } from "./models/delete-user-response";
import { UpdateUserAdminPanelRequest } from "./models/update-user-admin-panel-request";
import { UpdateUserAdminPanelResponse } from "./models/update-user-admin-panel-response";
import { UploadProfileImageHelperRequest } from "./models/upload-profile-image-helper-request";
import { BankAccountDetailsResponse } from "./models/bank-account-details-response";
import { GetAccountDetailsAdminPanelRequest } from "./models/get-account-details-admin-panel-request";
import { GetAccountDetailsAdminPanelResponse } from "./models/get-account-details-admin-panel-response";
import { GetLinkedAccountsAdminPanelRequest } from "./models/get-linked-accounts-admin-panel-request";
import { GetLinkedAccountsAdminPanelResponse } from "./models/get-linked-accounts-admin-panel-response";
import { IProfileImageValue } from "../profile-image/profile-image-value";
import { AddUserAdminPanelRequest } from "./models/add-user-admin-panel-request";
import { AddUserAdminPanelResponse } from "./models/add-user-admin-panel-response";
import { ICountryListProvider } from "../common/country-list-provider";
import { DeleteProfileImageRequest } from "./models/delete-profile-image-request";
import { DeleteProfileImageResponse } from "./models/delete-profile-image-response";
import { ISelfieImageValue } from "../selfie-image/selfie-image-value";
import { VerifyIdRequest } from "../registration/models/verify-id-request";
import { ValidationError } from "../common/errors/validation-error";
import { LocalisationKey } from "../localisation/localisation-key";
import { IIdVerificationController } from "../registration/id-verification-controller";
import { VerifyIdResponse } from "../registration/models/verify-id-response";
import { GetStripeAccountBalanceRequest, GetStripeAccountBalanceResponse } from "./models/get-stripe-account-balance-request";
import { query } from "express";
import { VerifyEmailAdminPanelRequest } from "./models/verify-email-admin-panel-request";
import { VerifyEmailAdminPanelResponse } from "./models/verify-email-admin-panel-response";
import { Environment } from "../environment";
import { SearchMainAccountsRequest } from "./models/search-main-accounts-request";
import { GetUserTypeResponse } from "./models/get-user-type-response";
import { ILocalisationProvider } from "../localisation/localisation-provider";

const multer = require('multer');
var storage = multer.memoryStorage();
var upload = multer({ storage: storage });

export class UserProfileRouter {
    public static GET_USER_PROFILE_URL = '/getuserprofile';
    public static UPDATE_USER_PROFILE_URL = '/updateuserprofile';
    public static UPDATE_USER_PASSWORD_URL = '/updateuserpassword';
    public static UPLOAD_PROFILE_IMAGE_URL = '/uploadprofileimage';
    public static GET_DEFAULT_IMAGE_URL = "/getdefaultprofileimage";
    public static GET_USER_AND_LINKED_ACCOUNTS_USERNAMES = '/usersandlinkedaccountsusernames';
    public static SEARCH_USERS = '/searchusers';
    public static GET_USER_STATUS = '/userstatus';
    public static GET_USERNAME_AND_EMAIL_URL = '/usernameandemail';

    public static GET_USER_INFO_FOR_REPERSONALIZATION_URL = '/users/userinfoforrepersonalization';

    public static SEARCH_ADMIN_PANEL_USERS_URL = '/users/adminpanel/search';
    public static EXPORT_EXCEL_ADMIN_PANEL_USERS_URL = '/users/adminpanel/exportexcel';
    public static EXPORT_CSV_ADMIN_PANEL_USERS_URL = '/users/adminpanel/exportcsv';
    public static EXPORT_PDF_ADMIN_PANEL_USERS_URL = '/users/adminpanel/exportpdf';

    public static GET_ADMIN_PANEL_USER_DETAILS_URL = '/users/adminpanel/userdetails';
    public static GET_REASONS_FOR_DEACTIVATION_ADMIN_PANEL_URL = '/users/adminpanel/reasonsfordeactivation';
    public static DEACTIVATE_USER_ADMIN_PANEL_URL = '/users/adminpanel/deactivateuser';
    public static ACTIVATE_USER_ADMIN_PANEL_URL = '/users/adminpanel/activateuser';
    public static DELETE_USER_ADMIN_PANEL_URL = '/users/adminpanel/deleteuser';
    public static UPDATE_USER_ADMIN_PANEL_URL = '/users/adminpanel/updateuser';
    public static UPLOAD_USER_PROFILE_IMAGE_ADMIN_PANEL = '/users/adminpanel/uploaduserprofileimage';
    public static GET_ACCOUNT_DETAILS_ADMIN_PANEL_URL = '/users/adminpanel/accountdetails';
    public static GET_LINKED_ACCOUNTS_ADMIN_PANEL_URL = '/users/adminpanel/linkedaccounts';
    public static ADD_USER_ADMIN_PANEL_URL = '/users/adminpanel/add';
    public static VERIFY_EMAIL_USER_ADMIN_PANEL = '/users/adminpanel/verifyemail';
    public static IDVERIFY_USER_ADMIN_PANEL_URL = '/users/adminpanel/idverify';
    public static GET_ALL_MAIN_ACCOUNTS_URL = '/users/mainaccounts/search';

    public static GET_BANK_ACCOUNT_DETAILS = '/users/bankaccount/details';

    public static PROFILE_IMAGE = '/users/profileimage';
    public static SELFIE_IMAGE = '/users/selfieimage';
    public static DELETE_PROFILE_IMAGE = '/users/profileimage/delete';
    public static COUNTRY_LIST_API = '/users/countries';
    public static ACCOUNT_BALANCE_PAYOUTS_LIST_API = '/users/adminpanel/accountbalance';

    public static USER_TYPE_URL = '/users/type';

    constructor(private readonly expressApp: ExpressAppWrapper, private localisationProvider: ILocalisationProvider) { }

    public registerRoutes(): void {

        this.expressApp.get(UserProfileRouter.USER_TYPE_URL, async (req, res, next) => {
            const context = req.context as IUserContext;

             
            const controller: IUserProfileController = Bootstrapper.getUserProfileController(context)

            const response: GetUserTypeResponse = await controller.getUserType();

            res.json(response);
        });

        this.expressApp.post(UserProfileRouter.GET_ALL_MAIN_ACCOUNTS_URL, async (req, res, next) => {
            const context = req.context as IUserContext;

            const controller = Bootstrapper.getUserProfileController(context);

            let request: SearchMainAccountsRequest = new SearchMainAccountsRequest();
            request.usernameOrEmail = req.body.usernameOrEmail;

            let response = await controller.getUsernamesAndEmails(request);
            res.json(response);
        });

        this.expressApp.get(UserProfileRouter.VERIFY_EMAIL_USER_ADMIN_PANEL, async (req, res, next) => {
            const context = req.context as IUserContext;

            const request = new VerifyEmailAdminPanelRequest();

            request.emailVerificationGuid = req.query.emailVerificationGuid;
            request.lang = req.query.lang;
             
            const controller: IUserProfileController = Bootstrapper.getUserProfileController(context)

            const response: VerifyEmailAdminPanelResponse = await controller.verifyEmail(request);

            res.redirect(Environment.getWebAppHost() + '/auth');
        });

        this.expressApp.get(UserProfileRouter.ACCOUNT_BALANCE_PAYOUTS_LIST_API, async (req, res, next) => {
           
            const context = req.context as IUserContext;
            
            const controller: IAdminUsersController =
                Bootstrapper.getAdminUsersController(context);

            const request = new GetStripeAccountBalanceRequest();
            
            request.userId = req.query.userId;

            const response: GetStripeAccountBalanceResponse = await controller.getStripeAccountBalance(request);

            res.json(response);
        });

        this.expressApp.get(UserProfileRouter.COUNTRY_LIST_API, async (req, res, next) => {
            const countryListProvider: ICountryListProvider = Bootstrapper.getCountryListProvider();

            const response = await countryListProvider.getList();

            res.json(response);
        });

        this.expressApp.get(UserProfileRouter.GET_BANK_ACCOUNT_DETAILS, async (req, res, next) => {
            const context = req.context as IUserContext;

            const controller: IUserProfileController = Bootstrapper.getUserProfileController(context);

            const response: BankAccountDetailsResponse = await controller.getBankAccountDetailsForCurrentUser();

            res.json(response);
        });

        this.expressApp.get(UserProfileRouter.GET_USER_PROFILE_URL, async (req, res, next) => {
            const context = req.context as IUserContext;

            const controller: IUserProfileController = Bootstrapper.getUserProfileController(context);

            const response: GetUserProfileResponse = await controller.getUserProfile();

            res.json(response);
        });


        this.expressApp.postWithFile(UserProfileRouter.IDVERIFY_USER_ADMIN_PANEL_URL,
            upload.fields([
                { name: 'idDocument', maxCount: 1 },
                { name: 'selfieImage', maxCount: 1 }]),
            async (req, res, next) => {

                const context = req.context as IUserContext;

                context.validateIfAuthenticated();

                context.validateIfAdmin();

                const request = new VerifyIdRequest();

                if (!req.files
                    || !req.files['idDocument']
                    || !req.files['selfieImage']) {
                    throw new ValidationError(this.localisationProvider.translate(LocalisationKey.IdVerificationFilesAreRequired, context.lang));
                }

                request.idDocumentFile = req.files['idDocument'][0];
                request.selfieImage = req.files['selfieImage'][0];
                request.userId = req.body.userId;
                // request.residenceDocument = req.files['residenceDocument'][0];

                const controller: IIdVerificationController =
                    Bootstrapper.getIdVerificationController(context);

                const response: VerifyIdResponse =
                    await controller.verifyId(request);

                res.json(response);
            });

        this.expressApp.post(UserProfileRouter.UPDATE_USER_PROFILE_URL, async (req, res, next) => {
            const context = req.context as IUserContext;

            const request = new UpdateUserProfileRequest();
            request.address = req.body.address || null;
            request.city = req.body.city || null;
            request.country = req.body.country || null;
            request.phone = req.body.phone || null;
            request.postCode = req.body.postCode || null;

            const controller: IUserProfileController = Bootstrapper.getUserProfileController(context);

            const response: UpdateUserProfileResponse = await controller.updateUserProfile(request);

            res.json(response);
        });

        this.expressApp.post(UserProfileRouter.UPDATE_USER_PASSWORD_URL, async (req, res, next) => {
            const context = req.context as IUserContext;

            const request: UpdateUserPasswordRequest = new UpdateUserPasswordRequest();
            request.currentPassword = req.body.currentPassword;
            request.newPassword = req.body.newPassword;
            request.confirmPassword = req.body.confirmPassword;

            const controller: IUserProfileController = Bootstrapper.getUserProfileController(context);

            const response: UpdateUserPasswordResponse = await controller.updateUserPassword(request);

            res.json(response);
        });

        this.expressApp.postWithFile(UserProfileRouter.UPLOAD_PROFILE_IMAGE_URL, upload.single('profileImage'), async (req, res, next) => {
            const context = req.context as IUserContext;

            const request = new UploadProfileImageRequest();

            request.profileImage = req.file;

            const controller: IUserProfileController = Bootstrapper.getUserProfileController(context);

            const response: UploadProfileImageResponse = await controller.uploadProfileImage(request);

            res.json(response);
        });

        this.expressApp.get(UserProfileRouter.GET_DEFAULT_IMAGE_URL, async (req, res, next) => {
            const context = req.context as IUserContext;
            const controller: IUserProfileController = Bootstrapper.getUserProfileController(context);

            const image = await controller.getDefaultImage(req.query.header);
            res.set('Content-Type', 'image/png');
            res.send(image);
        });

        //for dropdown
        this.expressApp.get(UserProfileRouter.GET_USER_AND_LINKED_ACCOUNTS_USERNAMES, async (req, res, next) => {
            const context = req.context as IUserContext;
            const controller: ISearchUserController = Bootstrapper.getSearchUsersController(context);
            const response: GetUserAndLinkedAccountsResponse = await controller.getUserAndLinkedAccounts();

            res.json(response);
        });

        //for input search; all registered users
        this.expressApp.post(UserProfileRouter.SEARCH_USERS, async (req, res, next) => {
            const context = req.context as IUserContext;
            const controller: ISearchUserController = Bootstrapper.getSearchUsersController(context);

            const request: SearchUsersRequest = new SearchUsersRequest();
            request.usernameOrEmail = req.body.usernameOrEmail;

            let response: SearchUsersResponse = await controller.searchUsers(request);

            res.json(response);
        });

        this.expressApp.get(UserProfileRouter.GET_USER_STATUS, async (req, res, next) => {
            const context = req.context as IUserContext;
            const controller = Bootstrapper.getUserProfileController(context);
            const response = await controller.getUserStatus();

            res.json(response);
        });

        this.expressApp.get(UserProfileRouter.GET_USERNAME_AND_EMAIL_URL, async (req, res, next) => {
            const context = req.context as IUserContext;
            const controller = Bootstrapper.getUserProfileController(context);
            const response = await controller.getUsernameAndEmail();

            res.json(response);
        });

        this.expressApp.post(UserProfileRouter.GET_USER_INFO_FOR_REPERSONALIZATION_URL, async (req, res, next) => {
            const context = req.context as IUserContext;
            const controller = Bootstrapper.getUserProfileController(context);
            const request = new GetUserInfoForRepersonalizationRequest();
            request.usernameOrEmail = req.body.usernameOrEmail;

            const response = await controller.getUserInfoForRepersonalization(request);

            res.json(response);
        });

        this.expressApp.post(UserProfileRouter.SEARCH_ADMIN_PANEL_USERS_URL, async (req, res, next) => {
            const context = req.context as IUserContext;

            const controller: ISearchUserController =
                Bootstrapper.getSearchUsersController(context);

            const request: SearchAdminPanelUsersRequest = this.getSearchAdminPanelUsersRequest(req);

            const response = await controller.searchAdminPanelUsers(request);

            res.json(response);
        });

        this.expressApp.post(UserProfileRouter.EXPORT_EXCEL_ADMIN_PANEL_USERS_URL, async (req, res, next) => {
            const context = req.context as IUserContext;

            const controller: ISearchUserController =
                Bootstrapper.getSearchUsersController(context);

            const request: SearchAdminPanelUsersRequest = this.getSearchAdminPanelUsersRequest(req);

            const response: SearchAdminPanelUsersResponse =
                await controller.searchAdminPanelUsers(request);

            const exportController: IExportUsersController =
                Bootstrapper.getExportUsersController(context);

            await exportController.exportExcel(response, res);
        });

        this.expressApp.post(UserProfileRouter.EXPORT_CSV_ADMIN_PANEL_USERS_URL, async (req, res, next) => {
            const context = req.context as IUserContext;

            const controller: ISearchUserController =
                Bootstrapper.getSearchUsersController(context);

            const request: SearchAdminPanelUsersRequest = this.getSearchAdminPanelUsersRequest(req);

            const response: SearchAdminPanelUsersResponse =
                await controller.searchAdminPanelUsers(request);

            const exportController: IExportUsersController =
                Bootstrapper.getExportUsersController(context);

            await exportController.exportCSV(response, res);
        });

        this.expressApp.post(UserProfileRouter.EXPORT_PDF_ADMIN_PANEL_USERS_URL, async (req, res, next) => {
            const context = req.context as IUserContext;

            const controller: ISearchUserController =
                Bootstrapper.getSearchUsersController(context);

            const request: SearchAdminPanelUsersRequest = this.getSearchAdminPanelUsersRequest(req);

            const response: SearchAdminPanelUsersResponse =
                await controller.searchAdminPanelUsers(request);

            const exportController: ExportPdfUsersController =
                Bootstrapper.getExportPDFUsersController(context);

            await exportController.exportPDF(response, res);
        });


        this.expressApp.post(UserProfileRouter.GET_ADMIN_PANEL_USER_DETAILS_URL, async (req, res, next) => {
            const context = req.context as IUserContext;

            const controller: IUserProfileController =
                Bootstrapper.getUserProfileController(context);

            const request: GetAdminPanelUserDetailsRequest = new GetAdminPanelUserDetailsRequest();
            request.userId = req.body.userId;
            const response: GetAdminPanelUserDetailsResponse = await controller.getAdminPanelUserDetails(request);

            res.json(response);
        });

        this.expressApp.post(UserProfileRouter.DEACTIVATE_USER_ADMIN_PANEL_URL, async (req, res, next) => {
            const context = req.context as IUserContext;

            const controller: IAdminUsersController =
                Bootstrapper.getAdminUsersController(context);

            const request: DeactivateUserAdminPanelRequest = new DeactivateUserAdminPanelRequest();
            request.userId = req.body.userId;
            request.reasonForDeactivation = req.body.reasonForDeactivation;
            const response: DeactivateUserAdminPanelResponse = await controller.deactivateUser(request);

            res.json(response);
        });

        this.expressApp.post(UserProfileRouter.ACTIVATE_USER_ADMIN_PANEL_URL, async (req, res, next) => {
            const context = req.context as IUserContext;

            const controller: IAdminUsersController =
                Bootstrapper.getAdminUsersController(context);

            const response = await controller.activateUser(req.body.userId);

            res.json(response);
        });

        this.expressApp.post(UserProfileRouter.DELETE_USER_ADMIN_PANEL_URL, async (req, res, next) => {
            const context = req.context as IUserContext;

            const controller: IAdminUsersController =
                Bootstrapper.getAdminUsersController(context);

            const request: DeleteUserRequest = new DeleteUserRequest();
            request.userId = req.body.userId;
            const response: DeleteUserResponse = await controller.deleteUser(request);

            res.json(response);
        });

        this.expressApp.post(UserProfileRouter.UPDATE_USER_ADMIN_PANEL_URL, async (req, res, next) => {
            const context = req.context as IUserContext;

            const controller: IAdminUsersController =
                Bootstrapper.getAdminUsersController(context);

            const request: UpdateUserAdminPanelRequest = new UpdateUserAdminPanelRequest();

            request.userId = req.body.userId;

            request.firstname = req.body.firstname;
            request.lastname = req.body.lastname;
            request.gender = req.body.gender;
            request.birthDate = req.body.birthDate;
            request.address = req.body.address;
            request.postCode = req.body.postCode;
            request.phone = req.body.phone;
            request.city = req.body.city;
            request.country = req.body.country;

            const response: UpdateUserAdminPanelResponse = await controller.updateUser(request);

            res.json(response);
        });

        this.expressApp.postWithFile(UserProfileRouter.UPLOAD_USER_PROFILE_IMAGE_ADMIN_PANEL, upload.single('profileImage'), async (req, res, next) => {
            const context = req.context as IUserContext;

            const controller: IUserProfileController =
                Bootstrapper.getUserProfileController(context);

            const request: UploadProfileImageHelperRequest = new UploadProfileImageHelperRequest();

            request.userId = req.body.userId;
            request.profileImage = req.file || null;

            const response: UploadProfileImageResponse = await controller.uploadUserProfileImageAdminPanel(request);

            res.json(response);
        });

        this.expressApp.post(UserProfileRouter.GET_ACCOUNT_DETAILS_ADMIN_PANEL_URL, async (req, res, next) => {
            const context = req.context as IUserContext;
            const controller: IAdminUsersController =
                Bootstrapper.getAdminUsersController(context);
            const request: GetAccountDetailsAdminPanelRequest = new GetAccountDetailsAdminPanelRequest();
            request.userId = req.body.userId;
            const response: GetAccountDetailsAdminPanelResponse = await controller.getAccountDetails(request);

            res.json(response);
        });

        this.expressApp.post(UserProfileRouter.GET_LINKED_ACCOUNTS_ADMIN_PANEL_URL, async (req, res, next) => {
            const context = req.context as IUserContext;
            const controller: IAdminUsersController =
                Bootstrapper.getAdminUsersController(context);
            const request: GetLinkedAccountsAdminPanelRequest = new GetLinkedAccountsAdminPanelRequest();
            request.userId = req.body.userId;
            const response: GetLinkedAccountsAdminPanelResponse = await controller.getLinkedAccounts(request);

            res.json(response);
        });

        this.expressApp.get(UserProfileRouter.PROFILE_IMAGE, async (req, res, next) => {
            const context = req.context as IUserContext;

            const controller: IUserProfileController =
                Bootstrapper.getUserProfileController(context);

            const profileImage: IProfileImageValue = await controller.getProfileImage(req.query.userId);

            if(profileImage){
                res.set('Content-Type', profileImage.mimetype);
                res.send(Buffer.from(profileImage.image));
            }
            else{
                const image = await controller.getDefaultImage(req.query.header);
                res.set('Content-Type', 'image/png');
                res.send(image);

            }
           
        });

        this.expressApp.get(UserProfileRouter.SELFIE_IMAGE, async (req, res, next) => {
            const context = req.context as IUserContext;

            const controller: IUserProfileController =
                Bootstrapper.getUserProfileController(context);

            const profileImage: ISelfieImageValue = await controller.getSelfieImage(req.query.userId);

            if(profileImage){
                res.set('Content-Type', profileImage.mimetype);
                res.send(Buffer.from(profileImage.image));
            }
            else{
                const image = await controller.getDefaultImage(true);
                res.set('Content-Type', 'image/png');
                res.send(image);

            }
        });

        this.expressApp.postWithFile(UserProfileRouter.ADD_USER_ADMIN_PANEL_URL, upload.single('profileImage'), async (req, res, next) => {
            const context = req.context as IUserContext;

            const controller: IAdminUsersController =
                Bootstrapper.getAdminUsersController(context);

            const request: AddUserAdminPanelRequest = new AddUserAdminPanelRequest();

            request.firstname = req.body.firstname;
            request.lastname = req.body.lastname;
            request.gender = req.body.gender;
            request.birthDate = req.body.birthDate;
            request.address = req.body.address;
            request.postCode = req.body.postCode;
            request.phone = req.body.phone;
            request.city = req.body.city;
            request.country = req.body.country;
            request.isMainAccount = req.body.isMainAccount == "true";
            request.standardEmail = req.body.standardEmail;
            request.linkedToMainAccount = req.body.linkedToMainAccount;
            request.username = req.body.username;
            request.profileImage = req.file || null;

            const response: AddUserAdminPanelResponse = await controller.addUser(request);

            res.json(response);
        });

        this.expressApp.post(UserProfileRouter.DELETE_PROFILE_IMAGE, async (req, res, next) => {
            const context = req.context as IUserContext;

            const controller: IUserProfileController =
                Bootstrapper.getUserProfileController(context);

            const request: DeleteProfileImageRequest = new DeleteProfileImageRequest();
            request.userId = req.body.userId;
            const response: DeleteProfileImageResponse = await controller.deleteProfileImage(request);

            res.json(response);
        });

        this.expressApp.get(UserProfileRouter.GET_REASONS_FOR_DEACTIVATION_ADMIN_PANEL_URL, async (req, res, next) => {
            const context = req.context as IUserContext;

            const controller: IUserProfileController =
                Bootstrapper.getUserProfileController(context);

            const response: GetReasonsForDeactivationResponse = await controller.getReasonsForDeactivation();

            res.json(response);
        })
    }

    private getSearchAdminPanelUsersRequest(req: any): SearchAdminPanelUsersRequest {
        return {
            textSearch: req.body.textSearch,
            status: req.body.status,
            accountType: req.body.accountType,
            reasonForInactivity: req.body.reasonForInactivity,
            verificationDateFrom: req.body.verificationDateFrom ? new Date(req.body.verificationDateFrom) : null,
            verificationDateTo: req.body.verificationDateTo ? new Date(req.body.verificationDateTo) : null,
            signUpDateFrom: req.body.signUpDateFrom ? new Date(req.body.signUpDateFrom) : null,
            signUpDateTo: req.body.signUpDateTo ? new Date(req.body.signUpDateTo) : null,
            page: req.body.page,
            limit: req.body.limit,
            sortField: req.body.sortField,
            sortOrder: req.body.sortOrder
        };
    }
}