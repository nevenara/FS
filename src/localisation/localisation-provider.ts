import { IUserContext } from "../common/user-context";
import { ITranslationDataProvider } from "./translation-data-provider";

export interface ILocalisationProvider {
    translate(value: string, lang?: string): string;
}

//Responsible for translation/localisation of our app
export class LocalisationProvider {

    constructor(
        private userContext: IUserContext,
        private translationDataProvider: ITranslationDataProvider) {
    }

    public translate(value: string, lang?: string): string {
        
        const langData = this.translationDataProvider.getDataForLang( this.userContext && this.userContext.lang ? this.userContext.lang :  lang || 'en', true);
        return langData[value];
    }
}