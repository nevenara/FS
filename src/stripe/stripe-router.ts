import { Bootstrapper } from "../bootstrapper";
import { IUserContext } from "../common/user-context";
import { ExpressAppWrapper } from "../http/express-app-wrapper";

export class StripeRouter {
    public static WEBHOOK_ENDPOINT = '/stripe/webhook';

    constructor(private readonly expressApp: ExpressAppWrapper) { }

    public registerRoutes(): void {
        //https://stripe.com/docs/webhooks/build
        this.expressApp.post(StripeRouter.WEBHOOK_ENDPOINT, async (req, res, next) => {
            const context = req.context as IUserContext;

            const controller = Bootstrapper.getStripeWebhookController(context)
            let event;

            console.log(`Received web hook call.`);

            const result = await controller.handleEvent(req.body);

            res.json(result);
        });
    }
}