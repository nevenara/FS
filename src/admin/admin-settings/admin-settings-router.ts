import { ExpressAppWrapper } from "../../http/express-app-wrapper";
import { UploadDefaultProfileImageRequest } from "./models/upload-default-profile-image-response";
import { UploadDefaultProfileImageResponse } from "./models/upload-default-profile-image-request";
import { Bootstrapper } from "../../bootstrapper";
import { IUserContext } from "../../common/user-context";
import { IAdminSettingsController } from "./admin-settings-controller";
import { UploadDefaulOrganizerImageRequest } from "./models/upload-default-organizer-image-request";

const multer = require('multer');
var storage = multer.memoryStorage();
var upload = multer({ storage: storage });

export class AdminSettingsRouter {
    public static UPLOAD_DEFAULT_PROFILE_IMAGE_URL = '/uploaddefaultprofileimage';
    public static UPLOAD_DEFAULT_ORGANIZER_IMAGE_URL = '/uploaddefaultorganizerimage';

    constructor(private readonly expressApp: ExpressAppWrapper){}

    public registerRoutes(): void {
        this.expressApp.postWithFile(AdminSettingsRouter.UPLOAD_DEFAULT_PROFILE_IMAGE_URL, upload.single('profileImage'), async (req, res, next) => {
            const context = req.context as IUserContext;

            const request = new UploadDefaultProfileImageRequest();

            request.profileImage = req.file;

            const controller: IAdminSettingsController = Bootstrapper.getAdminSettingsController(context);

            const response: UploadDefaultProfileImageResponse = await controller.uploadDefaultProfileImage(request);

            res.json(response);   
        });

        this.expressApp.postWithFile(AdminSettingsRouter.UPLOAD_DEFAULT_ORGANIZER_IMAGE_URL, upload.single('image'), async (req, res, next) => {
            const context = req.context as IUserContext;

            const request = new UploadDefaulOrganizerImageRequest();

            request.image = req.file;

            const controller: IAdminSettingsController = Bootstrapper.getAdminSettingsController(context);

            const response: UploadDefaultProfileImageResponse = await controller.uploadDefaultOrganizerImage(request);

            res.json(response);   
        });
    }
}
