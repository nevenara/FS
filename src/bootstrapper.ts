import { AuthenticationRouter } from "./basic-auth/authentication-router";
import { ExpressAppWrapper } from "./http/express-app-wrapper";
import { IAuthenticationController, AuthenticationController } from "./basic-auth/authentication-controller";
import { IAuthentcationRepository, AuthenticationRepository } from "./basic-auth/authentication-repository";
import { DbConnector } from "./db/db-connector";
import { AppLogger, IAppLogger } from "./common/app-logger";
import { IRegistrationController, RegistrationController } from "./registration/registration-controller";
import { UserRepository, IUserRepository } from "./user/user-repository";
import { RegistrationRouter } from "./registration/registration-router";
import { RegistrationValidator } from "./registration/registration-validator";
import { LocalisationProvider } from "./localisation/localisation-provider";
import { CookieManager } from "./http/cookie-manager";
import { ISessionStore, SessionStore } from "./http/session/session-store";
import * as Redis from "ioredis";
import { RedisClientWrapper, IRedisClientWrapper } from "./common/caching/redis-client-wrapper";
import { IRedisClientFactory, RedisClientFactory } from "./common/caching/redis-client-factory";
import { PRIORITY_HIGHEST } from "constants";
import { IProfileImageRepository, ProfileImageRepository } from "./profile-image/profile-image-repository";
import { UserContextFactory } from "./common/user-context-factory";
import { IUserContext } from "./common/user-context";
import { IAdditionalEmailsController, AdditionalEmailsController } from "./additional-emails/additional-emails-controller";
import { AdditionalEmailsRouter } from "./additional-emails/additional-emails-router";
import { UserAdditionalEmailsRepository, IUserAdditionalEmailsRepository } from "./additional-emails/user-additional-emails-repository";
import { AdditionalEmailsValidator } from "./additional-emails/additional-emails-validator";
import { IUserProfileController, UserProfileController } from "./user-profile/user-profile-controller";
import { UserProfileValidator, IUserProfileValidator } from "./user-profile/user-profile-validator";
import { UserProfileRouter } from "./user-profile/user-profile-router";
import { ILinkedAccountsController, LinkedAccountsController } from "./linked-accounts/linked-accounts-controller";
import { LinkedAccountsValidator } from "./linked-accounts/linked-accounts-validator";
import { LinkedAccountsRouter } from "./linked-accounts/linked-accounts-router";
import { IAdminSettingsValidator, AdminSettingsValidator } from "./admin/admin-settings/admin-settings-validator";
import { IAdminSettingsController, AdminSettingsController } from "./admin/admin-settings/admin-settings-controller";
import { AdminSettingsRouter } from "./admin/admin-settings/admin-settings-router";
import { IPasswordRecoveryController, PasswordRecoveryController } from "./password-recovery/password-recovery-controller";
import { PasswordRecoveryRouter } from "./password-recovery/password-recovery-router";
import { IPasswordRecoveryValidator, PasswordRecoveryValidator } from "./password-recovery/password-recovery-validator";
import { IBlacklistedEmailsController, BlacklistedEmailsController } from "./blacklisted-emails/blacklisted-emails-controller";
import { IBlacklistedEmailsRepository, BlacklistedEmailsRepository } from "./blacklisted-emails-db/blacklisted-emails-repository";
import { IBlacklistedEmailsValidator, BlacklistedEmailsValidator } from "./blacklisted-emails/blacklisted-emails-validator";
import { BlacklistedEmailsRouter } from "./blacklisted-emails/blacklisted-emails-router";
import { IPasswordRecoveryRequestRepository, PasswordRecoveryRequestRepository } from "./password-recovery/password-recovery-request-repository";
import { EmailSender, IEmailSender } from "./common/email-service/email-sender";
import { ITicketController, TicketController } from "./tickets/ticket-controller";
import { ITicketRepository, TicketRepository } from "./tickets/ticket-repository";
import { ITicketValidator, TicketValidator } from "./tickets/ticket-validator";
import { TicketsRouter } from "./tickets/tickets-router";
import { TicketPlaceholderImageRepository, ITicketPlaceholderImageRepository } from "./ticket-placeholder-image/ticket-placeholder-image-repository";
import { SearchTicketController } from "./tickets/search-ticket-controller";
import { ITicketSaleController, TicketSaleController } from "./tickets/ticket-sale-controller";
import { IBuyTicketController, BuyTicketController } from "./tickets/buy-ticket-controller";
import { IOrganizerRepository, OrganizerRepository } from "./organizer/organizer-repository";
import { IOrganizersController, OrganizersController } from "./admin/organizers/organizers-controller";
import { IOrganizerValidator, OrganizerValidator } from "./admin/organizers/organizers-validator";
import { OrganizersRouter } from "./admin/organizers/organizers-router";
import { PaymentSettingsController } from "./payment/payment-settings-controller";
import { IStripeFactory, StripeFactory } from "./stripe/stripe-factory";
import { CountryIsoCodeProvider, ICountryIsoCodeProvider } from "./common/country-iso-code-provider";
import { PaymentRouter } from "./payment/payment-router";
import { ISearchUserController, SearchUserController } from "./user-profile/search-user-controller";
import { StripeWebhookController } from "./stripe/stripe-webhook-controller";
import { IRepersonalizeTicketController, RepersonalizeTicketController } from "./tickets/re-personalize-ticket-controller";
import { ITicketPersonalizationController, TicketPersonalizationController } from "./tickets/ticket-personalization-controller";
import { IRegistrationFlow, RegistrationFlow } from "./registration/registration-flow";
import { IdVerificationController, IIdVerificationController } from "./registration/id-verification-controller";
import { IdVerificationFlow, IIdVerificationFlow } from "./registration/id-verification-flow";
import { ITicketService, TicketService } from "./tickets/ticket-service";
import { AcceptServiceAgreementFlow } from "./registration/accept-service-agreement-flow";
import { StripeErrorsTranslator } from "./registration/stripe-errors-translator";
import { ITicketTransactionRepository, TicketTransactionRepository } from "./ticket-transactions/ticket-transaction-repository";
import { TicketTransactionDbObject } from "./ticket-transactions/ticket-transaction-db-object";
import { EventCalendarController, IEventCalendarController } from "./event-calendar/event-calendar-controller";
import { EventCalendarRouter } from "./event-calendar/event-calendar-router";
import { PaymentVerificationFlow } from "./payment/payment-verification-flow";
import { CalendarExportService, ICalendarExportService } from "./common/calendar-export-service";
import { PaymentController } from "./payment/payment-controller";
import { BuyTicketFlow } from "./payment/buy-ticket-flow";
import { ConfigsCountroller, IConfigsController } from "./admin/configs/configs-controller";
import { ConfigService } from "./common/config-service";
import { ConfigRepository, IConfigRepository } from "./config/config-repository";
import { ConfigsRouter } from "./admin/configs/configs-router";
import { ISessionLogRepository, SessionLogRepository } from "./session-log/session-log-repository";
import { IUserActivityLogRepository, UserActivityLogRepository } from "./user-activity-log/user-activity-log-repository";
import { IUserActivityLogService, UserActivityLogService } from "./user-activity-log/user-activity-log-service";
import { IInvalidIdCheckRepository, InvalidIdCheckRepository } from "./invalid-id-checks/invalid-id-check-repository";
import { IShoppingCartFactory, ShoppingCartFactory } from "./payment/shopping-cart-factory";
import { IShoppingCartRepository, ShoppingCartRepository } from "./payment/shopping-cart-repository";
import { ITicketAssignmentDeadlinesController, TicketAssignmentDeadlinesCountroller } from "./cron/ticket-assignment-deadlines/ticket-assignment-deadlines-controller";
import { ITicketAssignmentDeadlineRepository, TicketAssignmentDeadlineRepository } from "./ticket-assignment-deadlines/ticket-assignment-deadline-repository";
import { TicketAssignmentDeadlinesRouter } from "./cron/ticket-assignment-deadlines/ticket-assignment-deadlines-router";
import { FaceRecognitionService, IFaceRecognitionService } from "./registration/face-recognition-service";
import { AzureFaceClient, IAzureFaceClient } from "./common/azure-client";
import { ISelfieImageRepository, SelfieImageRepository } from "./selfie-image/selfie-image-repository";
import { FAQRepository, IFAQRepository } from "./faq/faq-repository";
import { SupportPageRouter } from "./support-page/support-page-router";
import { ISupportPageController, SupportPageController } from "./support-page/support-page-controller";
import { DashboardController, IDashboardController } from "./admin/dashboard/dashboard-controller";
import { DashboardRouter } from "./admin/dashboard/dashboard-router";
import { StripeRouter } from "./stripe/stripe-router";
import Stripe from "stripe";
import { IUsersRegisteredVsUsersVerifiedPerYearReportResultRepository, UsersRegisteredVsUsersVerifiedPerYearReportResultRepository } from "./report-results/users-registered-vs-users-verified-per-year/users-registered-vs-users-verified-per-year-report-result-repository";
import { IIncomingTicketsVsPersonalizedTicketsPerYearReportResultRepository, IncomingTicketsVsPersonalizedTicketsPerYearReportResultRepository } from "./report-results/incoming-tickets-vs-personalized-tickets-per-year/incoming-tickets-vs-personalized-tickets-per-year-report-result-repository";
import { IReportsDataGeneratorController, ReportsDataGeneratorController } from "./admin/dashboard/reports-data-generator-contoller";
import { ReportsDataGeneratorRouter } from "./admin/dashboard/reports-data-generator-router";
import { ExportTicketController, IExportTicketController } from "./tickets/export-ticket-controller";
import { IIncomingTicketsPerOrganizerReportResultRepository, IncomingTicketsPerOrganizerReportResultRepository } from "./report-results/incoming-tickets-per-organizer/incoming-tickets-per-organizer-report-result-repository";
import { ExportPdfTicketController } from "./tickets/export-pdf-ticket-controller";
import { ITicketSyncEventCreationProcess, TicketSyncEventCreationProcess } from "./events/ticket-sync-event-creation-process";
import { EventRepository } from "./events/event-repository";
import { ExportUsersController, IExportUsersController } from "./user-profile/export-users-controller";
import { ExportPdfUsersController } from "./user-profile/export-pdf-users-controller";
import { EventController, IEventController } from "./events/event-controller";
import { AdminTicketController } from "./tickets/admin-ticket-controller";
import { AdminUsersController, IAdminUsersController } from "./user-profile/admin-users-controller";
import { SessionController } from "./basic-auth/session-controller";
import { StripeAccountStatusUpdater } from "./stripe/stripe-account-status-updater";
import { ISearchOrganizersController, SearchOrganizersController } from "./admin/organizers/search-organizers-controller";
import { ExportOrganizersController, IExportOrganizersController } from "./admin/organizers/export-organizers-controller";
import { ExportPdfOrganizersController } from "./admin/organizers/export-pdf-organizers-controller";
import { CountryListProvider, ICountryListProvider } from "./common/country-list-provider";
import { IOrganizerPlaceholderImageRepository, OrganizerPlaceholderImageRepository } from "./organizer-placeholder-image/organizer-placeholder-image-repository";
import { ILocalisationController, LocalisationController } from "./localisation/localisation-controller";
import { LocalisationRouter } from "./localisation/localisation-router";
import { FAQUSerRepository, IFAQUserRepository } from "./faq/faq-user-repository";
import { TranslationDataProvider } from "./localisation/translation-data-provider";
import { AuthenticationService } from "./basic-auth/authentication-service";
import { ITicketPriceCalculator, TicketPriceCalculator } from "./payment/ticket-price-calculator";
import { StripePaymentIntentStatusChangeHandler } from "./stripe/stripe-handle-payment-status-change-handler";
import { IUserManagementController, UserManagementController } from "./admin/user-management/user-management-controller";
import { UserManagementRouter } from "./admin/user-management/user-management-router";
import { ExportUserManagementController, IExportUserManagementController } from "./admin/user-management/export-user-management-controller";
import { ExportPdfUserManagementController } from "./admin/user-management/export-pdf-user-management-controller";
import { IUserManagementValidator, UserManagementValidator } from "./admin/user-management/user-management-validator";
import { ExportChangeHistoryController, IExportChangeHistoryController } from "./tickets/export-change-history-controller";
import { ExportPdfChangeHistoryController } from "./tickets/export-pdf-change-history-controller";
import { RepersonalizeTicketFlow } from "./payment/repersonalize-ticket-flow";
import { IImageCompressor, ImageCompressor } from "./common/image-helper";
import { IOrganizerSupportController, OrganizerSupportController } from "./admin/organizers/organizer-support-controller";
import { OrganizerSupportResponse } from "./admin/organizers/models/search-organizer-support-response";
import { ExportOrganizersTicketsController, IExportOrganizersTicketsController } from "./admin/organizers/export-organizers-ticket-list-controller";
import { IOrganizerAdminPanelController, OrganizerAdminPanelController } from "./admin/organizers/organizer-admin-panel-controller";
import { ISeatPlanRepository, SeatPlanRepository } from "./events/seat-plan/seat-plan-repository";
import { ProxyController } from "./proxy/proxy-controller";
import { ProxyRouter } from "./proxy/proxy-router";
import { IOrganizersBillingController, OrganizersBillingController } from "./admin/organizers/organizers-billing-controller";
import { TicketPriceController } from "./payment/ticket-price-controller";
import { ExportOrganizersBillingController, IExportOrganizersBillingController } from "./admin/organizers/export-organizers-billing-controller";
import { IQRUrlParamsRepository, QRUrlParamsRepository } from "./qr-url-params/qr-url-params-repository";
import { IQRUrlParamsController, QRUrlParamsController } from "./qr-url-params/qr-url-params-controller";
import { IScannerController, ScannerController } from "./scanner/scanner-controller";
import { ScannerRouter } from "./scanner/scanner-router";
import { CheckInRepository, ICheckInRepository } from "./check-in-list/check-in-repository";
import { ScannerContextFactory } from "./common/scanner-context-factory";
import { IScannerContext } from "./common/scanner-context";

