import Stripe from "stripe";

export class StartIdVerificationFlowResponse{
    stripeErrors: Array<Stripe.Person.Requirements.Error>;
    stripeErrorsTranslated: string[];
}