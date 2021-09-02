import { ExpressAppWrapper } from "../http/express-app-wrapper";
import { Bootstrapper } from "../bootstrapper";
import { IUserContext } from "../common/user-context";
import { AddAdditionalEmailRequest } from "./models/add-additional-email-request";
import { AddAdditionalEmailResponse } from "./models/add-additional-email-response";
import { IAdditionalEmailsController } from "./additional-emails-controller";
import { VerifyAdditionalEmailRequest } from "./models/verify-additional-email-request";
import { VerifyAdditionalEmailResponse } from "./models/verify-additional-email-response";
import { UseAsStandardEmailRequest } from "./models/use-as-standard-email-request";
import { UseAsStandardEmailResponse } from "./models/use-as-standard-email-response";
import { DeleteAdditionalEmailRequest } from "./models/delete-additional-email-request";
import { DeleteAdditionalEmailResponse } from "./models/delete-additional-email-response";
import { AddAdditionalEmailForUserRequest } from "./models/add-additional-email-for-user-request";
import { SetAsStandardEmailForUserRequest } from "./models/set-as-standard-email-for-user-request";
import { Environment } from "../environment";
import { UpdateAdditionalEmailRequest } from "./models/update-additional-email-request";
import { UpdateAdditionalEmailResponse } from "./models/update-additional-email-response";
import { DeleteAdditionalEmailAdminPanelRequest } from "./models/delete-additional-email-admin-panel-request";

export class AdditionalEmailsRouter {
    public static ADD_ADDITIONAL_EMAIL_URL: string = '/addadditionalemail';
    public static VERIFY_ADDITIONAL_EMAIL_URL: string = '/verifyadditionalemail';
    public static USE_AS_STANDARD_EMAIL_URL: string = '/useasstandardemail';
    public static DELETE_ADDITIONAL_EMAIL_URL: string = '/deleteadditionalemail';

    public static ADD_ADDITIONAL_EMAIL_ADMIN_PANEL_URL = '/additionalemails/adminpanel/add';
    public static SET_AS_STANDARD_EMAIL_ADMIN_PANEL_URL = '/additionalemails/adminpanel/setasstandard';
    public static UPDATE_ADDITIONAL_EMAIL_ADMIN_PANEL_URL = '/additionalemails/adminpanel/update';
    public static DELETE_ADDITIONAL_EMAIL_ADMIN_PANEL_URL = '/additionalemails/adminpanel/delete';


    constructor(private readonly expressApp: ExpressAppWrapper){}

    public registerRoutes(): void {
        this.expressApp.post(AdditionalEmailsRouter.DELETE_ADDITIONAL_EMAIL_ADMIN_PANEL_URL, async (req, res, next) => {
            const context = req.context as IUserContext;

            const request = new DeleteAdditionalEmailAdminPanelRequest();

            request.email = req.body.email;
            request.userId = req.body.userId;

            const controller: IAdditionalEmailsController = Bootstrapper.getAdditionalEmailsController(context);

            const response: DeleteAdditionalEmailResponse = await controller.delete(request);

            res.json(response);            
        });

        this.expressApp.post(AdditionalEmailsRouter.UPDATE_ADDITIONAL_EMAIL_ADMIN_PANEL_URL, async (req, res, next) => {
            const context = req.context as IUserContext;

            const request = new UpdateAdditionalEmailRequest();

            request.oldEmail = req.body.oldEmail;
            request.newEmail = req.body.newEmail;
            request.userId = req.body.userId;

            const controller: IAdditionalEmailsController = Bootstrapper.getAdditionalEmailsController(context);

            const response: UpdateAdditionalEmailResponse = await controller.updateAdditionalEmail(request);

            res.json(response);            
        });

        this.expressApp.post(AdditionalEmailsRouter.ADD_ADDITIONAL_EMAIL_URL, async (req, res, next) => {
            const context = req.context as IUserContext;

            const request = new AddAdditionalEmailRequest();

            request.email = req.body.email;

            const controller: IAdditionalEmailsController = Bootstrapper.getAdditionalEmailsController(context);

            const response: AddAdditionalEmailResponse = await controller.addAdditionalEmail(request);

            res.json(response);            
        });

        this.expressApp.get(AdditionalEmailsRouter.VERIFY_ADDITIONAL_EMAIL_URL, async (req, res, next) => {
            const request = new VerifyAdditionalEmailRequest();

            request.uuid = req.query.emailVerificationGuid;

            const controller: IAdditionalEmailsController = Bootstrapper.getAdditionalEmailsController(null);

            const response: VerifyAdditionalEmailResponse = await controller.verifyAdditionalEmail(request);

            res.redirect(Environment.getWebAppHost());          
        });

        this.expressApp.post(AdditionalEmailsRouter.USE_AS_STANDARD_EMAIL_URL, async (req, res, next) => {
            const context = req.context as IUserContext;

            const request = new UseAsStandardEmailRequest();

            request.email = req.body.email;
            request.password = req.body.password;

            const controller: IAdditionalEmailsController = Bootstrapper.getAdditionalEmailsController(context);

            const response: UseAsStandardEmailResponse = await controller.useAsStandardEmail(request);

            res.json(response);   
        });

        this.expressApp.delete(AdditionalEmailsRouter.DELETE_ADDITIONAL_EMAIL_URL, async (req, res, next) => {
            const context = req.context as IUserContext;

            const request = new DeleteAdditionalEmailRequest();

            request.email = req.body.email;

            const controller: IAdditionalEmailsController = Bootstrapper.getAdditionalEmailsController(context);

            const response: DeleteAdditionalEmailResponse = await controller.deleteAdditionalEmail(request);

            res.json(response);   
        });

        this.expressApp.post(AdditionalEmailsRouter.ADD_ADDITIONAL_EMAIL_ADMIN_PANEL_URL, async (req, res, next) => {
            const context = req.context as IUserContext;

            const request = new AddAdditionalEmailForUserRequest();

            request.email = req.body.email;
            request.userId = req.body.userId;

            const controller: IAdditionalEmailsController = Bootstrapper.getAdditionalEmailsController(context);

            const response: AddAdditionalEmailResponse = await controller.addAdditionalEmailAdminPanel(request);

            res.json(response);   
        });

        this.expressApp.post(AdditionalEmailsRouter.SET_AS_STANDARD_EMAIL_ADMIN_PANEL_URL, async (req, res, next) => {
            const context = req.context as IUserContext;

            const request = new SetAsStandardEmailForUserRequest();

            request.email = req.body.email;
            request.userId = req.body.userId;

            const controller: IAdditionalEmailsController = Bootstrapper.getAdditionalEmailsController(context);

            const response: UseAsStandardEmailResponse = await controller.setAsStandardEmailAdminPanel(request);

            res.json(response);   
        });

    }
}