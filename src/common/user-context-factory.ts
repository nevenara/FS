import { UserContext } from "./user-context";
import { Guard } from "./errors/guard";
import { ISessionStore } from "../http/session/session-store";

export class UserContextFactory {
    constructor(private sessionStore: ISessionStore) {
    }

    public async getUserContext(sessionId: string): Promise<UserContext> {
        const userContext = new UserContext();
        userContext.isAuthenticated = false;
        userContext.sessionId = sessionId;

        if (sessionId) {
            const sessionData = await this.sessionStore.getSession(sessionId);

            if (sessionData && !sessionData.eventId) {
                userContext.userId = sessionData.userId;
                userContext.userType = sessionData.userType;
                userContext.isAuthenticated = true;
                userContext.email = sessionData.email;
                userContext.firstname = sessionData.firstname;
                userContext.lastname = sessionData.lastname;
                userContext.country = sessionData.country;
                userContext.proxyUserType = sessionData.proxyUserType;
                userContext.proxyUserId = sessionData.proxyUserId;
                userContext.organizerId = sessionData.organizerId;
                userContext.lang = sessionData.lang;
            }
        }

        return userContext;
    }
}