export class Bootstrapper {


    private static redisClientFactory: RedisClientFactory;
    private static redisClient: RedisClientWrapper;
    private static translationDataProvider: TranslationDataProvider;
    private static globalLoggerInstance: IAppLogger;

    public static async init() {

        this.globalLoggerInstance = new AppLogger();
        const dbConnector = this.getDbConnector();

        await dbConnector.connectDb(this.getAppLogger());

        this.translationDataProvider = new TranslationDataProvider(this.globalLoggerInstance);

        await this.translationDataProvider.init();

        this.redisClientFactory = new RedisClientFactory(this.getAppLogger());
        this.redisClient = new RedisClientWrapper(this.getAppLogger(), this.redisClientFactory, this.getLocalisationProvider());
    }

    static getTicketPriceController(context: IUserContext): TicketPriceController {
        return new TicketPriceController(this.getTicketRepository(), this.getTicketPriceCalculator(), context, this.getLocalisationProvider(context));
    }

    public static getProxyRouter(expressApp: any){
        return new ProxyRouter(new ExpressAppWrapper(expressApp));
    }

    public static getProxyController(context: IUserContext) {
        return new ProxyController(
            context,
            this.getSessionStore(),
            this.getUserRepository());
    }

    public static getUserManagementController(context: IUserContext): IUserManagementController {
        return new UserManagementController(
            context,
            this.getUserRepository(),
            this.getUserManagementValidator(context),
            this.getConfigService(),
            this.getLocalisationProvider(context)
        );
    }

