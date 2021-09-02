import { IRedisClientWrapper } from "../common/caching/redis-client-wrapper";
import { Guard } from "../common/errors/guard";
import { IUserContext } from "../common/user-context";
import { SessionModel } from "../http/session/session-model";
import { SetLangResponse } from "./models/set-lang-response";
import { ITranslationDataProvider } from "./translation-data-provider";

export interface ILocalisationController {
    getTranslation(lang: string): Promise<any>;
    setLang(lang: string): Promise<any>;
}

export class LocalisationController implements ILocalisationController {

    constructor(private translationDataProvider: ITranslationDataProvider,
        private context: IUserContext,
        private redis: IRedisClientWrapper) { }
    
    public async setLang(lang: string): Promise<any> {
        Guard.isTruthy(lang, 'lang is required');
        if(this.context.isAuthenticated){
             //update context
        
            const sessionId = this.context.sessionId;
            const sessionValue = await this.redis.get(sessionId);
            const sessionModel = JSON.parse(sessionValue) as SessionModel;

            sessionModel.lang = lang;

            await this.redis.set(sessionId, JSON.stringify(sessionModel));

        }

        const response = new SetLangResponse();
        return response;
    }

    public getTranslation(lang: string): Promise<any> {
        Guard.isTruthy(lang, 'lang is required');

        const translation = this.translationDataProvider.getDataForLang(lang, false);

        return translation;
    }

}