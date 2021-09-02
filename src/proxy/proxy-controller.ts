import { Guard } from "../common/errors/guard";
import { IUserContext } from "../common/user-context";
import { ISessionStore } from "../http/session/session-store";
import { UserType } from "../models/user-type";
import { IUserRepository } from "../user/user-repository";
import { ProxyAsAnotherUserRequest, ProxyAsAnotherUserResponse } from "./models/proxy-as-another-user-request";

export class ProxyController {
    constructor(
        private context: IUserContext,
        private sessionStore: ISessionStore,
        private userRepository: IUserRepository) {

    }

    public async proxyAsAnotherUser(request: ProxyAsAnotherUserRequest): Promise<ProxyAsAnotherUserResponse> {
        this.context.validateIfAuthenticated();
        this.context.validateAuthorization([UserType.SuperAdmin, UserType.Admin, UserType.EventManager]);

        const response = new ProxyAsAnotherUserResponse();

        const proxyUser = await this.userRepository.getUserById(request.userId);

        Guard.isTruthy(proxyUser, `Proxy user id: ${request.userId} is invalid.`);

        const sessionModel = await this.sessionStore.getSession(this.context.sessionId);

        sessionModel.proxyUserId = request.userId;
        sessionModel.proxyUserType = proxyUser.usertype;

        await this.sessionStore.updateSession(this.context.sessionId, sessionModel);

        return response;
    }

    public async logout(){
        const sessionModel = await this.sessionStore.getSession(this.context.sessionId);

        sessionModel.proxyUserId = null;
        sessionModel.proxyUserType = null;

        await this.sessionStore.updateSession(this.context.sessionId, sessionModel);
    }
}