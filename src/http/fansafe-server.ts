import { ExpressAppWrapper } from "./express-app-wrapper";
import { Bootstrapper } from "../bootstrapper";
import { UserContext } from "../common/user-context";
import { CookieName } from "./cookie-name";
import { IAppLogger } from "../common/app-logger";
import { Environment } from "../environment";
import { getUUID } from "../db/uuid";
import moment = require("moment");
import { serializeError } from "serialize-error";
import { NotAuthenticatedError } from "../common/errors/not-authenticated-error";
import { PaymentRouter } from "../payment/payment-router";
import { EventCalendarRouter } from "../event-calendar/event-calendar-router";
import { ConfigsRouter } from "../admin/configs/configs-router";
import { TicketAssignmentDeadlinesRouter } from "../cron/ticket-assignment-deadlines/ticket-assignment-deadlines-router";
import { SupportPageRouter } from "../support-page/support-page-router";
import { DashboardRouter } from "../admin/dashboard/dashboard-router";
import { StripeRouter } from "../stripe/stripe-router";
import { ReportsDataGeneratorRouter } from "../admin/dashboard/reports-data-generator-router";
import { LocalisationRouter } from "../localisation/localisation-router";
import { UserManagementRouter } from "../admin/user-management/user-management-router";
const express = require("express");
const cookieParser = require("cookie-parser");
var cors = require('cors');

export class FansafeServer {
    private instanceId: string;
    private startTime: any;

    constructor(protected expressApp) {
    }

    public async start(): Promise<void> {
        this.instanceId = getUUID();
        this.startTime = moment().format();

        this.enableCors();
        this.expressApp.use(express.json());
        this.expressApp.use(express.urlencoded({ extended: true }));
        this.expressApp.use(cookieParser());
        this.expressApp.use(async (req, res, next) => {
            await this.initUserContext(req, res, next)
        });
        this.expressApp.use(async (req, res, next) => {
            await this.initScannerContext(req, res, next)
        });

        this.registerRoutes();
        this.handle404Error();
        this.handleAllErrors();

        this.createServer();
    }

    private enableCors() {
        var whitelist = Environment.getCorsWhiteList();
        var corsOptions = {
            origin: function (origin, callback) {
                if (!origin || whitelist.indexOf(origin) !== -1) {
                    callback(null, true);
                } else {
                    callback(new Error('Not allowed by CORS'));
                }
            },
            credentials: true
        }

        this.expressApp.use(cors(corsOptions));
    }

    private async initUserContext(req: any, res: any, next: any) {
        req.xRequestId = getUUID();

        const userContextFactory = Bootstrapper.getUserContextFactory();

        req.context = await userContextFactory.getUserContext(req.cookies[CookieName.session]);

        next();
    }

    private async initScannerContext(req: any, res: any, next: any) {
        req.xRequestId = getUUID();

        const userContextFactory = Bootstrapper.getScannerContextFactory();

        req.scannerContext = await userContextFactory.getScannerContext(req.cookies[CookieName.session]);

        next();
    }

