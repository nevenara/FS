import { ExpressAppWrapper } from "../http/express-app-wrapper";
import { Bootstrapper } from "../bootstrapper";
import { IBlacklistedEmailsController } from "./blacklisted-emails-controller";
import { IUserContext } from "../common/user-context";
import { AddBlacklistedEmailRequest } from "./models/add-blacklisted-email-request";
import { AddBlacklistedEmailResponse } from "./models/add-blacklisted-email-response";
import { GetBlackListedEmailsResponse } from "./models/get-blacklisted-emails-response";

export class BlacklistedEmailsRouter {
    public static GET_BLACKLISTED_EMAILS_URL: string = '/getblacklistedemails';
    public static ADD_BLACKLISTED_EMAIL_URL: string = '/addblacklistedemail';

    constructor(private readonly expressApp: ExpressAppWrapper) { }

    public registerRoutes(): void {

        this.expressApp.post(BlacklistedEmailsRouter.GET_BLACKLISTED_EMAILS_URL, async (req, res, next) => {
            const context = req.context as IUserContext;

            const controller: IBlacklistedEmailsController = Bootstrapper.getBlacklistedEmailsController(context);

            const response: GetBlackListedEmailsResponse = await controller.getBlacklistedEmails();

            res.json(response);
        });

        this.expressApp.post(BlacklistedEmailsRouter.ADD_BLACKLISTED_EMAIL_URL, async (req, res, next) => {
            const context = req.context as IUserContext;

            const request: AddBlacklistedEmailRequest = new AddBlacklistedEmailRequest();
            request.domain = req.body.domain;

            const controller: IBlacklistedEmailsController = Bootstrapper.getBlacklistedEmailsController(context);

            const response: AddBlacklistedEmailResponse = await controller.addBlacklistedEmail(request);

            res.json(response);
        });
    }
}