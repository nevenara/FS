import { Bootstrapper } from "../../bootstrapper";
import { ConfigService } from "../../common/config-service";
import { ValidationError } from "../../common/errors/validation-error";
import { Hashing } from "../../common/hashing";
import { IUserContext } from "../../common/user-context";
import { ExpressAppWrapper } from "../../http/express-app-wrapper";
import { LocalisationKey } from "../../localisation/localisation-key";
import { SendDeadlineEmailsResponse } from "./models/send-deadline-emails-response";
import { ITicketAssignmentDeadlinesController } from "./ticket-assignment-deadlines-controller";

export class TicketAssignmentDeadlinesRouter {
    public static SEND_DEADLINE_EMAILS_API_URL = '/cron/ticketassignment/senddeadlineemails';

    constructor(private readonly expressApp: ExpressAppWrapper,
                private configService: ConfigService){}

    public registerRoutes(): void {
        this.expressApp.get(TicketAssignmentDeadlinesRouter.SEND_DEADLINE_EMAILS_API_URL, async (req, res) => {
            const context = req.context as IUserContext;
            const CRON_API_KEY = await this.configService.getConfig("cronApiKey");

            if(!req.headers['api-key'] || req.headers['api-key'] != CRON_API_KEY){
                throw new ValidationError(LocalisationKey.BadCronApiKey);
            }
            const controller: ITicketAssignmentDeadlinesController = Bootstrapper.getTicketAssignmentDeadlinesController(context);
            const response: SendDeadlineEmailsResponse = await controller.sendDeadlineEmails();

            res.json(response);
        });
    }
}