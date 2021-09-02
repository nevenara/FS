import moment = require("moment");
import Stripe from "stripe";
import { ValidationError } from "../common/errors/validation-error";
import { IUserContext } from "../common/user-context";
import { Gender } from "../models/gender";
import { ICountryIsoCodeProvider } from "../common/country-iso-code-provider";
import { IStripeFactory } from "../stripe/stripe-factory";
import { IUserValue } from "../user/user-value";
import { RegistrationFlowResponse } from "./registration-flow-response";

export interface IRegistrationFlow {
    registerUserOnStripe(user: IUserValue): Promise<RegistrationFlowResponse>
}

export class RegistrationFlow implements IRegistrationFlow {

    constructor(private context: IUserContext,
        private stripeFactory: IStripeFactory,
        private countryIsoCodeProvider: ICountryIsoCodeProvider) {
    }

    public async registerUserOnStripe(user: IUserValue): Promise<RegistrationFlowResponse> {
        const response = new RegistrationFlowResponse();
        //what if there is an error on Stripe side it is not localised...
        //we need to tell Stripe to send error message in specific language..
        const countryCode = this.countryIsoCodeProvider.getIsoCode(user.country);

        const stripe: Stripe = this.stripeFactory.createStripe();
        // const birthMomentDate = moment(user.birthDate);

        try {
            //https://stripe.com/docs/api/accounts/create?lang=node
            //https://stripe.com/docs/api/accounts/object
            const account: Stripe.Account = await stripe.accounts.create({
                type: 'custom',
                business_type: 'individual',
                country: countryCode,
                email: user.email,
                business_profile: {
                    mcc: '5734',
                    url: 'fansafe.com'
                },
                individual: {
                    email: user.email,
                    first_name: user.firstname,
                    last_name: user.lastname,
                    gender: user.gender == Gender.Female ? 'female' : 'male',
                    phone: user.phone,

                    dob: {
                        day: user.birthDate.getDate(),
                        //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/getMonth
                        month: user.birthDate.getMonth() + 1,
                        year: user.birthDate.getFullYear()
                    },
                    address: {
                        country: countryCode,
                        city: user.city,
                        postal_code: user.postCode,
                        line1: user.address
                    },
                },
                capabilities: {
                    //allow client to receive direct payments
                    card_payments: { requested: true },
                    transfers: { requested: true }
                },
            });

            //save account id for this user...
            response.stripeAccountId = account.id;
            response.stripeAccountStatus = account.individual.verification.status;
            return response;
        } catch (error) {
            throw new ValidationError(error.message);
        }
    }
}