    public static getUserManagementValidator(context: IUserContext): IUserManagementValidator {
        return new UserManagementValidator(
            this.getUserRepository(),
            this.getUserAdditionalEmailsRepository(),
            this.getBlacklistedEmailsRepository(),
            context,
            this.getLocalisationProvider(context)
        );
    }

    public static getUserManagementRouter(expressApp: any): UserManagementRouter {
        return new UserManagementRouter(new ExpressAppWrapper(expressApp));
    }


    public static getReportsDataGeneratorController(): IReportsDataGeneratorController {
        return new ReportsDataGeneratorController(
            this.getUserActivityLogRepository(),
            this.getUsersRegisteredVsUsersVerifiedPerYearReportResultRepository(),
            this.getIncomingTicketsVsPersonalizedTicketsPerYearReportResultRepository(),
            this.getIncomingTicketsPerOrganizerReportResultRepository(),
            this.getTicketTransactionRepository()
        )
    }

    public static getAdminTicketController(context: IUserContext) {
        return new AdminTicketController(
            context,
            this.getTicketRepository(),
            this.getConfigService(),
            this.getEventRepository(),
            this.getUserRepository(),
            this.getOrganizerRepository(),
            this.getLocalisationProvider(context))
    }

    public static getAdminUsersController(context: IUserContext): IAdminUsersController {
        return new AdminUsersController(
            context,
            this.getUserRepository(),
            this.getUserActivityLogRepository(),
            this.getUserAdditionalEmailsRepository(),
            this.getProfileImageRepository(),
            this.getUserActivityLogService(context),
            this.getUserProfileValidator(context),
            this.getEmailSender(),
            this.getStripeFactory(),
            this.getRegistrationFlow(context),
            this.getLinkedAccountsValidator(context),
            this.getTicketRepository(),
            this.getLocalisationProvider(context)
        );
    }

