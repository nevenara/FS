import { Bootstrapper } from "../bootstrapper";
import { IUserContext } from "../common/user-context";
import { ExpressAppWrapper } from "../http/express-app-wrapper";
import { DislikeFAQRequest } from "./models/dislike-faq-request";
import { LikeFAQResponse } from "./models/dislike-faq-response";
import { GetFAQsResponse } from "./models/get-faqs-response";
import { GetSupportContactResponse } from "./models/get-support-contact-response";
import { LikeFAQRequest } from "./models/like-faq-request";
import { DislikeFAQResponse } from "./models/like-faq-response";
import { SendEmailToSupportRequest } from "./models/send-email-to-support-request";
import { SendEmailToSupportResponse } from "./models/send-email-to-support-response";
import { ISupportPageController } from "./support-page-controller";

export class SupportPageRouter {
    public static GET_FAQS_URL = '/support/faq';
    public static GET_SUPPORT_CONTACT_URL = '/support/contact';
    public static LIKE_FAQ_URL = '/support/faq/like';
    public static DISLIKE_FAQ_URL = '/support/faq/dislike';
    public static SEND_EMAIL_TO_SUPPORT_URL = '/support/sendemail';

    constructor(private readonly expressApp: ExpressAppWrapper){}

    public registerRoutes(): void {
        this.expressApp.get(SupportPageRouter.GET_FAQS_URL, async (req, res, next) => {
            const context = req.context as IUserContext;
            const controller: ISupportPageController = Bootstrapper.getSupportPageController(context);
            const response: GetFAQsResponse = await controller.getFAQs();

            res.json(response);
        });

        this.expressApp.get(SupportPageRouter.GET_SUPPORT_CONTACT_URL, async (req, res, next) => {
            const context = req.context as IUserContext;
            const controller: ISupportPageController = Bootstrapper.getSupportPageController(context);
            const response: GetSupportContactResponse = await controller.getSupportContact();

            res.json(response);
        });

        this.expressApp.post(SupportPageRouter.LIKE_FAQ_URL, async (req, res, next) => {
            const context = req.context as IUserContext;
            
            const request: LikeFAQRequest = new LikeFAQRequest();
            request.id = req.body.id;

            const controller: ISupportPageController = Bootstrapper.getSupportPageController(context);
            const response: LikeFAQResponse = await controller.likeFAQ(request);

            res.json(response);
        });

        this.expressApp.post(SupportPageRouter.DISLIKE_FAQ_URL, async (req, res, next) => {
            const context = req.context as IUserContext;
            
            const request: DislikeFAQRequest = new DislikeFAQRequest();
            request.id = req.body.id;

            const controller: ISupportPageController = Bootstrapper.getSupportPageController(context);
            const response: DislikeFAQResponse = await controller.dislikeFAQ(request);

            res.json(response);
        });

        this.expressApp.post(SupportPageRouter.SEND_EMAIL_TO_SUPPORT_URL, async (req, res, next) => {
            const context = req.context as IUserContext;
            
            const request: SendEmailToSupportRequest = new SendEmailToSupportRequest();
            request.email = req.body.email;
            request.username = req.body.username;
            request.subject = req.body.subject;
            request.message = req.body.message;

            const controller: ISupportPageController = Bootstrapper.getSupportPageController(context);
            const response: SendEmailToSupportResponse = await controller.sendEmailToSupport(request);

            res.json(response);
        });
    }
}