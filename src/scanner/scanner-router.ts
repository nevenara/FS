import { Bootstrapper } from "../bootstrapper";
import { IScannerContext } from "../common/scanner-context";
import { ExpressAppWrapper } from "../http/express-app-wrapper";
import { ISelfieImageValue } from "../selfie-image/selfie-image-value";
import { LoginRequest } from "./models/login-request";
import { LoginResponse } from "./models/login-response";
import { NoFacematchRequest } from "./models/no-facematch-request";
import { ScanCodeRequest } from "./models/scan-code-request";
import { ScanCodeResponse } from "./models/scan-code-response";
import { SearchCheckInListRequest } from "./models/search-check-in-list-request";
import { SearchCheckInListResponse } from "./models/search-check-in-list-response";
import { IScannerController } from "./scanner-controller";

export class ScannerRouter {
    
    public static LOGIN_URL = '/scanner/login';
    public static LOGOUT_URL = '/scanner/logout';
    public static GET_EVENT_DETAILS_URL = '/scanner/geteventdetails';
    public static SCAN_CODE_URL = '/scanner/scancode';
    public static NO_FACEMATCH_URL = '/scanner/nofacematch';
    public static QR_INVALID_URL = '/scanner/qrinvalid';
    public static SEARCH_CHECK_IN_LIST_URL = '/scanner/search';
    public static GET_SELFIE_IMAGE_URL = '/scanner/selfieimage';
    public static GET_EVENT_IMAGE_URL = '/scanner/eventimage';

    constructor(private readonly expressApp: ExpressAppWrapper) { }

    public registerRoutes(): void {

        this.expressApp.post(ScannerRouter.LOGIN_URL, async (req, res, next) => {
            const context = req.scannerContext as IScannerContext;
            const userAgent: string = req.headers['user-agent'];
            const request = new LoginRequest();

            request.email = req.body.email;
            request.eventId = req.body.eventId;

            const controller: IScannerController = Bootstrapper.getScannerController(context);

            const response: LoginResponse = await controller.login(request, userAgent);

            if(response.sessionId) {
                const cookieManager = Bootstrapper.getCookieManager();
                cookieManager.setCookie(req, res, response.sessionId);
            }

            res.json(response);
        });

        this.expressApp.post(ScannerRouter.LOGOUT_URL, async (req, res, next) => {
            const context = req.scannerContext as IScannerContext;
            const controller: IScannerController = Bootstrapper.getScannerController(context);

            const data = await controller.logout();

            res.json(data);
        });

        this.expressApp.get(ScannerRouter.GET_EVENT_DETAILS_URL, async (req, res, next) => {
            const context = req.scannerContext as IScannerContext;
            const controller: IScannerController = Bootstrapper.getScannerController(context);

            const data = await controller.getEventDetails();

            res.json(data);
        });

        this.expressApp.post(ScannerRouter.SCAN_CODE_URL, async (req, res, next) => {
            const context = req.scannerContext as IScannerContext;
            const controller: IScannerController = Bootstrapper.getScannerController(context);
            const request = new ScanCodeRequest();

            request.qrUuid = req.body.qrUuid;


            const response: ScanCodeResponse = await controller.scanCode(request);

            res.json(response);
        });

        this.expressApp.post(ScannerRouter.NO_FACEMATCH_URL, async (req, res, next) => {
            const context = req.scannerContext as IScannerContext;
            const controller: IScannerController = Bootstrapper.getScannerController(context);
            const request = new NoFacematchRequest();

            request.checkInId = req.body.checkInId;

            const response: ScanCodeResponse = await controller.noFacematch(request);

            res.json(response);
        });

        this.expressApp.get(ScannerRouter.QR_INVALID_URL, async (req, res, next) => {
            const context = req.scannerContext as IScannerContext;
            const controller: IScannerController = Bootstrapper.getScannerController(context);

            const response: ScanCodeResponse = await controller.qrInvalid();

            res.json(response);
        });

        this.expressApp.post(ScannerRouter.SEARCH_CHECK_IN_LIST_URL, async (req, res, next) => {
            const context = req.scannerContext as IScannerContext;
            const controller: IScannerController = Bootstrapper.getScannerController(context);
            const request = new SearchCheckInListRequest();

            request.textSearch = req.body.textSearch;
            request.limit = req.body.limit;
            request.page = req.body.page;


            const response: SearchCheckInListResponse = await controller.search(request);

            res.json(response);
        });

        this.expressApp.get(ScannerRouter.GET_SELFIE_IMAGE_URL, async (req, res, next) => {
            const context = req.scannerContext as IScannerContext;

            const controller: IScannerController = Bootstrapper.getScannerController(context);

            const selfieImage: ISelfieImageValue = await controller.getSelfieImage(req.query.ticketId);

            if(selfieImage){
                res.set('Content-Type', selfieImage.mimetype);
                res.send(Buffer.from(selfieImage.image));
            }
            else{
                const image = await controller.getDefaultSelfieImage(true);
                res.set('Content-Type', 'image/png');
                res.send(image);
            }
        });

        this.expressApp.get(ScannerRouter.GET_EVENT_IMAGE_URL, async (req, res, next) => {
            const context = req.scannerContext as IScannerContext;

            const controller: IScannerController = Bootstrapper.getScannerController(context);

            const eventImage: ISelfieImageValue = await controller.getEventImage();

            if(eventImage){
                res.set('Content-Type', eventImage.mimetype);
                res.send(Buffer.from(eventImage.image));
            }
            else{
                const image = await controller.getDefaultEventImage();
                res.set('Content-Type', 'image/png');
                res.send(image);
            }
        });
    }
}