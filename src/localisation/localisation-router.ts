import { Bootstrapper } from "../bootstrapper";
import { IUserContext } from "../common/user-context";
import { ExpressAppWrapper } from "../http/express-app-wrapper";
import { ILocalisationController } from "./localisation-controller";

export class LocalisationRouter {
    public static GET_TRANSLATION = '/api/translation';
    public static SET_LANG = '/api/translation/lang';

    constructor(
        private readonly expressApp: ExpressAppWrapper
    ){}

    public registerRoutes(): void {
        this.expressApp.get(LocalisationRouter.GET_TRANSLATION, async(req, res, next) => {
            const context = req.context as IUserContext;

            const controller: ILocalisationController = Bootstrapper.getLocalisationController(context);
            const response = controller.getTranslation(req.query.lang);
            res.json(response);

        });

        this.expressApp.post(LocalisationRouter.SET_LANG, async(req, res, next) => {
            const context = req.context as IUserContext;

            const controller: ILocalisationController = Bootstrapper.getLocalisationController(context);
            
            const response = await controller.setLang(req.body.lang);
            res.json(response);
        });

    }
}