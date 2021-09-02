import { Bootstrapper } from "../bootstrapper";
import { IUserContext } from "../common/user-context";
import { ExpressAppWrapper } from "../http/express-app-wrapper";
import { PasswordRecoveryInitRequest } from "./models/password-recovery-init-request";
import { PasswordRecoveryInitResponse } from "./models/password-recovery-init-response";
import { PasswordRecoveryRequest } from "./models/password-recovery-request";
import { PasswordRecoveryResponse } from "./models/password-recovery-response";
import { IPasswordRecoveryController } from "./password-recovery-controller";

export class PasswordRecoveryRouter{
    public static PASSWORDRECOVERYURL = "/passwordrecovery/recover";
    public static PASSWORD_RECOVERY_INIT_URL = "/passwordrecovery";
    
    constructor(
        private readonly expressApp: ExpressAppWrapper
    ){}

    public registerRoutes(): void{
        this.expressApp.post(PasswordRecoveryRouter.PASSWORD_RECOVERY_INIT_URL, async (req, res, next) => {
            let request = new PasswordRecoveryInitRequest();

            request.email = req.body.email;
            request.lang = req.body.lang;
            
            const controller: IPasswordRecoveryController = Bootstrapper.getPasswordRecoveryController(req.context as IUserContext);
            const response: PasswordRecoveryInitResponse = await controller.resetPasswordGenerateLink(request);
            res.json(response);
        });

        this.expressApp.post(PasswordRecoveryRouter.PASSWORDRECOVERYURL, async (req, res, next) => {
            let request = new PasswordRecoveryRequest();

            request.password = req.body.password;
            request.confirmPassword = req.body.confirmPassword;
            request.uuid = req.body.uuid;
            request.lang = req.body.lang;

            const controller: IPasswordRecoveryController = Bootstrapper.getPasswordRecoveryController(req.context as IUserContext);
            const response: PasswordRecoveryResponse = await controller.resetPassword(request);
            res.json(response);
        });        
    }
}