import { Bootstrapper } from "../../bootstrapper";
import { IUserContext } from "../../common/user-context";
import { ExpressAppWrapper } from "../../http/express-app-wrapper";
import { IConfigsController } from "./configs-controller";
import { GetConfigsResponse } from "./models/get-configs-response";
import { UpdateConfigsRequest } from "./models/update-configs-request";
import { UpdateConfigsResponse } from "./models/update-configs-response";

export class ConfigsRouter {
    public static GET_CONFIGS_API_URL = '/configs/getconfigs';
    public static UPDATE_CONFIGS_API_URL = '/configs/updateconfigs';

    constructor(private readonly expressApp: ExpressAppWrapper){}

    public registerRoutes(): void {
        this.expressApp.get(ConfigsRouter.GET_CONFIGS_API_URL, async (req, res) => {
            const context = req.context as IUserContext;

            const controller: IConfigsController = Bootstrapper.getConfigsController(context);
            const response: GetConfigsResponse = await controller.getConfigs();

            res.json(response);
        });

        this.expressApp.post(ConfigsRouter.UPDATE_CONFIGS_API_URL, async (req, res) => {
            const context = req.context as IUserContext;
            const request: UpdateConfigsRequest = new UpdateConfigsRequest();
            request.configs = req.body.configs;

            const controller: IConfigsController = Bootstrapper.getConfigsController(context);
            const response: UpdateConfigsResponse = await controller.updateConfigs(request);

            res.json(response);
        });
    }
}