    public static getRedis(redisOptions: Redis.RedisOptions) {
        return new Redis(redisOptions);
    }

    public static getCookieManager() {
        return new CookieManager();
    }

    public static getDbConnector() {
        return new DbConnector();
    }

    public static getAppLogger(guid?: string) {
        return new AppLogger(guid);
    }

    public static getStripeRouter(expressApp: any): StripeRouter {
        return new StripeRouter(new ExpressAppWrapper(expressApp));
    }

    public static getReportsDataGeneratorRouter(expressApp): ReportsDataGeneratorRouter {
        return new ReportsDataGeneratorRouter(new ExpressAppWrapper(expressApp));
    }

    public static getEventController(context: IUserContext): IEventController {
        return new EventController(this.getEventRepository(), this.getConfigService(), this.getSeatPlanRepository(), this.getImageCompressor(), this.getOrganizerRepository(), this.getLocalisationProvider(context), context);
    }

    public static getOrganizersBillingController(context: IUserContext): IOrganizersBillingController {
        return new OrganizersBillingController(
            context,
            this.getEventRepository(),
            this.getOrganizerRepository(),
            this.getTicketRepository(),
            this.getConfigService()
        );
    }

    public static getSeatPlanRepository(): ISeatPlanRepository {
        return new SeatPlanRepository();
    }

    public static getRegistrationController(context: IUserContext): IRegistrationController {
        return new RegistrationController(
            context,
            this.getUserRepository(),
            this.getUserAdditionalEmailsRepository(),
            this.getTicketRepository(),
            this.getUserActivityLogService(context),
            this.getRegistrationValidator(context),
            this.getEmailSender(),
            this.getSessionStore(),
            this.getLocalisationProvider(context),
            this.getRegistrationFlow(context),
            this.getTicketService(context),
            this.getAcceptServiceAgreementFlow(context),
            this.getAuthenticationService(),
            this.getRedisClientWrapper());
    }

    public static getAcceptServiceAgreementFlow(context: IUserContext) {
        return new AcceptServiceAgreementFlow(this.getStripeFactory(), context);
    }

    public static getIdVerificationController(context: IUserContext): IIdVerificationController {
        return new IdVerificationController(
            context,
            this.getUserRepository(),
            this.getIdVerificationFlow(context),
            this.getLocalisationProvider(context)
        )
    }
    static getIdVerificationFlow(context: IUserContext): IdVerificationFlow {
        return new IdVerificationFlow(
            this.getStripeFactory(),
            this.getFaceRecognitionService(),
            this.getUserRepository(),
            this.getSelfieImageRepository(),
            this.getUserActivityLogService(context),
            this.getTicketService(context),
            this.getImageCompressor(),
            this.getStripeErrorsTranslator(),
            this.getLocalisationProvider());
    }

    public static getFaceRecognitionService(): IFaceRecognitionService {
        return new FaceRecognitionService(this.getAzureFaceClient(), this.getLocalisationProvider());
    }

    public static getAzureFaceClient(): IAzureFaceClient {
        return new AzureFaceClient();
    }

    public static getStripeErrorsTranslator() {
        return new StripeErrorsTranslator();
    }

    public static getRegistrationFlow(context: IUserContext): IRegistrationFlow {
        return new RegistrationFlow(
            context,
            this.getStripeFactory(),
            this.getCountryIsoCodeProvider());
    }

    public static getEmailSender(): IEmailSender {
        return new EmailSender(this.getConfigService());
    }

    public static getLocalisationProvider(userContext?: IUserContext) {
        return new LocalisationProvider(userContext, this.getTranslationDataProvider());
    }

    public static getTranslationDataProvider(): TranslationDataProvider {
        return this.translationDataProvider;
    }

    public static getLocalisationController(context: IUserContext): ILocalisationController {
        return new LocalisationController(this.getTranslationDataProvider(), context, this.getRedisClientWrapper());
    }

    public static getLocalisationRouter(expressApp): LocalisationRouter {
        return new LocalisationRouter(new ExpressAppWrapper(expressApp));
    }

    public static getUserContextFactory() {
        return new UserContextFactory(this.getSessionStore());
    }

    public static getRegistrationValidator(context: IUserContext) {
        return new RegistrationValidator(
            this.getUserRepository(),
            this.getUserAdditionalEmailsRepository(),
            this.getBlacklistedEmailsRepository(),
            context,
            this.getLocalisationProvider(context)
        );
    }

    public static getUserRepository() {
        return new UserRepository();
    }

    public static getAuthenticationController(context: IUserContext): IAuthenticationController {
        return new AuthenticationController(
            Bootstrapper.getUserRepository(),
            Bootstrapper.getSessionLogRepository(),
            Bootstrapper.getSessionStore(),
            context,
            this.getAuthenticationService(),
            this.getCountryIsoCodeProvider(),
            this.getLocalisationProvider(context));
    }

    public static getAuthenticationService() {
        return new AuthenticationService(
            this.getSessionLogRepository(),
            this.getSessionStore());
    }
    public static getSessionController(context: IUserContext): SessionController {
        return new SessionController(
            Bootstrapper.getStripeFactory(),
            Bootstrapper.getUserRepository(),
            Bootstrapper.getStripeAccountStatusUpdater(context),
            Bootstrapper.getSessionStore(),
            context);
    }

    public static getSessionStore(): ISessionStore {
        return new SessionStore(this.getRedisClientWrapper(), this.getLocalisationProvider());
    }

    public static getRedisClientWrapper(): IRedisClientWrapper {
        return this.redisClient;
    }

    public static getRedisClientFactory(): IRedisClientFactory {
        return this.redisClientFactory;
    }

    public static getAuthenticationRepository(): IAuthentcationRepository {
        return new AuthenticationRepository();
    }

