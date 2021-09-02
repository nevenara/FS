import { ExpressAppWrapper } from "../http/express-app-wrapper";
import { Bootstrapper } from "../bootstrapper";
import { AuthenticationController, IAuthenticationController } from "./authentication-controller";
import { LoginRequest } from "./models/login-request";
import { LoginResponse } from "./models/login-response";
import { IUserContext } from "../common/user-context";
import { SessionController } from "./session-controller";

export class AuthenticationRouter {
    public static LOGINURL: string = '/login';
    public static LOGOUTURL: string = '/logout';
    public static KEEPSESSIONALIVE: string = '/session/keepalive';

    constructor(private readonly expressApp: ExpressAppWrapper) { }

    public registerRoutes(): void {

        this.expressApp.post(AuthenticationRouter.LOGOUTURL, async (req, res) => {
            const context = req.context as IUserContext;

            const controller: IAuthenticationController = Bootstrapper.getAuthenticationController(context);

            const data = await controller.logout();

            res.json(data);
        });

        this.expressApp.post(AuthenticationRouter.KEEPSESSIONALIVE, async (req, res) => {
            const context = req.context as IUserContext;

            const controller: SessionController = Bootstrapper.getSessionController(context);

            const data = await controller.keepSessionAlive();

            res.json(data);
        });

        this.expressApp.get('/usercontext', async (req, res) => {
            const context = req.context as IUserContext;

            const authController: IAuthenticationController = Bootstrapper.getAuthenticationController(context);

            const userContext = await authController.getUserContext();

            res.json(userContext);
        });

        this.expressApp.post(AuthenticationRouter.LOGINURL, async (req, res, next) => {
            const context = req.context as IUserContext;
            const userAgent: string = req.headers['user-agent'];

            const request = new LoginRequest();

            request.username = req.body.username;
            request.password = req.body.password;
            request.applicationType = req.body.applicationType;
            request.lang = req.body.lang;

            const authController: IAuthenticationController = Bootstrapper.getAuthenticationController(context);

            const response = await authController.login(request, userAgent);

            if(response.sessionId) {
                const cookieManager = Bootstrapper.getCookieManager();
                cookieManager.setCookie(req, res, response.sessionId);
            }
            

            res.json(response);
        })
    }
}