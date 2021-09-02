import moment = require("moment");
import { ValidationError } from "../common/errors/validation-error";
import { LocalisationKey } from "../localisation/localisation-key";
import { IPasswordRecoveryRequestValue } from "./password-recovery-request-value";
import { Validator } from "../common/validator";
import { PasswordRecoveryRequest } from "./models/password-recovery-request";

export interface IPasswordRecoveryValidator{
    validatePasswordRecovery(request: PasswordRecoveryRequest);
    validateUuid(passwordRecoveryRequest: IPasswordRecoveryRequestValue);

}

export class PasswordRecoveryValidator extends Validator implements IPasswordRecoveryValidator {

    public validatePasswordRecovery(request: PasswordRecoveryRequest) {
        this.validatePasswordFormat(request.password);
    }

    public validateUuid(passwordRecoveryRequest: IPasswordRecoveryRequestValue) {
        if(passwordRecoveryRequest.expirationTime < moment().toDate()){
            throw new ValidationError(this.localisationProvider.translate(LocalisationKey.ForgottenPasswordLinkExpired));
        }
    }
}