    public static getAuthenticationRouter(expressApp): AuthenticationRouter {
        return new AuthenticationRouter(new ExpressAppWrapper(expressApp));
    }

    static getPaymentRouter(expressApp: any): PaymentRouter {
        return new PaymentRouter(new ExpressAppWrapper(expressApp));
    }

    public static getRegistrationRouter(expressApp: any) {
        return new RegistrationRouter(new ExpressAppWrapper(expressApp), this.getLocalisationProvider());
    }

    public static getProfileImageRepository(): IProfileImageRepository {
        return new ProfileImageRepository();
    }

    public static getAdditionalEmailsController(context: IUserContext): IAdditionalEmailsController {
        return new AdditionalEmailsController(
            context,
            this.getUserAdditionalEmailsRepository(),
            this.getUserRepository(),
            this.getTicketRepository(),
            this.getAdditionalEmailsValidator(context),
            this.getEmailSender(),
            this.getTicketService(context),
            this.getUserActivityLogService(context),
            this.getLocalisationProvider(context)
        );
    }

    public static getAdditionalEmailsRouter(expressApp: any) {
        return new AdditionalEmailsRouter(new ExpressAppWrapper(expressApp));
    }

    public static getUserAdditionalEmailsRepository(): IUserAdditionalEmailsRepository {
        return new UserAdditionalEmailsRepository();
    }

    public static getAdditionalEmailsValidator(context: IUserContext): AdditionalEmailsValidator {
        return new AdditionalEmailsValidator(
            this.getUserRepository(),
            this.getUserAdditionalEmailsRepository(),
            this.getBlacklistedEmailsRepository(),
            context,
            this.getLocalisationProvider(context)
        );
    }

    public static getUserProfileRouter(expressApp: any): UserProfileRouter {
        return new UserProfileRouter(new ExpressAppWrapper(expressApp), this.getLocalisationProvider());
    }

    public static getUserProfileController(context: IUserContext): IUserProfileController {
        return new UserProfileController(
            context,
            this.getUserRepository(),
            this.getUserAdditionalEmailsRepository(),
            this.getProfileImageRepository(),
            this.getUserProfileValidator(context),
            this.getUserActivityLogService(context),
            this.getUserActivityLogRepository(),
            this.getSelfieImageRepository(),
            this.getImageCompressor(),
            this.getTicketService(context),
            this.getLocalisationProvider()
        );
    }

    public static getImageCompressor(): IImageCompressor {
        return new ImageCompressor(this.getAppLogger());
    }
    public static getUserProfileValidator(context: IUserContext): IUserProfileValidator {
        return new UserProfileValidator(
            this.getUserRepository(),
            this.getUserAdditionalEmailsRepository(),
            this.getBlacklistedEmailsRepository(), 
            context,
            this.getLocalisationProvider(context)
        );
    }

    public static getLinkedAccountsController(context: IUserContext): ILinkedAccountsController {
        return new LinkedAccountsController(
            context,
            this.getUserRepository(),
            this.getProfileImageRepository(),
            this.getLinkedAccountsValidator(context),
            this.getTicketService(context),
            this.getUserActivityLogService(context),
            this.getRegistrationFlow(context),
            this.getIdVerificationFlow(context),
            this.getLocalisationProvider(context)
        );
    }

    public static getLinkedAccountsValidator(context: IUserContext): LinkedAccountsValidator {
        return new LinkedAccountsValidator(this.getUserRepository(), this.getConfigService(), context, this.getLocalisationProvider(context));
    }

    public static getLinkedAccountsRouter(expressApp: any): LinkedAccountsRouter {
        return new LinkedAccountsRouter(new ExpressAppWrapper(expressApp), this.getLocalisationProvider());
    }

    public static getAdminSettingsController(context: IUserContext): IAdminSettingsController {
        return new AdminSettingsController(
            context,
            this.getProfileImageRepository(),
            this.getOrganizerPlaceholderImageRepository(),
            this.getAdminSettingsValidator(context)
        );
    }

    public static getAdminSettingsValidator(context: IUserContext): IAdminSettingsValidator {
        return new AdminSettingsValidator(context, this.getLocalisationProvider(context));
    }

    public static getAdminSettingsRouter(expressApp: any): AdminSettingsRouter {
        return new AdminSettingsRouter(new ExpressAppWrapper(expressApp));
    }

    public static getPasswordRecoveryController(context: IUserContext): IPasswordRecoveryController {
        return new PasswordRecoveryController(
            this.getPasswordRecoveryRequestRepository(),
            this.getPasswordRecoveryValidator(context),
            this.getUserRepository(),
            this.getEmailSender(),
            this.getUserActivityLogService(context),
            this.getConfigService(),
            this.getLocalisationProvider()
        );
    }
    static getPasswordRecoveryRequestRepository(): IPasswordRecoveryRequestRepository {
        return new PasswordRecoveryRequestRepository();
    }

    public static getPasswordRecoveryValidator(context: IUserContext): IPasswordRecoveryValidator {
        return new PasswordRecoveryValidator(context, this.getLocalisationProvider(context));
    }

    public static getPasswordRecoveryRouter(expressApp: any): PasswordRecoveryRouter {
        return new PasswordRecoveryRouter(new ExpressAppWrapper(expressApp));
    }

    public static getBlacklistedEmailsController(context: IUserContext): IBlacklistedEmailsController {
        return new BlacklistedEmailsController(
            context,
            this.getBlacklistedEmailsRepository(),
            this.getBlacklistedEmailsValidator(context)
        );
    }

    public static getBlacklistedEmailsRepository(): IBlacklistedEmailsRepository {
        return new BlacklistedEmailsRepository();
    }

    public static getBlacklistedEmailsValidator(context: IUserContext): IBlacklistedEmailsValidator {
        return new BlacklistedEmailsValidator(this.getBlacklistedEmailsRepository(), context, this.getLocalisationProvider(context));
    }

