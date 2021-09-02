import { Guard } from "../common/errors/guard";
import { Environment } from "../environment";
import { Stripe } from 'stripe';

export interface IStripeFactory {
    createStripe(apiVersion?: string): Stripe;
}

export class StripeFactory implements IStripeFactory {
    public createStripe(apiVersion?: string): Stripe {
        const secretKey: string = Environment.getStripeSecretKey();

        Guard.isTruthy(secretKey, 'Stripe Secret Key must be set.');

        const stripe = new Stripe(secretKey, {
            // @ts-ignore: we need to have option to override api version
            apiVersion: apiVersion || null,
            typescript: true
        });

        return stripe;
    }
}