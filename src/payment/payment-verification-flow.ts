import Stripe from "stripe";
import { ValidationError } from "../common/errors/validation-error";
import { LocalisationKey } from "../localisation/localisation-key";
import { ILocalisationProvider } from "../localisation/localisation-provider";
import { UserActivityType } from "../models/user-activity-type";
import { UserStatus } from "../models/user-status";
import { StripeErrorsTranslator } from "../registration/stripe-errors-translator";
import { IStripeFactory } from "../stripe/stripe-factory";
import { UserActivityLogRequest } from "../user-activity-log/models/user-activity-log-request";
import { IUserActivityLogService } from "../user-activity-log/user-activity-log-service";
import { UserDbObject } from "../user/user-db-object";
import { IUserRepository } from "../user/user-repository";
import { IUserValue } from "../user/user-value";
import { PaymentSettingsSaveRequest } from "./model/payment-settings-save-request";
import { PaymentVerificationFlowResponse } from "./model/payment-verification-flow-response";

export class PaymentVerificationFlow {

    constructor(
        private stripeFactory: IStripeFactory,
        private userRepository: IUserRepository,
        private stripeErrorsTranslator: StripeErrorsTranslator,
        private userActivityLogService: IUserActivityLogService,
        private localisationProvider: ILocalisationProvider) {
    }

    //https://stripe.com/docs/connect/testing
    //  Bank numbers Europe IBAN

    // AT89370400440532013000

    public async startPaymentVerificationFlow(
        user: IUserValue,
        request: PaymentSettingsSaveRequest): Promise<PaymentVerificationFlowResponse> {

        const response = new PaymentVerificationFlowResponse();
        //user must be able to change his bank account number...

        //https://stripe.com/docs/connect/bank-debit-card-payouts
        //For Custom accounts, the platform can also set the destination bank accounts and debit cards.


        // /https://stripe.com/docs/connect/payouts-bank-accounts

        //They can be bank accounts or debit cards.

        //https://stripe.com/docs/connect/payouts-bank-accounts

        if (user.status !== UserStatus.IdVerified) {
            throw new ValidationError(this.localisationProvider.translate(LocalisationKey.UserIsNotIdVerified));
        }

        const stripe = this.stripeFactory.createStripe();

        

        let account: Stripe.Account = await stripe.accounts.retrieve(null, {
            stripeAccount: user.stripeAccountId
        });

        if (account.requirements.currently_due.find(n => { return n === 'individual.verification.additional_document' })) {
            const file = await stripe.files.create({
                purpose: 'additional_verification',
                file: {
                    data: request.residenceDocument.buffer,
                    name: request.residenceDocument.filename || request.residenceDocument.originalname,
                    type: request.residenceDocument.mimetype,
                },
            }, {
                stripeAccount: user.stripeAccountId,
            });

            const updatedIdDocument = await stripe.accounts.updatePerson(
                user.stripeAccountId,
                account.individual.id,
                {
                    verification: {
                        additional_document: {
                            front: file.id
                        }
                    },
                }
            );

            const stripeErrors =
                this.stripeErrorsTranslator.translate(updatedIdDocument.requirements.errors);

            if (stripeErrors.length > 0) {
                throw new ValidationError(stripeErrors.join(','));
            }
        }

        const bankAccount = await stripe.accounts.createExternalAccount(
            user.stripeAccountId,
            { external_account: request.bankAccountStripeToken }
        );

        user.bankAccountId = bankAccount.id;

        await this.userRepository.updateObjectById(user._id, new UserDbObject(user));
        
        account = await stripe.accounts.retrieve(null, {
            stripeAccount: user.stripeAccountId
        });

        response.stripeErrors =
            this.stripeErrorsTranslator.translate(account.requirements.errors);

        if (account.requirements.errors.length === 0 &&
            user.stripeAccountStatus !== account.individual.verification.status) {
            const logRequest = new UserActivityLogRequest();
            logRequest.previousStripeAccountStatus = user.stripeAccountStatus;
            user.stripeAccountStatus = account.individual.verification.status;
            this.userRepository.updateObjectById(user._id, new UserDbObject(user));

            logRequest.newStripeAccountStatus = user.stripeAccountStatus;
            logRequest.userId = user._id;
            logRequest.activityType = UserActivityType.PaymentStatusChanged;

            await this.userActivityLogService.log(logRequest);
        }

        return response;
    }
}