    public static getBlacklistedEmailsRouter(expressApp: any): BlacklistedEmailsRouter {
        return new BlacklistedEmailsRouter(new ExpressAppWrapper(expressApp));
    }

    public static getTicketController(context: IUserContext): ITicketController {
        return new TicketController(
            context,
            this.getTicketRepository(),
            this.getUserRepository(),
            this.getUserAdditionalEmailsRepository(),
            this.getTicketPlaceholderImageRepository(),
            this.getOrganizerRepository(),
            this.getTicketAssignmentDeadlineRepository(),
            this.getTicketTransactionRepository(),
            this.getTicketService(context),
            this.getTicketValidator(context),
            this.getEmailSender(),
            this.getConfigService(),
            this.getITicketSyncEventCreationProcess(),
            this.getImageCompressor(),
            this.getLocalisationProvider(context)
        );
    }

    public static getITicketSyncEventCreationProcess(): ITicketSyncEventCreationProcess {
        return new TicketSyncEventCreationProcess(
            this.getEventRepository(),
            this.getImageCompressor());
    }

    public static getEventRepository() {
        return new EventRepository();
    }

    public static getExportTicketsController(context: IUserContext): IExportTicketController {
        return new ExportTicketController(context);
    }

    public static getExportChangeHistoryController(context: IUserContext): IExportChangeHistoryController {
        return new ExportChangeHistoryController(context);
    }

    public static getExportPdfChangeHistoryController(context: IUserContext): ExportPdfChangeHistoryController {
        return new ExportPdfChangeHistoryController(context);
    }

    public static getExportOrganizersController(context: IUserContext): IExportOrganizersController {
        return new ExportOrganizersController(context);
    }

    public static getExportPDFTicketsController(context: IUserContext): ExportPdfTicketController {
        return new ExportPdfTicketController(context);
    }

    public static getExportPDFOrganizersController(context: IUserContext): ExportPdfOrganizersController {
        return new ExportPdfOrganizersController(context);
    }


    public static getSearchTicketsController(context: IUserContext) {
        return new SearchTicketController(
            context,
            this.getTicketRepository(),
            this.getUserRepository(),
            this.getOrganizerRepository(),
            this.getTicketService(context),
            this.getConfigService(),
            this.getLocalisationProvider(context)
        )
    }

    public static getPaymentSettingsController(context: IUserContext) {
        return new PaymentSettingsController(
            context,
            this.getStripeFactory(),
            this.getUserRepository(),
            this.getPaymentVerificationFlow(context)
        )
    }

    public static getPaymentVerificationFlow(context: IUserContext) {
        return new PaymentVerificationFlow(
            this.getStripeFactory(),
            this.getUserRepository(),
            this.getStripeErrorsTranslator(),
            this.getUserActivityLogService(context),
            this.getLocalisationProvider(context));
    }

    public static getStripeWebhookController(context: IUserContext) {
        return new StripeWebhookController(
            this.getUserRepository(),
            this.getStripeAccountStatusUpdater(context),
            this.getAppLogger(),
            this.getStripePaymentIntentStatusChangeHandler(context),
            this.getLocalisationProvider(context));
    }

    public static getStripePaymentIntentStatusChangeHandler(context: IUserContext): StripePaymentIntentStatusChangeHandler {
        return new StripePaymentIntentStatusChangeHandler(
            this.getAppLogger(),
            this.getPaymentController(context),
            this.getShoppingCartRepository(),
            this.getStripeFactory(),
            this.getTicketRepository(),
            this.getTicketService(context),
            this.getUserRepository(),
            this.getRepersonalizeController(context),
            this.getLocalisationProvider(context));
    }

    public static getStripeAccountStatusUpdater(context: IUserContext): StripeAccountStatusUpdater {
        return new StripeAccountStatusUpdater(
            this.getUserRepository(),
            this.getUserActivityLogService(context));
    }

    public static getCountryIsoCodeProvider(): ICountryIsoCodeProvider {
        return new CountryIsoCodeProvider(this.getCountryListProvider(), this.getLocalisationProvider());
    }

    public static getCountryListProvider(): ICountryListProvider {
        return new CountryListProvider();
    }

    public static getStripeFactory(): IStripeFactory {
        return new StripeFactory();
    }

    public static getTicketRepository(): ITicketRepository {
        return new TicketRepository();
    }

    public static getTicketValidator(context: IUserContext): ITicketValidator {
        return new TicketValidator(
            this.getUserRepository(),
            this.getLocalisationProvider(context),
            context
        );
    }

    public static getTicketRouter(expressApp: any): TicketsRouter {
        return new TicketsRouter(new ExpressAppWrapper(expressApp));
    }

    public static getTicketPlaceholderImageRepository(): ITicketPlaceholderImageRepository {
        return new TicketPlaceholderImageRepository();
    }

    public static getTicketSaleController(context: IUserContext): ITicketSaleController {
        return new TicketSaleController(
            context,
            this.getTicketRepository(),
            this.getUserRepository(),
            this.getTicketService(context),
            this.getConfigService(),
            this.getTicketValidator(context),
            this.getLocalisationProvider(context)
        );
    }

    public static getBuyTicketController(context: IUserContext): IBuyTicketController {
        return new BuyTicketController(
            context,
            this.getTicketRepository(),
            this.getTicketService(context),
            this.getUserRepository(),
            this.getOrganizerRepository(),
            this.getTicketValidator(context),
            this.getBuyTicketFlow(context),
            this.getConfigService(),
            this.getCountryIsoCodeProvider()
        );
    }

    public static getOrganizerRepository(): IOrganizerRepository {
        return new OrganizerRepository();
    }

    public static getOrganizerPlaceholderImageRepository(): IOrganizerPlaceholderImageRepository {
        return new OrganizerPlaceholderImageRepository();
    }

