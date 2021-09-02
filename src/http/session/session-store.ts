import { v1 as uuidv1 } from "uuid";
import { SessionModel } from "./session-model";
import { DateUtil } from "../../common/date";
import { InternalError } from "../../common/errors/internal-error";
import { LocalisationKey } from "../../localisation/localisation-key";
import { IRedisClientWrapper } from "../../common/caching/redis-client-wrapper";
import { Environment } from "../../environment";
import { ILocalisationProvider } from "../../localisation/localisation-provider";

export interface ISessionStore {
    setSession(data: SessionModel): Promise<string>;
    updateSession(sessionId: string, data: SessionModel): Promise<any>;
    getSession(sessionId: string): Promise<SessionModel>;
    removeSession(sessionId: string): Promise<boolean>;
    refreshSession(sessionId: string);
}

export class SessionStore implements ISessionStore {
    constructor(private redis: IRedisClientWrapper, private localisationProvider: ILocalisationProvider) { }

    async updateSession(sessionId: string, data: SessionModel) {
        await this.redis.setExpirySeconds(sessionId, JSON.stringify(data), Environment.getSessionExpirationInSeconds());
    }

    public async refreshSession(sessionId: string) {
        const sessionValue = await this.redis.get(sessionId);

        await this.redis.setExpirySeconds(sessionId, sessionValue, Environment.getSessionExpirationInSeconds());
    }

    public async setSession(data: SessionModel): Promise<string> {
        try {
            const key = this.generateKey(
                DateUtil.getDateInMiliseconds(DateUtil.GetDateTimeStampUTC()).toString(),
                uuidv1(),
            );
 
            
            await this.redis.setExpirySeconds(key, JSON.stringify(data), Environment.getSessionExpirationInSeconds());
            
            
            return key;
        } catch (error) {
            return Promise.reject(new InternalError(error, this.localisationProvider.translate(LocalisationKey.SetSessionError, data.lang)));
        }
    }

    async getSession(sessionId: string): Promise<SessionModel> {
        try {
            const sessionValue = await this.redis.get(sessionId);
            if (!sessionValue) {
                return Promise.resolve(null);
            }

            const sessionModel = JSON.parse(sessionValue) as SessionModel;
            return Promise.resolve(sessionModel);
        } catch (error) {
            // problem with lang
            return Promise.reject(new InternalError(error,this.localisationProvider.translate(LocalisationKey.GetSessionError)));
        }
    }

    public async removeSession(sessionId: string): Promise<boolean> {
        return this.redis.delete(sessionId);
    }

    private generateKey(...params: string[]): string {
        return params.join("&");
    }
}