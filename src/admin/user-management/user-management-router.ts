import { json } from "express";
import { UserAdditionalEmailsDbObject } from "../../additional-emails/user-additional-emails-db-object";
import { Bootstrapper } from "../../bootstrapper";
import { IUserContext } from "../../common/user-context";
import { ExpressAppWrapper } from "../../http/express-app-wrapper";
import { ExportPdfUserManagementController } from "./export-pdf-user-management-controller";
import { IExportUserManagementController } from "./export-user-management-controller";
import { AddUserManagementRequest } from "./models/add-user-management-request";
import { AddUserManagementResponse } from "./models/add-user-management-response";
import { DeleteUserManagementRequest } from "./models/delete-user-management-request";
import { DeleteUserManagementResponse } from "./models/delete-user-management-response";
import { EditUserManagementRequest } from "./models/edit-user-management-request";
import { EditUserManagementResponse } from "./models/edit-user-management-response";
import { SearchUserManagementRequest } from "./models/search-user-management-request";
import { SearchUserManagementResponse, UserManagementResponse } from "./models/search-user-management-response";
import { IUserManagementController } from "./user-management-controller";

export class UserManagementRouter {
    public static SEARCH_USER_MANAGEMENT_URL = '/usermanagement/adminpanel/search';
    public static EXPORT_EXCEL_ADMIN_PANEL_USER_MANAGEMENT_URL = '/usermanagement/adminpanel/exportexcel';
    public static EXPORT_CSV_ADMIN_PANEL_USER_MANAGEMENT_URL = '/usermanagement/adminpanel/exportcsv';
    public static EXPORT_PDF_ADMIN_PANELL_USER_MANAGEMENT_URL = '/usermanagement/adminpanel/exportpdf';

    public static EDIT_USER_MANAGEMENT_URL = '/usermanagement/adminpanel/edit';
    public static DELETE_USER_MANAGEMENT_URL = '/usermanagement/adminpanel/delete';
    public static ADD_USER_MANAGEMENT_URL = '/usermanagement/adminpanel/add';

    constructor(private readonly expressApp: ExpressAppWrapper){}

    public registerRoutes(): void {
        this.expressApp.post(UserManagementRouter.SEARCH_USER_MANAGEMENT_URL, async (req, res, next) => {
            const context = req.context as IUserContext;

            const request: SearchUserManagementRequest = this.getSearchUserManagementRequest(req);
            const controller: IUserManagementController = Bootstrapper.getUserManagementController(context);
            const response: SearchUserManagementResponse = await controller.search(request);

            res.json(response);
        });

        this.expressApp.post(UserManagementRouter.EXPORT_EXCEL_ADMIN_PANEL_USER_MANAGEMENT_URL, async (req, res, next) => {
            const context = req.context as IUserContext;

            const controller: IUserManagementController =
                Bootstrapper.getUserManagementController(context);

            const request: SearchUserManagementRequest = this.getSearchUserManagementRequest(req);

            const response: SearchUserManagementResponse =
                await controller.search(request);

            const exportController: IExportUserManagementController =
                Bootstrapper.getExportUserManagementController(context);

            await exportController.exportExcel(response, res);
        });

        this.expressApp.post(UserManagementRouter.EXPORT_CSV_ADMIN_PANEL_USER_MANAGEMENT_URL, async (req, res, next) => {
            const context = req.context as IUserContext;

            const controller: IUserManagementController =
                Bootstrapper.getUserManagementController(context);

            const request: SearchUserManagementRequest = this.getSearchUserManagementRequest(req);

            const response: SearchUserManagementResponse =
                await controller.search(request);

            const exportController: IExportUserManagementController =
                Bootstrapper.getExportUserManagementController(context);

            await exportController.exportCSV(response, res);
        });

        this.expressApp.post(UserManagementRouter.EXPORT_PDF_ADMIN_PANELL_USER_MANAGEMENT_URL, async (req, res, next) => {
            const context = req.context as IUserContext;

            const controller: IUserManagementController =
                Bootstrapper.getUserManagementController(context);

            const request: SearchUserManagementRequest = this.getSearchUserManagementRequest(req);

            const response: SearchUserManagementResponse =
                await controller.search(request);

            const exportController: ExportPdfUserManagementController =
                Bootstrapper.getExportPDFManagementController(context);

            await exportController.exportPDF(response, res);
        });

        this.expressApp.post(UserManagementRouter.EDIT_USER_MANAGEMENT_URL, async (req, res, next) => {
            const context = req.context as IUserContext;

            const controller: IUserManagementController =
                Bootstrapper.getUserManagementController(context);

            const request: EditUserManagementRequest = new EditUserManagementRequest();
            request.userId = req.body.userId;
            request.email = req.body.email;
            request.firstname = req.body.firstname;
            request.lastname = req.body.lastname;
            request.permissions = req.body.permissions;
           
            const response: EditUserManagementResponse = await controller.edit(request);

            return res.json(response);

        });

        this.expressApp.post(UserManagementRouter.DELETE_USER_MANAGEMENT_URL, async (req, res, next) => {
            const context = req.context as IUserContext;

            const controller: IUserManagementController =
                Bootstrapper.getUserManagementController(context);

            const request: DeleteUserManagementRequest = new DeleteUserManagementRequest();
            request.userId = req.body.userId;
           
            const response: DeleteUserManagementResponse = await controller.delete(request);

            return res.json(response);

        });

        this.expressApp.post(UserManagementRouter.ADD_USER_MANAGEMENT_URL, async (req, res, next) => {
            const context = req.context as IUserContext;

            const controller: IUserManagementController =
                Bootstrapper.getUserManagementController(context);

            const request: AddUserManagementRequest = new AddUserManagementRequest();
            request.firstname = req.body.firstname;
            request.lastname = req.body.lastname;
            request.email = req.body.email;
            request.permissions = req.body.permissions;
           
            const response: AddUserManagementResponse = await controller.add(request);

            return res.json(response);

        });
    }

    private getSearchUserManagementRequest(req: any): SearchUserManagementRequest {
        return {
            textSearch: req.body.textSearch,
            permissions: req.body.permissions,
            lastLoginFrom: req.body.lastLoginFrom,
            lastLoginTo: req.body.lastLoginTo,
            limit: req.body.limit,
            page: req.body.page,
            sortField: req.body.sortField,
            sortOrder: req.body.sortOrder
        };
            
    }
}