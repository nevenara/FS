import { Bootstrapper } from "../bootstrapper";
import { IUserContext } from "../common/user-context";
import { ExpressAppWrapper } from "../http/express-app-wrapper";
import { ProxyAsAnotherUserRequest, ProxyAsAnotherUserResponse } from "./models/proxy-as-another-user-request";
import { ProxyController } from "./proxy-controller";

export class ProxyRouter{
    public static PROXY_AS_ANOTHER_USER = '/proxy/admin/login';
    public static LOGOUT_PROXY_AS_ANOTHER_USER = '/proxy/admin/logout';

    constructor(private readonly expressApp: ExpressAppWrapper) { }

    public registerRoutes(): void{
        this.expressApp.post(ProxyRouter.PROXY_AS_ANOTHER_USER, async (req, res, next) => {
           
            const context = req.context as IUserContext;
            
            const controller: ProxyController =
                Bootstrapper.getProxyController(context);

            const request = new ProxyAsAnotherUserRequest();
            
            request.userId = req.body.userId;

            const response: ProxyAsAnotherUserResponse = await controller.proxyAsAnotherUser(request);

            res.json(response);
        });

        this.expressApp.post(ProxyRouter.LOGOUT_PROXY_AS_ANOTHER_USER, async (req, res, next) => {
           
            const context = req.context as IUserContext;
            
            const controller: ProxyController =
                Bootstrapper.getProxyController(context);

            await controller.logout();

            res.json({});
        });
    }
}