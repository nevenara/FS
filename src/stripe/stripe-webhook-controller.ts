import { IAppLogger } from "../common/app-logger";
import { ValidationError } from "../common/errors/validation-error";
import { LocalisationKey } from "../localisation/localisation-key";
import { ILocalisationProvider } from "../localisation/localisation-provider";
import { UserActivityType } from "../models/user-activity-type";
import { PaymentIntentMetadataKey } from "../payment/model/payment-intent-metadata";
import { PaymentController } from "../payment/payment-controller";
import { UserActivityLogRequest } from "../user-activity-log/models/user-activity-log-request";
import { IUserActivityLogService } from "../user-activity-log/user-activity-log-service";
import { UserDbObject } from "../user/user-db-object";
import { IUserRepository } from "../user/user-repository";
import { IUserValue } from "../user/user-value";
import { StripeAccountStatusUpdater } from "./stripe-account-status-updater";
import { StripePaymentIntentStatusChangeHandler } from "./stripe-handle-payment-status-change-handler";

export class StripeWebhookController {
    constructor(
        private userRepository: IUserRepository,
        private statusUpdater: StripeAccountStatusUpdater,
        private logger: IAppLogger,
        private paymentIntentStatusChangeHandler: StripePaymentIntentStatusChangeHandler,
        private localisationProvider: ILocalisationProvider) {

    }

    //https://stripe.com/docs/webhooks/build
    public async handleEvent(event: any) {
        this.logger.log(`Event type ${event.type} called via web hook.`);

        // Handle the event
        switch (event.type) {

            case 'payment_intent.payment_failed':
                await this.paymentIntentStatusChangeHandler.handlePaymentIntentFailed(event.data.object);
                break;
            case 'charge.succeeded':
                await this.paymentIntentStatusChangeHandler.handleChargeSucceded(event.data.object);
                break;
            case 'payment_intent.succeeded':
                // Then define and call a method to handle the successful payment intent.
                await this.paymentIntentStatusChangeHandler.handleChargeSucceded(event.data.object);
                break;
            case 'payment_method.attached':
                const paymentMethod = event.data.object;
                // Then define and call a method to handle the successful attachment of a PaymentMethod.
                // handlePaymentMethodAttached(paymentMethod);
                break;
            // ... handle other event types
            case 'account.updated':
                await this.onAccountUpdatedEvent(event);
                break;
            case 'person.updated':
                await this.onPersonUpdatedEvent(event);
                break;
            case 'identity.verification_intent.succeeded':
                break;
            default:
                console.log(`Unhandled event type ${event.type}`);
        }
    }


    private async onPersonUpdatedEvent(event: any) {
        console.log('person.updated');
        const stripeAccountStatus = event.data.object.individual.verification.status;
        const stripeAccountId = event.data.object.id;
        await this.handleAccountUpdatedEvent(stripeAccountId, stripeAccountStatus);
    }

    private async onAccountUpdatedEvent(event: any) {
        console.log('handleAccountUpdatedEvent');
        const stripeAccountStatus = event.data.object.individual.verification.status;
        const stripeAccountId = event.data.object.id;
        await this.handleAccountUpdatedEvent(stripeAccountId, stripeAccountStatus);
        return { stripeAccountId, stripeAccountStatus };
    }

    private async handleAccountUpdatedEvent(stripeAccountId: string, stripeAccountStatus: string) {

        //TODO SEE IF STATUS HAS BEEN CHANGED, IF NOT IGNORE THIS...
        //WE CAN SIMPLY COMPARE WITH PREVIOUS VALUE IN OUR DB..
        const user: IUserValue = await this.userRepository.getByStripeAccountId(stripeAccountId);

        if (!user) {
            throw new ValidationError(this.localisationProvider.translate(LocalisationKey.UserCannotBeFoundForGivenStripeAccountId) + ' ' + stripeAccountId);
        }

        await this.statusUpdater.updateUserStatus(user, stripeAccountStatus);
    }
}