import { ExpressAppWrapper } from "../http/express-app-wrapper";
import { RegisterRequest } from "./models/register-request";
import { Bootstrapper } from "../bootstrapper";
import { IRegistrationController } from "./registration-controller";
import { RegisterResponse } from "./models/register-response";
import { VerifyEmailRequest } from "./models/verify-email-request";
import { VerifyEmailResponse } from "./models/verfy-email-response";
import { CompleteRegistrationRequest } from "./models/complete-registration-request";
import { CompleteRegistrationResponse } from "./models/complete-registration-response";
import { IUserContext } from "../common/user-context";
import { Environment } from "../environment";
import { VerifyIdRequest } from "./models/verify-id-request";
import { VerifyIdResponse } from "./models/verify-id-response";
import { IIdVerificationController } from "./id-verification-controller";
import { ValidationError } from "../common/errors/validation-error";
import { LocalisationKey } from "../localisation/localisation-key";
import { MultierFile } from "../common/multier-file";
import { FaceRecognitionService, IFaceRecognitionService } from "./face-recognition-service";
import { CheckUsernameRequest } from "./models/check-username-request";
import { CheckUsernameResponse } from "./models/check-username-response";
import { ILocalisationProvider } from "../localisation/localisation-provider";
const multer = require('multer');
var storage = multer.memoryStorage();
var upload = multer({ storage: storage });


export class RegistrationRouter {
    public static REGISTERURL: string = '/register';
    public static VERIFYEMAILURL: string = '/verifyemail';
    public static COMPLETEREGISTRATIONURL: string = '/completeregistration';
    public static VERIFYIDURL: string = '/verifyid';
    public static FACEIDMATCH: string = '/test/faceidmatch';
    public static ACCEPT_TERMS: string = '/stripe/acceptterms'
    public static CHECK_USERNAME = '/register/checkusername';

    constructor(private readonly expressApp: ExpressAppWrapper, private localisationProvider: ILocalisationProvider) { }

    public registerRoutes(): void {

        this.expressApp.post(RegistrationRouter.CHECK_USERNAME, async (req, res, next) => {
            const context = req.context as IUserContext;

            const request = new CheckUsernameRequest();

            request.username = req.body.username;
            request.lang = req.body.lang;

            const controller: IRegistrationController = Bootstrapper.getRegistrationController(context)

            const response: CheckUsernameResponse = await controller.checkUsername(request);

            res.json(response);
        });

        this.expressApp.post(RegistrationRouter.ACCEPT_TERMS, async (req, res) => {
            const context = req.context as IUserContext;

            const controller: IRegistrationController = Bootstrapper.getRegistrationController(context)

            var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress

            await controller.acceptStripeTerms(ip);

            res.json({});
        });

        this.expressApp.post(RegistrationRouter.REGISTERURL, async (req, res, next) => {
            const context = req.context as IUserContext;

            const request = new RegisterRequest();

            request.email = req.body.email;
            request.password1 = req.body.password1;
            request.password2 = req.body.password2;
            request.lang = req.body.lang;

            const controller: IRegistrationController = Bootstrapper.getRegistrationController(context)

            const response: RegisterResponse = await controller.register(request);

            res.json(response);
        });

        this.expressApp.get(RegistrationRouter.VERIFYEMAILURL, async (req, res, next) => {
            const context = req.context as IUserContext;

            const request = new VerifyEmailRequest();

            request.emailVerificationGuid = req.query.emailVerificationGuid;
            request.userAgent = req.headers['user-agent'];
            request.lang = req.query.lang;
             
            const controller: IRegistrationController = Bootstrapper.getRegistrationController(context)

            const response: VerifyEmailResponse = await controller.verifyEmail(request);

            const cookieManager = Bootstrapper.getCookieManager();

            cookieManager.setCookie(req, res, response.sessionId);

            res.redirect(Environment.getWebAppHost() + '/auth/signup/completeregistration');
        });

        this.expressApp.post(RegistrationRouter.COMPLETEREGISTRATIONURL, async (req, res, next) => {
            const context = req.context as IUserContext;

            const request = new CompleteRegistrationRequest();

            request.username = req.body.username;
            request.gender = req.body.gender;
            request.firstname = req.body.firstname;
            request.lastname = req.body.lastname;
            request.birthDate = req.body.birthDate;
            request.address = req.body.address;
            request.postCode = req.body.postCode;
            request.city = req.body.city;
            request.country = req.body.country;
            request.otherEmails = req.body.additionalEmails;
            request.phone = req.body.phone;

            const controller: IRegistrationController = Bootstrapper.getRegistrationController(context)

            const response: CompleteRegistrationResponse = await controller.completeRegistration(request);

            var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress

            await controller.acceptStripeTerms(ip);

            res.json(response);
        });

        this.expressApp.postWithFile(
            RegistrationRouter.VERIFYIDURL,
            upload.fields([
                { name: 'idDocument', maxCount: 1 },
                { name: 'selfieImage', maxCount: 1 }]),
            async (req, res, next) => {
                const context = req.context as IUserContext;
                const request = new VerifyIdRequest();

                if (!req.files
                    || !req.files['idDocument']
                    || !req.files['selfieImage']) {
                    throw new ValidationError(this.localisationProvider.translate(LocalisationKey.IdVerificationFilesAreRequired, context.lang));
                }

                request.idDocumentFile = req.files['idDocument'][0];
                request.selfieImage = req.files['selfieImage'][0];
                request.userId = context.userId;
                // request.residenceDocument = req.files['residenceDocument'][0];

                const controller: IIdVerificationController =
                    Bootstrapper.getIdVerificationController(context);

                const response: VerifyIdResponse =
                    await controller.verifyId(request);

                res.json(response);
            });

        this.expressApp.postWithFile(
            RegistrationRouter.FACEIDMATCH,
            upload.fields([
                { name: 'idDocument', maxCount: 1 },
                { name: 'selfieImage', maxCount: 1 }]),
            async (req, res, next) => {
                const context = req.context as IUserContext;
                const request = new VerifyIdRequest();

                if (!req.files
                    || !req.files['idDocument']
                    || !req.files['selfieImage']) {
                        throw new ValidationError(this.localisationProvider.translate(LocalisationKey.IdVerificationFilesAreRequired, context.lang))                }

                request.idDocumentFile = req.files['idDocument'][0];
                request.selfieImage = req.files['selfieImage'][0];
                const detectionModel = req.body.detectionModel;
                // request.residenceDocument = req.files['residenceDocument'][0];

                const recognition: IFaceRecognitionService =
                    Bootstrapper.getFaceRecognitionService();

                const response =
                    await recognition.recognizeSelfieAndIDDocument(
                        request.idDocumentFile, 
                        request.selfieImage,
                        detectionModel);

                res.json(response);
            });
    }
}