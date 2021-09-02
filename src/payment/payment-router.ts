import { Bootstrapper } from "../bootstrapper";
import { IUserContext } from "../common/user-context";
import { ExpressAppWrapper } from "../http/express-app-wrapper";
import { ConfirmPaymentIntentRequest } from "./model/confirm-payment-intent-request";
import { CreatePaymentIntentRequest } from "./model/create-payment-intent-request";
import { PaymentSettingsSaveRequest } from "./model/payment-settings-save-request";
import { PaymentVerificationFlowResponse } from "./model/payment-verification-flow-response";
import { ValidateIbanRequest } from "./model/validate-iban-request";
import { PaymentController } from "./payment-controller";
import { PaymentSettingsController } from "./payment-settings-controller";
import { TicketPriceController } from "./ticket-price-controller";
const multer = require('multer');
var storage = multer.memoryStorage();
var upload = multer({ storage: storage });

export class PaymentRouter {
    public static SAVE_PAYMENT_SETTINGS = '/paymentsetings/save';
    public static VERIFY_IDENTITY = '/paymentsettings/verifyidentity';
    public static CREATE_SESSION = '/payment/createsession';
    public static CREATE_PAYMENTINTENT = '/payment/createpaymentintent';
    public static CONFIRM_PAYMENTINTENT_STATUS = '/payment/confirmpaymentintentstatus';
    public static VALIDATE_IBAN = '/payment/validateIban';
    public static PAYMENT_FAILED = '/payment/onpaymentfailed';
    public static ADMINPANEL_SAVE_PAYMENT_SETTINGS = '/admin/payment/save';
    public static TICKET_PAYMENT_DETAILS = '/ticket/payment/details';
    public static TICKET_REPERSONALIZATION_DETAILS = '/ticket/repersonalization/details';

    constructor(private readonly expressApp: ExpressAppWrapper) { }

    public registerRoutes(): void {

        this.expressApp.post(PaymentRouter.TICKET_PAYMENT_DETAILS, async (req, res, next) => {
            const context = req.context as IUserContext;

            const controller: TicketPriceController = Bootstrapper.getTicketPriceController(context)

            const result = await controller.getTicketPricingDetails(req.body.ticketId)

            res.json(result);
        });

        this.expressApp.post(PaymentRouter.TICKET_REPERSONALIZATION_DETAILS, async (req, res, next) => {
            const context = req.context as IUserContext;

            const controller: TicketPriceController = Bootstrapper.getTicketPriceController(context)

            const result = await controller.getRepersonalizationFeeDetails()

            res.json(result);
        });

        this.expressApp.post(PaymentRouter.VALIDATE_IBAN, async (req, res, next) => {
            const context = req.context as IUserContext;

            const controller: PaymentSettingsController = Bootstrapper.getPaymentSettingsController(context)

            const request = new ValidateIbanRequest();

            request.ibanValue = req.body.ibanValue;

            const result = await controller.validateIban(request);

            res.json(result);
        });

        this.expressApp.post(PaymentRouter.CONFIRM_PAYMENTINTENT_STATUS, async (req, res, next) => {
            const context = req.context as IUserContext;

            const controller: PaymentController = Bootstrapper.getPaymentController(context)

            const request = new ConfirmPaymentIntentRequest();

            request.paymentIntentId = req.body.paymentIntentId;

            const result = await controller.confirmPaymentIntent(request);

            res.json(result);
        });

        this.expressApp.post(PaymentRouter.PAYMENT_FAILED, async (req, res, next) => {
            const context = req.context as IUserContext;

            const controller: PaymentController = Bootstrapper.getPaymentController(context)

            const result = await controller.onPaymentFailed(req.body.paymentIntentId, req.body.status);

            res.json(result);
        });

        this.expressApp.post(PaymentRouter.CREATE_PAYMENTINTENT, async (req, res, next) => {
            const context = req.context as IUserContext;

            const controller: PaymentController = Bootstrapper.getPaymentController(context)

            const request = new CreatePaymentIntentRequest();

            request.tickets = req.body.tickets;

            const result = await controller.createPaymentIntent(request);

            res.json(result);
        });

        this.expressApp.post(PaymentRouter.CREATE_SESSION, async (req, res, next) => {
            const context = req.context as IUserContext;

            const controller: PaymentController = Bootstrapper.getPaymentController(context)

            const result = await controller.createSession();

            res.json(result);
        });

        this.expressApp.post(PaymentRouter.VERIFY_IDENTITY, async (req, res, next) => {
            const context = req.context as IUserContext;

            const controller: PaymentSettingsController = Bootstrapper.getPaymentSettingsController(context)

            const result = await controller.verifyIdentity();

            res.json(result);
        });

        this.expressApp.postWithFile(
            PaymentRouter.SAVE_PAYMENT_SETTINGS,
            upload.fields([
                { name: 'residenceDocument', maxCount: 1 }]),
            async (req, res, next) => {
                const context = req.context as IUserContext;

                const request = new PaymentSettingsSaveRequest();
                request.residenceDocument = req.files['residenceDocument'][0];
                request.userId = context.userId;

                request.bankAccountStripeToken = req.body.bankAccountStripeToken;

                const controller: PaymentSettingsController =
                    Bootstrapper.getPaymentSettingsController(context)

                const response: PaymentVerificationFlowResponse =
                    await controller.save(request);

                res.json(response);
            });

        this.expressApp.postWithFile(
            PaymentRouter.ADMINPANEL_SAVE_PAYMENT_SETTINGS,
            upload.fields([
                { name: 'residenceDocument', maxCount: 1 }]),
            async (req, res, next) => {
                const context = req.context as IUserContext;

                const request = new PaymentSettingsSaveRequest();
                request.residenceDocument = req.files['residenceDocument'][0];
                request.bankAccountStripeToken = req.body.bankAccountStripeToken;
                request.userId = req.body.userId;

                const controller: PaymentSettingsController =
                    Bootstrapper.getPaymentSettingsController(context)

                context.validateIfAuthenticated();
                context.validateIfAdmin();

                const response: PaymentVerificationFlowResponse =
                    await controller.save(request);

                res.json(response);
            });
    }
}