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
import { IAuthenticationService } from "./authentication-service";
import { ICountryIsoCodeProvider } from "../common/country-iso-code-provider";
import * as roles from './models/application-type';
import { ILocalisationProvider } from "../localisation/localisation-provider";

export interface IAuthenticationController {
    login(request: LoginRequest, userAgent: string): Promise<LoginResponse>;
    getUserContext();
    logout();
}

export class AuthenticationController implements IAuthenticationController {
    constructor(
        private repository: IUserRepository,
        private sessionLogRepository: ISessionLogRepository,
        private sessionStore: ISessionStore,
        private userContext: IUserContext,
        private authenticationService: IAuthenticationService,
        private countryIsoCodeProvider: ICountryIsoCodeProvider,
        private localisationProvider: ILocalisationProvider) { }

    public async getUserContext() {
        const contextData = {};

        if (this.userContext.isAuthenticated) {
            const user = await this.repository.getUserById(this.userContext.userId);
            contextData['userStatus'] = user.status;
            contextData['city'] = user.city;
            contextData['country'] = this.countryIsoCodeProvider.getIsoCode(user.country || 'AT');
            contextData['postCode'] = user.postCode;
            contextData['address'] = user.address;
            contextData['phone'] = user.phone;
        }

        contextData['userId'] = this.userContext.userId;
        contextData['lang'] = this.userContext.lang;
        contextData['sessionId'] = this.userContext.sessionId;
        contextData['isAuthenticated'] = this.userContext.isAuthenticated;
        contextData['userType'] = this.userContext.userType;
        contextData['email'] = this.userContext.email;
        contextData['firstname'] = this.userContext.firstname;
        contextData['lastname'] = this.userContext.lastname;
        contextData['country'] =this.countryIsoCodeProvider.getIsoCode(this.userContext.country || 'AT');
        contextData['proxyUserId'] = this.userContext.proxyUserId;
        contextData['proxyUserType'] = this.userContext.proxyUserType;

        return contextData;
    }

    public async login(request: LoginRequest, userAgent: string): Promise<LoginResponse> {

        request.valiate();

        const user: IUserValue = await this.repository.getUserByUserNameOrEmail(request.username);

        if (!user) {
            throw new ValidationError(this.localisationProvider.translate(LocalisationKey.LoginFailed, request.lang));
        }

        if (user.password !== Hashing.hashPassword(request.password)) {
            throw new ValidationError(this.localisationProvider.translate(LocalisationKey.LoginFailed, request.lang));
        }

        if(user.status == UserStatus.Deleted) {
            throw new ValidationError(this.localisationProvider.translate(LocalisationKey.LoginFailed, request.lang));     
        }

        if (user.status === UserStatus.EmailNotVerified) {
            throw new ValidationError(this.localisationProvider.translate(LocalisationKey.EmailMustBeVerifiedForLogin, request.lang));
        }

        if ( !roles.Roles[request.applicationType].includes(user.usertype)){
            throw new ValidationError(this.localisationProvider.translate(LocalisationKey.ActionNotAllowed, request.lang));
        }

        const loginResponse = new LoginResponse();
        loginResponse.userStatus = user.status;

        if (user.status === UserStatus.Blocked) {
            return loginResponse;
        }

       

        const authResponse = await this.authenticationService.authenticate(user, userAgent, request.lang || 'en');

        loginResponse.sessionId = authResponse.sessionId;

        return loginResponse;
    }

    public async logout() {
        this.userContext.validateIfAuthenticated();

        const session = await this.sessionLogRepository.getSessionBySessionId(this.userContext.sessionId);

        session.logOutDate = new Date();

        this.sessionLogRepository.updateObjectById(session._id, new SessionLogDbObject(session));

        await this.sessionStore.removeSession(this.userContext.sessionId);
    }
}