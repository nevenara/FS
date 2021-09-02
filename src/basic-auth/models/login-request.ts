import { timeStamp } from "console";
import { Bootstrapper } from "../../bootstrapper";
import { ValidationError } from "../../common/errors/validation-error";
import { LocalisationKey } from "../../localisation/localisation-key";
import { ApplicationType } from "./application-type";

export class LoginRequest{
    //this field can be treated as username or an email...
    public username: string;
    public password: string;
    public applicationType: ApplicationType; 
    public lang: string;

    public valiate(){
        const localisationProvider = Bootstrapper.getLocalisationProvider();
        
        if(this.lang){
            if(!['de', 'en'].includes(this.lang)){
                throw new ValidationError(localisationProvider.translate(LocalisationKey.InvalidLang, this.lang));
            }
        }
        
        if(!this.username || !this.password){
            throw new ValidationError(localisationProvider.translate(LocalisationKey.UserNameAndPasswordRequired, this.lang || 'en'));
        } 

        if (!(<any>Object).values(ApplicationType).includes(+this.applicationType)) {
            throw new ValidationError(localisationProvider.translate(LocalisationKey.InvalidApplicationType));
        }

    }
}