    public static getOrganizersController(context: IUserContext): IOrganizersController {
        return new OrganizersController(
            context,
            this.getOrganizerRepository(),
            this.getOrganizerPlaceholderImageRepository(),
            this.getOrganizersValidator(context),
            this.getUserProfileValidator(context),
            this.getUserRepository(),
            this.getTicketRepository(),
            this.getPasswordRecoveryController(context),
            this.getImageCompressor(),
            this.getConfigService(),
            this.getCountryIsoCodeProvider(),
            this.getLocalisationProvider(context)
        );
    }

    public static getOrganizerAdminPanelController(context: IUserContext): IOrganizerAdminPanelController {
        return new OrganizerAdminPanelController(
            context,
            this.getOrganizerRepository(),
            this.getUserRepository()
        );
    }

    public static getOrganizersValidator(context: IUserContext): IOrganizerValidator {
        return new OrganizerValidator(this.getOrganizerRepository(), context, this.getLocalisationProvider(context));
    }

    public static getOrganizersRouter(expressApp: any): OrganizersRouter {
        return new OrganizersRouter(new ExpressAppWrapper(expressApp));
    }

    public static getSearchUsersController(context: IUserContext): ISearchUserController {
        return new SearchUserController(
            context,
            this.getUserRepository(),
            this.getConfigService(),
            this.getLocalisationProvider(context)
        );
    }

    public static getSearchOrganizersController(context: IUserContext): ISearchOrganizersController {
        return new SearchOrganizersController(
            context,
            this.getOrganizerRepository(),
            this.getConfigService(),
            this.getLocalisationProvider(context)
        );
    }

    public static getOrganizerSupportController(context: IUserContext): IOrganizerSupportController {
        return new OrganizerSupportController(
            context,
            this.getConfigService(),
            this.getOrganizerRepository(),
            this.getLocalisationProvider(context)
        );
    }

    public static getExportOrganizersTicketsController(context: IUserContext): IExportOrganizersTicketsController {
        return new ExportOrganizersTicketsController(
            context
        );
    }

    public static getExportOrganizersBillingController(context: IUserContext): IExportOrganizersBillingController {
        return new ExportOrganizersBillingController(
            context
        );
    }

    public static getRepersonalizeController(context: IUserContext): IRepersonalizeTicketController {
        return new RepersonalizeTicketController(
            context,
            this.getUserRepository(),
            this.getTicketRepository(),
            this.getOrganizerRepository(),
            this.getTicketValidator(context),
            this.getTicketService(context),
            this.getConfigService(),
            this.getRepersonalizeTicketFlow(context),
            this.getCountryIsoCodeProvider(),
            this.getLocalisationProvider(context)
        );
    }

    public static getRepersonalizeTicketFlow(context: IUserContext) {
        return new RepersonalizeTicketFlow(
            context,
            this.getUserRepository(),
            this.getTicketRepository(),
            this.getTicketValidator(context),
            this.getTicketService(context),
            this.getShoppingCartFactory(context),
            this.getStripeFactory(),
            this.getShoppingCartRepository(),
            this.getLocalisationProvider(context))
    }

    public static getTicketPersonalizationController(context: IUserContext): ITicketPersonalizationController {
        return new TicketPersonalizationController(
            context,
            this.getTicketRepository(),
            this.getTicketService(context),
            this.getOrganizerRepository(),
            this.getUserRepository(),
            this.getEmailSender(),
            this.getConfigService(),
            this.getTicketPlaceholderImageRepository(),
            this.getQRUrlParamsRepository(),
            this.getLocalisationProvider(context)
        );
    }

    public static getQRUrlParamsController(context: IUserContext): IQRUrlParamsController {
        return new QRUrlParamsController(
            context,
            this.getQRUrlParamsRepository()
        );
    }

    public static getQRUrlParamsRepository(): IQRUrlParamsRepository {
        return new QRUrlParamsRepository();
    }

    public static getTicketService(context: IUserContext): ITicketService {
        return new TicketService(
            this.getTicketRepository(),
            this.getUserRepository(),
            this.getTicketPlaceholderImageRepository(),
            this.getTicketTransactionRepository(),
            this.getTicketAssignmentDeadlineRepository(),
            this.getEmailSender(),
            this.getConfigService(),
            this.getAppLogger(),
            this.getLocalisationProvider(context)
        );
    }

    public static getTicketTransactionRepository(): ITicketTransactionRepository {
        return new TicketTransactionRepository();
    }
    public static getEventCalendarController(context: IUserContext): IEventCalendarController {
        return new EventCalendarController(
            context,
            this.getEventRepository(),
            this.getCalendarExportService(context),
            this.getConfigService()
        );
    }

    public static getEventCalendarRouter(expressApp: any): EventCalendarRouter {
        return new EventCalendarRouter(new ExpressAppWrapper(expressApp));
    }

    public static getCalendarExportService(context: IUserContext): ICalendarExportService {
        return new CalendarExportService(
            this.getEventRepository(),
            this.getOrganizerRepository(),
            this.getLocalisationProvider(context)
        );
    }

    static getPaymentController(context: IUserContext): PaymentController {
        return new PaymentController(
            this.getBuyTicketFlow(context),
            this.getStripeFactory(),
            this.getShoppingCartRepository(),
            this.getTicketRepository(),
            this.getLocalisationProvider(context)
        );
    }

    static getBuyTicketFlow(context: IUserContext): BuyTicketFlow {
        return new BuyTicketFlow(this.getStripeFactory(), context, this.getUserRepository(), this.getTicketRepository(), this.getShoppingCartFactory(context), this.getShoppingCartRepository());
    }

    public static getConfigsController(context: IUserContext): IConfigsController {
        return new ConfigsCountroller(
            context,
            this.getConfigService()
        );
    }

    public static getConfigService(): ConfigService {
        return new ConfigService(this.getConfigRepository(), this.getLocalisationProvider());
    }

