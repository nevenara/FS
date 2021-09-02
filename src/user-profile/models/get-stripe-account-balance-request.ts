import Stripe from "stripe";
import { Bootstrapper } from "../../bootstrapper";
import { ValidationError } from "../../common/errors/validation-error";
import { LocalisationKey } from "../../localisation/localisation-key";


export class GetStripeAccountBalanceRequest{
    public userId: string;

    public validate(lang: string){
        if(!this.userId){
            const localisationProvider = Bootstrapper.getLocalisationProvider();

            throw new ValidationError(localisationProvider.translate(LocalisationKey.userIdRequired, lang));
        }
    }
}

export class GetStripeAccountBalanceResponse{
    available: Array<Stripe.Balance.Available>;
    payoutList: Stripe.Response<Stripe.ApiList<Stripe.Payout>>
}