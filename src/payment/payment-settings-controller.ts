import Stripe from "stripe";
import { ValidationError } from "../common/errors/validation-error";
import { IUserContext } from "../common/user-context";
import { LocalisationKey } from "../localisation/localisation-key";
import { Gender } from "../models/gender";
import { UserStatus } from "../models/user-status";
import { ICountryIsoCodeProvider } from "../common/country-iso-code-provider";
import { IStripeFactory } from "../stripe/stripe-factory";
import { StripeVerificationStatus } from "../stripe/stripe-verification-status";
import { UserDbObject } from "../user/user-db-object";
import { IUserRepository } from "../user/user-repository";
import { IUserValue } from "../user/user-value";
import { PaymentSettingsSaveRequest } from "./model/payment-settings-save-request";
import { PaymentVerificationFlowResponse } from "./model/payment-verification-flow-response";
import { ValidateIbanRequest } from "./model/validate-iban-request";
import { PaymentVerificationFlow } from "./payment-verification-flow";
import { UserType } from "../models/user-type";
const https = require('https')

export class PaymentSettingsController {
    constructor(
        private context: IUserContext,
        private stripeFactory: IStripeFactory,
        private userRepository: IUserRepository,
        private paymentVerificationFlow: PaymentVerificationFlow) { }

    public async validateIban(request: ValidateIbanRequest) {
        if (request.ibanValue === 'AT89370400440532013000') {
            //we will not validate Stripe's test IBAN number.
            return {
                valid: true,
            }
        }


        const options = {
            hostname: 'openiban.com',
            port: 443,
            path: `/validate/${request.ibanValue}?validateBankCode=true&getBIC=true`,
            method: 'GET'
        }

        return new Promise((resolve, reject) => {
            const req = https.request(options, res => {
                let data = '';
                console.log(`statusCode: ${res.statusCode}`)

                res.on('data', chunk => {
                    data += chunk;
                });

                // The whole response has been received. Resolve the promise.
                res.on('end', () => {
                    console.log(data);
                    resolve(JSON.parse(data));
                });
            })

            req.on('error', error => {
                reject(error);
            })

            req.end()
        })
    }

    public async save(request: PaymentSettingsSaveRequest): Promise<PaymentVerificationFlowResponse> {

        this.context.validateIfAuthenticated();
        this.context.validateAuthorization([UserType.SuperAdmin, UserType.Admin, UserType.EventManager, UserType.MainAccount])

        request.validate(this.context.lang);

        //https://stripe.com/docs/connect/required-verification-information

        const user: IUserValue = await this.userRepository.getUserById(request.userId);

        const response = await this.paymentVerificationFlow.startPaymentVerificationFlow(user, request);

        return response;
    }

    public async verifyIdentity(): Promise<any> {
        this.context.validateIfAuthenticated();

        const stripe: Stripe = this.stripeFactory.createStripe('2020-08-27; identity_beta=v3');

        const resource = Stripe.StripeResource.extend({
            request: Stripe.StripeResource.method({
                method: 'POST',
                path: 'identity/verification_intents',
            })
        });

        return new Promise((resolve, reject) => {
            // @ts-ignore: we need to have option to override api version
            new resource(stripe).request({
                'return_url': 'https://example.com/return?vi={VERIFICATION_INTENT_ID}',
                'requested_verifications': [
                    'identity_document',
                ]
            },
                function (err, response) {
                    // asynchronously called
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(response);
                    }
                }
            );
        })
    }

    //used for testing
    public async createPaymentIntent(ticketId: string) {
        this.context.validateIfAuthenticated();

        //TODO GET TICKET FROM DB, CHECK PRICE AND SET AMMOUNT FOR PAYMENT INTENT..

        const user: IUserValue = await this.userRepository.getUserById(this.context.userId);

        const stripe: Stripe = this.stripeFactory.createStripe();

        if (user.stripeAccountId) {
            //https://stripe.com/docs/payments/payment-intents
            //https://stripe.com/docs/payments/connected-accounts
            await stripe.paymentIntents.create({
                amount: 11,
                currency: 'eur',
                payment_method_types: ['card'],
                application_fee_amount: 2,
                // //The Stripe account ID for which these funds are intended. 
                // //For details, see the PaymentIntents [use case for connected accounts](https://stripe.com/docs/payments/connected-accounts).
                // on_behalf_of: user.stripeAccountId

            }, {
                // An account id on whose behalf you wish to make a request.
                stripeAccount: user.stripeAccountId
            });

            //we need to see where each payment intent will be stored...
            // I guess it can be new table where list of all payments can be maintained.. for example..
            //

            // Passing the client secret to the client side
        }
    }
}