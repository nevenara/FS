import { Bootstrapper } from "../../bootstrapper";
import { IUserContext } from "../../common/user-context";
import { ExpressAppWrapper } from "../../http/express-app-wrapper";
import { IDashboardController } from "./dashboard-controller";
import { GetIncomingTicketsPerOrganizerResponse } from "./models/get-incoming-tickets-per-organizer-response";
import { GetIncomingTicketsVsPersonalizedTicketsResponse } from "./models/get-incoming-tickets-vs-personalized-tickets-response";
import { GetIncomingTicketsVsPersonalizedTicketsRequest } from "./models/get-incoming-tickets-vs-personlized-tickets-request";
import { GetTotalResponse } from "./models/get-total-reponse";
import { GetUsersRegisteredVsUsersVerifiedRequest } from "./models/get-users-registered-vs-users-verified-request";
import { GetUsersRegisteredVsUsersVerifiedResponse } from "./models/get-users-registred-vs-users-verified-response";

export class DashboardRouter {
    public static GET_TOTAL_USERS_REGISTERED_URL = '/dashboard/userstatistics/totalusersregistered';
    public static GET_TOTAL_USERS_VERIFIED_URL = '/dashboard/userstatistics/totalusersverified';
    public static GET_TOTAL_USERS_VERIFIED_BANK_ACCOUNT_URL = '/dashboard/userstatistics/totalusersverifiedinclbankaccount';
    public static GET_TOTAL_MAIN_ACCOUNTS_WITH_LINKED_ACCOUNTS_URL = '/dashboard/userstatistics/totalmainaccountswithlinkedaccounts';
    public static GET_TOTAL_LINKED_ACCOUNT_USERS_URL = '/dashboard/userstatistics/totallinkedaccounts';
    public static GET_TOTAL_LINKED_ACCOUNT_USERS_WITH_PASSWORD_URL = '/dashboard/userstatistics/totallinkedaccountswithpassword';
    
    public static GET_TOTAL_INCOMING_TICKETS_URL = '/dashboard/ticketstatistics/totalincomingtickets';
    public static GET_TOTAL_PERSONALIZED_TICKETS_URL = '/dashboard/ticketstatistics/totalpersonalizedtickets';
    
    public static GET_TOTAL_ACTIVE_ORGANIZERS_URL = '/dashboard/organizerstatistics/totalactiveorganizers';

    public static GET_USERS_REGISTERED_VS_USERS_VERIFIED_URL = '/dashboard/usersregisteredvsusersverified';

    public static GET_INCOMING_TICKETS_VS_PERSONALIZED_TICKETS_URL = '/dashboard/incomingticketsvspersonalizedtickets';

    public static GET_INCOMING_TICKETS_PER_ORGANIZER_URL = '/dashboard/incomingticketsperorganizer';

    constructor(private readonly expressApp: ExpressAppWrapper){}

