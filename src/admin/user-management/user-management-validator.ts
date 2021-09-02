import { EmailValidator } from "../../common/email-validator";

export interface IUserManagementValidator {
    validateUserManagementEmail(email: string);
}

export class UserManagementValidator extends EmailValidator implements IUserManagementValidator{

    public async validateUserManagementEmail(email: string) {
        await this.validateEmail(email, true);
    }
}