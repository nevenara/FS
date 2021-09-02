import { SessionModel } from "../http/session/session-model";
import { ISessionStore } from "../http/session/session-store";
import { SessionLogDbObject } from "../session-log/session-log-db-object";
import { ISessionLogRepository } from "../session-log/session-log-repository";
import { IUserValue } from "../user/user-value";


export class AuthenticateUserResponse {
    public sessionId: string;
}

export interface IAuthenticationService {
    authenticate(user: IUserValue, userAgent: string, lang: string): Promise<AuthenticateUserResponse>
}

export class AuthenticationService implements IAuthenticationService {
    constructor(
        private sessionLogRepository: ISessionLogRepository,
        private sessionStore: ISessionStore) {

    }
    public async authenticate(user: IUserValue, userAgent: string, lang: string, eventId: string = null): Promise<AuthenticateUserResponse> {
        const sessionModel = new SessionModel(user, lang, eventId);
        const loginResponse = new AuthenticateUserResponse();

        loginResponse.sessionId = await this.sessionStore.setSession(sessionModel);


        //insert session into session log
        const sessionLog: SessionLogDbObject = new SessionLogDbObject();
        sessionLog.sessionId = loginResponse.sessionId;
        sessionLog.userId = user._id;
        sessionLog.userAgent = userAgent;
        sessionLog.startDate = new Date();

        await this.sessionLogRepository.create(sessionLog);
        
        return loginResponse;
    }
}
