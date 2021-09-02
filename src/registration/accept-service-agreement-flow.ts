import { IUserContext } from "../common/user-context";
import { IStripeFactory } from "../stripe/stripe-factory";
import { IUserValue } from "../user/user-value";

export interface IAcceptServiceAgreementFlow {
    acceptServiceAgreement(ip: string, user: IUserValue);
}

export class AcceptServiceAgreementFlow implements IAcceptServiceAgreementFlow {

    constructor(
        private stripeFactory: IStripeFactory,
        private context: IUserContext) {
    }

    public async acceptServiceAgreement(ip: string, user: IUserValue) {
        // https://stripe.com/docs/connect/updating-accounts
        this.context.validateIfAuthenticated();

        const stripe = this.stripeFactory.createStripe();

        const account = await stripe.accounts.update(
            user.stripeAccountId,
            {
                tos_acceptance: {
                    date: Math.floor(Date.now() / 1000),
                    ip: ip, // Assumes you're not using a proxy
                },
            }
        );
    }
}