    public registerRoutes(): void {
        this.expressApp.get(DashboardRouter.GET_TOTAL_USERS_REGISTERED_URL, async (req, res, next) => {
            const context = req.context as IUserContext;

            const controller: IDashboardController = Bootstrapper.getDashboardController(context);
            const response: GetTotalResponse = await controller.getTotalUsersRegistered();

            res.json(response);
        });
        
        this.expressApp.get(DashboardRouter.GET_TOTAL_USERS_VERIFIED_BANK_ACCOUNT_URL, async (req, res, next) => {
            const context = req.context as IUserContext;

            const controller: IDashboardController = Bootstrapper.getDashboardController(context);
            const response: GetTotalResponse = await controller.getTotalUsersVerifiedInclBankAccount();

            res.json(response);
        });
        
        this.expressApp.get(DashboardRouter.GET_TOTAL_USERS_VERIFIED_URL, async (req, res, next) => {
            const context = req.context as IUserContext;

            const controller: IDashboardController = Bootstrapper.getDashboardController(context);
            const response: GetTotalResponse = await controller.getTotalUsersVerified();

            res.json(response);
        });

        this.expressApp.get(DashboardRouter.GET_TOTAL_MAIN_ACCOUNTS_WITH_LINKED_ACCOUNTS_URL, async (req, res, next) => {
            const context = req.context as IUserContext;

            const controller: IDashboardController = Bootstrapper.getDashboardController(context);
            const response: GetTotalResponse = await controller.getTotalMainAccountsWithLinkedAccounts();

            res.json(response);
        });

        this.expressApp.get(DashboardRouter.GET_TOTAL_LINKED_ACCOUNT_USERS_URL, async (req, res, next) => {
            const context = req.context as IUserContext;

            const controller: IDashboardController = Bootstrapper.getDashboardController(context);
            const response: GetTotalResponse = await controller.getTotalLinkedAccountsUsers();

            res.json(response);
        });

        this.expressApp.get(DashboardRouter.GET_TOTAL_LINKED_ACCOUNT_USERS_WITH_PASSWORD_URL, async (req, res, next) => {
            const context = req.context as IUserContext;

            const controller: IDashboardController = Bootstrapper.getDashboardController(context);
            const response: GetTotalResponse = await controller.getTotalLinkedAccountsWithPassword();

            res.json(response);
        });

        this.expressApp.get(DashboardRouter.GET_TOTAL_INCOMING_TICKETS_URL, async (req, res, next) => {
            const context = req.context as IUserContext;

            const controller: IDashboardController = Bootstrapper.getDashboardController(context);
            const response: GetTotalResponse = await controller.getTotalIncomingTickets();

            res.json(response);
        });

        this.expressApp.get(DashboardRouter.GET_TOTAL_PERSONALIZED_TICKETS_URL, async (req, res, next) => {
            const context = req.context as IUserContext;

            const controller: IDashboardController = Bootstrapper.getDashboardController(context);
            const response: GetTotalResponse = await controller.getTotalPersonalizedTickets();

            res.json(response);
        });

        this.expressApp.get(DashboardRouter.GET_TOTAL_ACTIVE_ORGANIZERS_URL, async (req, res, next) => {
            const context = req.context as IUserContext;

            const controller: IDashboardController = Bootstrapper.getDashboardController(context);
            const response: GetTotalResponse = await controller.getTotalActiveOrganizers();

            res.json(response);
        });

        this.expressApp.post(DashboardRouter.GET_USERS_REGISTERED_VS_USERS_VERIFIED_URL, async (req, res, next) => {
            const context = req.context as IUserContext;
            const request = new GetUsersRegisteredVsUsersVerifiedRequest();
            request.fromDate = req.body.fromDate;
            request.toDate = req.body.toDate;

            const controller: IDashboardController = Bootstrapper.getDashboardController(context);
            const response: GetUsersRegisteredVsUsersVerifiedResponse = await controller.getUsersRegisteredVsUsersVerified(request);

            res.json(response);
        });

        this.expressApp.post(DashboardRouter.GET_INCOMING_TICKETS_VS_PERSONALIZED_TICKETS_URL, async (req, res, next) => {
            const context = req.context as IUserContext;
            const request = new GetIncomingTicketsVsPersonalizedTicketsRequest();
            request.fromDate = req.body.fromDate;
            request.toDate = req.body.toDate;

            const controller: IDashboardController = Bootstrapper.getDashboardController(context);
            const response: GetIncomingTicketsVsPersonalizedTicketsResponse = await controller.getIncomingTicketsVsPersonalizedTickets(request);

            res.json(response);
        });

        this.expressApp.get(DashboardRouter.GET_INCOMING_TICKETS_PER_ORGANIZER_URL, async (req, res, next) => {
            const context = req.context as IUserContext;

            const controller: IDashboardController = Bootstrapper.getDashboardController(context);
            const response: GetIncomingTicketsPerOrganizerResponse = await controller.getIncomingTicketsPerOrganizer();

            res.json(response);
        });


    }
}