    public static getConfigRepository(): IConfigRepository {
        return new ConfigRepository();
    }

    public static getConfigsRouter(expressApp: any): ConfigsRouter {
        return new ConfigsRouter(new ExpressAppWrapper(expressApp));
    }

    public static getSessionLogRepository(): ISessionLogRepository {
        return new SessionLogRepository();
    }

    public static getUserActivityLogRepository(): IUserActivityLogRepository {
        return new UserActivityLogRepository();
    }

    public static getUserActivityLogService(context: IUserContext): IUserActivityLogService {
        return new UserActivityLogService(
            this.getUserActivityLogRepository(),
            context
        );
    }

    public static getInvalidIdCheckRepository(): IInvalidIdCheckRepository {
        return new InvalidIdCheckRepository();
    }

    public static getShoppingCartFactory(context: IUserContext): IShoppingCartFactory {
        return new ShoppingCartFactory(
            this.getTicketRepository(),
            this.getTicketValidator(context),
            context,
            this.getUserRepository(),
            this.getTicketPriceCalculator(),
            this.getShoppingCartRepository(),
            this.getLocalisationProvider(context)
        );
    }

    public static getTicketPriceCalculator(): ITicketPriceCalculator {
        return new TicketPriceCalculator(this.getCountryIsoCodeProvider());
    }

    public static getShoppingCartRepository(): IShoppingCartRepository {
        return new ShoppingCartRepository();
    }

    public static getTicketAssignmentDeadlinesController(context: IUserContext): ITicketAssignmentDeadlinesController {
        return new TicketAssignmentDeadlinesCountroller(
            context,
            this.getTicketAssignmentDeadlineRepository(),
            this.getTicketRepository(),
            this.getUserRepository(),
            this.getEmailSender()
        );
    }

    public static getTicketAssignmentDeadlineRepository(): ITicketAssignmentDeadlineRepository {
        return new TicketAssignmentDeadlineRepository();
    }

    public static getTicketAssignmentDeadlinesRouter(expressApp: any): TicketAssignmentDeadlinesRouter {
        return new TicketAssignmentDeadlinesRouter(new ExpressAppWrapper(expressApp), this.getConfigService());
    }

    public static getSelfieImageRepository(): ISelfieImageRepository {
        return new SelfieImageRepository();
    }

    public static getFAQRepository(): IFAQRepository {
        return new FAQRepository();
    }

    public static getFAQUserRepository(): IFAQUserRepository {
        return new FAQUSerRepository();
    }


    public static getSupportPageRouter(expressApp: any): SupportPageRouter {
        return new SupportPageRouter(new ExpressAppWrapper(expressApp));
    }

    public static getSupportPageController(context: IUserContext): ISupportPageController {
        return new SupportPageController(
            context,
            this.getFAQRepository(),
            this.getFAQUserRepository(),
            this.getEmailSender(),
            this.getConfigService()
        );
    }

    public static getDashboardController(context: IUserContext): IDashboardController {
        return new DashboardController(
            context,
            this.getUserRepository(),
            this.getTicketRepository(),
            this.getOrganizerRepository(),
            this.getUserActivityLogRepository(),
            this.getTicketTransactionRepository(),
            this.getUsersRegisteredVsUsersVerifiedPerYearReportResultRepository(),
            this.getIncomingTicketsVsPersonalizedTicketsPerYearReportResultRepository(),
            this.getIncomingTicketsPerOrganizerReportResultRepository()
        );
    }

    public static getUsersRegisteredVsUsersVerifiedPerYearReportResultRepository(): IUsersRegisteredVsUsersVerifiedPerYearReportResultRepository {
        return new UsersRegisteredVsUsersVerifiedPerYearReportResultRepository();
    }

    public static getIncomingTicketsVsPersonalizedTicketsPerYearReportResultRepository(): IIncomingTicketsVsPersonalizedTicketsPerYearReportResultRepository {
        return new IncomingTicketsVsPersonalizedTicketsPerYearReportResultRepository();
    }

    public static getIncomingTicketsPerOrganizerReportResultRepository(): IIncomingTicketsPerOrganizerReportResultRepository {
        return new IncomingTicketsPerOrganizerReportResultRepository();
    }

    public static getDashboardRouter(expressApp: any): DashboardRouter {
        return new DashboardRouter(new ExpressAppWrapper(expressApp));
    }

    public static getExportUsersController(context: IUserContext): IExportUsersController {
        return new ExportUsersController(context);
    }

    public static getExportPDFUsersController(context: IUserContext): ExportPdfUsersController {
        return new ExportPdfUsersController(context);
    }

    public static getExportUserManagementController(context: IUserContext): IExportUserManagementController {
        return new ExportUserManagementController(context);
    }

    public static getExportPDFManagementController(context: IUserContext): ExportPdfUserManagementController {
        return new ExportPdfUserManagementController(context);
    }

    public static getScannerController(context: IScannerContext): IScannerController {
        return new ScannerController(
            context,
            Bootstrapper.getUserRepository(),
            Bootstrapper.getLocalisationProvider(),
            Bootstrapper.getAuthenticationService(),
            Bootstrapper.getSessionLogRepository(),
            Bootstrapper.getSessionStore(),
            Bootstrapper.getEventRepository(),
            Bootstrapper.getTicketRepository(),
            Bootstrapper.getConfigService(),
            this.getCheckInRepository(),
            Bootstrapper.getSelfieImageRepository()
        );
    }

    public static getScannerRouter(expressApp: any): ScannerRouter {
        return new ScannerRouter(new ExpressAppWrapper(expressApp));
    }

    public static getCheckInRepository(): ICheckInRepository {
        return new CheckInRepository();
    }

    public static getScannerContextFactory(): ScannerContextFactory {
        return new ScannerContextFactory(this.getSessionStore());
    }
}