    private registerRoutes() {

        this.expressApp.get('/', async (req, res, next) => {
            res.json({ msg: `Fansafe Server is running. ${this.instanceId}  ${this.startTime}` });
        });

        this.expressApp.get('/test', async (req, res, next) => {
            res.json({ msg: `Fansafe Server is running. ${this.instanceId}  ${this.startTime}` });
        });

        const authenticationRouter = Bootstrapper.getAuthenticationRouter(this.expressApp);
        authenticationRouter.registerRoutes();

        const registrationRouter = Bootstrapper.getRegistrationRouter(this.expressApp);
        registrationRouter.registerRoutes();

        const additionalEmailsRouter = Bootstrapper.getAdditionalEmailsRouter(this.expressApp);
        additionalEmailsRouter.registerRoutes();

        const userProfileRouter = Bootstrapper.getUserProfileRouter(this.expressApp);
        userProfileRouter.registerRoutes();

        const linkedAccountsRouter = Bootstrapper.getLinkedAccountsRouter(this.expressApp);
        linkedAccountsRouter.registerRoutes();

        const adminSettingsRouter = Bootstrapper.getAdminSettingsRouter(this.expressApp);
        adminSettingsRouter.registerRoutes();

        const passwordRecoveryRouter = Bootstrapper.getPasswordRecoveryRouter(this.expressApp);
        passwordRecoveryRouter.registerRoutes();

        const blacklistedEmailsRouter = Bootstrapper.getBlacklistedEmailsRouter(this.expressApp);
        blacklistedEmailsRouter.registerRoutes();

        const ticketsRouter = Bootstrapper.getTicketRouter(this.expressApp);
        ticketsRouter.registerRoutes();

        const organizersRouter = Bootstrapper.getOrganizersRouter(this.expressApp);
        organizersRouter.registerRoutes();

        const paymentRouter: PaymentRouter = Bootstrapper.getPaymentRouter(this.expressApp);
        paymentRouter.registerRoutes();

        const eventCalendarRouter: EventCalendarRouter = Bootstrapper.getEventCalendarRouter(this.expressApp);
        eventCalendarRouter.registerRoutes();

        const configsRouter: ConfigsRouter = Bootstrapper.getConfigsRouter(this.expressApp);
        configsRouter.registerRoutes();

        const ticketAssignmentDeadlinesRouter: TicketAssignmentDeadlinesRouter = Bootstrapper.getTicketAssignmentDeadlinesRouter(this.expressApp);
        ticketAssignmentDeadlinesRouter.registerRoutes();

        const supportPageRouter: SupportPageRouter = Bootstrapper.getSupportPageRouter(this.expressApp);
        supportPageRouter.registerRoutes();

        const dashboardRouter: DashboardRouter = Bootstrapper.getDashboardRouter(this.expressApp);
        dashboardRouter.registerRoutes();

        const stripeRouter: StripeRouter = Bootstrapper.getStripeRouter(this.expressApp);
        stripeRouter.registerRoutes();

        const reportsDataGeneratorRouter: ReportsDataGeneratorRouter =
            Bootstrapper.getReportsDataGeneratorRouter(this.expressApp);

        reportsDataGeneratorRouter.registerRoutes();

        const localisationRouter: LocalisationRouter = Bootstrapper.getLocalisationRouter(this.expressApp);
        localisationRouter.registerRoutes();

        const userManagementRouter: UserManagementRouter = Bootstrapper.getUserManagementRouter(this.expressApp);
        userManagementRouter.registerRoutes();

        const proxyRouter = Bootstrapper.getProxyRouter(this.expressApp);
        proxyRouter.registerRoutes();

        const scannerRouter = Bootstrapper.getScannerRouter(this.expressApp);
        scannerRouter.registerRoutes();
    }

    private handle404Error(): void {
        // Handle 404
        this.expressApp.use((req, res) => {
            const logger: IAppLogger = Bootstrapper.getAppLogger();
            logger.log(`Page not found ${req.path} ${this.getServiceName()}`);
            res.status(404).send(`Page not found. ${this.getServiceName()}`);
        });
    }

    private handleAllErrors(): void {
        this.expressApp.use((error, req, res, next) => {
            error.guid = req.xRequestId;

            error.httpContext = {
                host: req.hostname,
                originalUrl: req.originalUrl,
                params: req.params,
                body: req.body,
            };

            error.userContext = req.context;

            const serializedError = serializeError(error);
            const logger: IAppLogger = Bootstrapper.getAppLogger(req.xRequestId);

            const logData = JSON.stringify(serializedError);
            logger.error(logData);
            //WE ARE USING LOG HERE TEMPORARY BECAUSE AMAZON IS NOT displaying error messages.
            logger.log(logData)

            let responseMessage: string = "";

            responseMessage =
                error.clientmessage || `Internal Server Error.`;

            if (error instanceof NotAuthenticatedError) {
                res.setHeader('x-authentication', error.message);
            }

            const response: any = {
                message: responseMessage + ` Ref Number: ${error.guid}`,
                stack: error && error.stack,
                logData: logData
                // stack: (!Environment.isProductionMode() && error && error.stack) || "",
            };

            res.status(error.statusCode || 500).send(response);
        });
    }

    private createServer() {
        this.expressApp.listen(Environment.getAppPort());
        console.log(`Server started on port ${Environment.getAppPort()}.`);
    }

    private getServiceName(): string {
        return 'Fansafe Server.'
    }
}