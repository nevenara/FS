import { LoginRequest } from "./models/login-request";
import { LoginResponse } from "./models/login-response";
import { IAuthentcationRepository } from "./authentication-repository";
import { UserDbObject } from "../user/user-db-object";
import { IUserRepository } from "../user/user-repository";
import { isRegExp } from "util";
import { ValidationError } from "../common/errors/validation-error";
import { LocalisationKey } from "../localisation/localisation-key";
import { SessionModel } from "../http/session/session-model";
import { ISessionStore } from "../http/session/session-store";
import { IUserValue } from "../user/user-value";
import { UserStatus } from "../models/user-status";
import { Hashing } from "../common/hashing";
import { IUserContext } from "../common/user-context";
import { SessionLogDbObject } from "../session-log/session-log-db-object";
import { ISessionLogRepository } from "../session-log/session-log-repository";
import { Stripe } from "stripe";
import { IStripeFactory } from "../stripe/stripe-factory";
import { StripeAccountStatusUpdater } from "../stripe/stripe-account-status-updater";

export class SessionController {
    constructor(
        private stripeFactory: IStripeFactory,
        private userRepository: IUserRepository,
        private stripeAccountStatusUpdater: StripeAccountStatusUpdater,
        private sessionStore: ISessionStore,
        private userContext: IUserContext) { }

    public async keepSessionAlive() {
        if (!this.userContext.isAuthenticated) {
            return { authenticated: false };
        }

        await this.sessionStore.refreshSession(this.userContext.sessionId);

        await this.checkStripeStatus();

        return { authenticated: true };
    }

    public async checkStripeStatus() {
        this.userContext.validateIfAuthenticated();

        const user = await this.userRepository.getUserById(this.userContext.userId);

        if (user.stripeAccountId
            && user.bankAccountId
            && user.stripeAccountStatus !== 'verified') {
            console.log('stripe account status is pending..')

            await this.updateStripeStatus(user);
        } 
        // else if (user.stripeAccountId
        //     && user.status === UserStatus.IdVerified
        //     && user.stripeAccountStatus === 'unverified') {
        //         await this.updateStripeStatus(user);
        // }
    }

    private async updateStripeStatus(user: IUserValue) {
        const stripe = this.stripeFactory.createStripe();

        let account: Stripe.Account = await stripe.accounts.retrieve(null, {
            stripeAccount: user.stripeAccountId
        });

        const stripeStatus = account.individual.verification.status;

        if (user.stripeAccountStatus !== stripeStatus) {
            await this.stripeAccountStatusUpdater.updateUserStatus(user, stripeStatus);
        }
    }
}