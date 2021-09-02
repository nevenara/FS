import { ExpressAppWrapper } from "../http/express-app-wrapper";
import { IUserContext } from "../common/user-context";
import { ILinkedAccountsController } from "./linked-accounts-controller";
import { Bootstrapper } from "../bootstrapper";
import { ConnectNewAccountResponse } from "./models/connect-new-account-response";
import { ConnectNewAccountRequest } from "./models/connect-new-account-request";
import { IdCheckLinkedAccountResponse } from "./models/id-check-linked-account";
import { IdCheckLinkedAccountRequest } from "./models/id-check-linked-account-request";
import { GetLinkedAccountsResponse } from "./models/get-linked-accounts-response";
import { GetLinkedAccountDetailsRequest } from "./models/get-linked-account-details-request";
import { GetLinkedAccountDetailsResponse } from "./models/get-linked-account-details-response";
import { EditLinkedAccountRequest } from "./models/edit-linked-account-request";
import { EditLinkedAccountResponse } from "./models/edit-linked-account-response";
import { SetLinkedAccountPasswordRequest } from "./models/set-linked-account-password-request";
import { SetLinkedAccountPasswordResponse } from "./models/set-linked-account-password-response";
import { UploadProfileImageLinkedAccountRequest } from "./models/upload-profile-image-linked-account-request";
import { UploadProfileImageLinkedAccountResponse } from "./models/upload-profile-image-linked-account-response";
import { LocalisationKey } from "../localisation/localisation-key";
import { ValidationError } from "../common/errors/validation-error";
import { ILocalisationProvider } from "../localisation/localisation-provider";


const multer = require('multer');
var storage = multer.memoryStorage();
var upload = multer({ storage: storage });

export class LinkedAccountsRouter {
    public static CONNECT_NEW_ACCOUNT_URL = '/connectnewaccount';
    public static ID_CHECK_LINKED_ACCOUNT_URL = '/idchecklinkedaccount';
    public static GET_LINKED_ACCOUNTS_URL = '/getlinkedaccounts';
    public static GET_LINKED_ACCOUNT_DETAILS_URL = '/getlinkedaccountdetails';
    public static EDIT_LINKED_ACCOUNT_URL = '/editlinkedaccount';
    public static SET_LINKED_ACCOUNT_PASSWORD_URL = '/setlinkedaccountpassword';
    public static UPLOAD_PROFILE_IMAGE_LINKED_ACCOUNT_URL = '/uploadprofileimagelinkedaccount';

    constructor(private readonly expressApp: ExpressAppWrapper, private localisationProvider: ILocalisationProvider){}

    public registerRoutes(): void {
        this.expressApp.postWithFile(LinkedAccountsRouter.CONNECT_NEW_ACCOUNT_URL,  upload.single('profileImage'), async (req, res, next) => {
            const context = req.context as IUserContext;

            const request: ConnectNewAccountRequest = new ConnectNewAccountRequest();

            request.username = req.body.username;
            request.address = req.body.address;
            request.birthDate = req.body.birthDate ? new Date(req.body.birthDate): null;
            request.city = req.body.city;
            request.country = req.body.country;
            request.firstname = req.body.firstname;
            request.gender = req.body.gender;
            request.lastname = req.body.lastname;
            request.postCode = req.body.postCode;
            request.relationToMainAccount = req.body.relationToMainAccount;
            request.profileImage = req.file || null;

            const controller: ILinkedAccountsController = Bootstrapper.getLinkedAccountsController(context);

            const response: ConnectNewAccountResponse = await controller.connectNewAccount(request);

            res.json(response);            
        });

        this.expressApp.postWithFile(LinkedAccountsRouter.ID_CHECK_LINKED_ACCOUNT_URL, 
            upload.fields([
            { name: 'idDocument', maxCount: 1 },
            { name: 'selfieImage', maxCount: 1 }]), async (req, res, next) => {
            const context = req.context as IUserContext;

            if (!req.files
                || !req.files['idDocument']
                || !req.files['selfieImage']) {
                throw new ValidationError(this.localisationProvider.translate(LocalisationKey.IdVerificationFilesAreRequired, context.lang))
            }
            
            const request: IdCheckLinkedAccountRequest = new IdCheckLinkedAccountRequest();
            request.linkedAccountId = req.body.linkedAccountId;
            request.idDocumentFile = req.files['idDocument'][0];
            request.selfieImage = req.files['selfieImage'][0];
            
            const controller: ILinkedAccountsController = Bootstrapper.getLinkedAccountsController(context);

            const response: IdCheckLinkedAccountResponse = await controller.idVerifyLinkedAccount(request);

            res.json(response);            
        });

        this.expressApp.get(LinkedAccountsRouter.GET_LINKED_ACCOUNTS_URL, async (req, res, next) => {
            const context = req.context as IUserContext;

            const controller: ILinkedAccountsController = Bootstrapper.getLinkedAccountsController(context);

            const response: GetLinkedAccountsResponse = await controller.getLinkedAccounts();

            res.json(response);
        });

        this.expressApp.post(LinkedAccountsRouter.GET_LINKED_ACCOUNT_DETAILS_URL, async (req, res, next) => {
            const context = req.context as IUserContext;

            const request: GetLinkedAccountDetailsRequest = new GetLinkedAccountDetailsRequest();
            request.linkedAccountId = req.body.linkedAccountId;

            const controller: ILinkedAccountsController = Bootstrapper.getLinkedAccountsController(context);

            const response: GetLinkedAccountDetailsResponse = await controller.getLinkedAccountDetails(request);

            res.json(response);
        });

        this.expressApp.post(LinkedAccountsRouter.EDIT_LINKED_ACCOUNT_URL, async (req, res, next) => {
            const context = req.context as IUserContext;

            const request: EditLinkedAccountRequest = new EditLinkedAccountRequest();
            request.linkedAccountId = req.body.linkedAccountId;
            request.address = req.body.address || null;
            request.city = req.body.city || null;
            request.country = req.body.country || null;
            request.postCode = req.body.postCode || null;

            const controller: ILinkedAccountsController = Bootstrapper.getLinkedAccountsController(context);

            const response: EditLinkedAccountResponse = await controller.editLinkedAccount(request);

            res.json(response);
        });

        this.expressApp.post(LinkedAccountsRouter.SET_LINKED_ACCOUNT_PASSWORD_URL, async (req, res, next) => {
            const context = req.context as IUserContext;

            const request: SetLinkedAccountPasswordRequest = new SetLinkedAccountPasswordRequest();
            request.linkedAccountId = req.body.linkedAccountId;
            request.password = req.body.password;
            request.confirmPassword = req.body.confirmPassword;

            const controller: ILinkedAccountsController = Bootstrapper.getLinkedAccountsController(context);

            const response: SetLinkedAccountPasswordResponse = await controller.setLinkedAccountPassword(request);

            res.json(response);
        });

        this.expressApp.postWithFile(LinkedAccountsRouter.UPLOAD_PROFILE_IMAGE_LINKED_ACCOUNT_URL, upload.single('profileImage'), async (req, res, next) => {
            const context = req.context as IUserContext;

            const request = new UploadProfileImageLinkedAccountRequest();

            request.profileImage = req.file;
            request.linkedAccountId = req.body.linkedAccountId;
            
            const controller: ILinkedAccountsController = Bootstrapper.getLinkedAccountsController(context);

            const response: UploadProfileImageLinkedAccountResponse = await controller.uploadProfileImage(request);
            res.json(response);   
        });
    }
}