import { ExpressAppWrapper } from "../http/express-app-wrapper";
import { IUserContext } from "../common/user-context";
import { SyncTicketRequest } from "./model/sync-ticket-request";
import { ITicketController, TicketController } from "./ticket-controller";
import { Bootstrapper } from "../bootstrapper";
import { SyncTicketResponse } from "./model/sync-ticket-response";
import { SearchTicketsRequest } from "./model/search-ticket-request";
import { ISearchTicketController } from "./search-ticket-controller";
import { SearchTicketsResponse } from "./model/search-ticket-response";
import { SellTicketsRequest } from "./model/sell-tickets-request";
import { SellTicketsResponse } from "./model/sell-tickets-response";
import { ITicketSaleController } from "./ticket-sale-controller";
import { TicketOnSaleRequest } from "./model/ticket-on-sale-request";
import { EditTicketSaleRequest } from "./model/edit-ticket-sale-request";
import { EditTicketSaleResponse } from "./model/edit-ticket-sale-response";
import { DeleteTicketSaleRequest } from "./model/delete-ticket-sale-request";
import { DeleteTicketSaleResponse } from "./model/delete-ticket-sale-response";
import { GetUserTicketsFromSameEventResponse } from "./model/get-user-tickets-from-same-event-response";
import { GetUserTicketsFromSameEventRequest } from "./model/get-user-tickets-from-same-event-request";
import { SearchSaleTicketsRequest } from "./model/search-sale-tickets-request";
import { ReserveTicketsRequest } from "./model/reserve-tickets-request";
import { ReserveTicketsResponse } from "./model/reserve-tickets-response";
import { CancelTicketReservationRequest } from "./model/cancel-ticket-reservation-request";
import { CancelTicketReservationResponse } from "./model/cancel-ticket-reservation-response";
import { PayTicketsRequest, TicketBuy } from "./model/pay-tickets-request";
import { PayTicketsResponse } from "./model/pay-tickets-response";
import { ReturnTicketRequest } from "./model/return-ticket-request";
import { ReturnTicketResponse } from "./model/return-ticket-response";
import { SearchMySaleTicketsRequest } from "./model/search-my-sale-tickets-request";
import { GetTicketDetailsRequest } from "./model/get-ticket-details-request";
import { GetTicketDetailsResponse } from "./model/get-ticket-details-response";
import { RepersonalizeTicketRequest } from "./model/re-personalize-ticket-request";
import { CompleteTicketRepersonalizationRequest } from "./model/complete-ticket-repersonalization-request";
import { ITicketPersonalizationController, TicketPersonalizationController } from "./ticket-personalization-controller";
import { GetNonPersonalizedTicketsResponse } from "./model/get-non-personalized-tickets-response";
import { GetNonPersonalizedTicketsByEventRequest } from "./model/get-non-personalized-tickets-by-event-request";
import { GetNonPersonalizedTicketsByEventResponse } from "./model/get-non-personalized-tickets-by-event-response";
import { ChangeFirstNameAndLastnameRequest } from "./model/change-firstname-and-lastname-request";
import { ChangeFirstnameAndLastnameResponse } from "./model/change-firstname-and-lastname-response";
import { SendEmailChangeFirstAndLastNameRequest } from "./model/send-email-change-first-and-lastname-request";
import { SendEmailChangeFirstAndLastNameResponse } from "./model/send-email-change-first-and-lastname-response";
import { AssignTicketRequest } from "./model/assign-ticket-request";
import { AssignTicketResponse } from "./model/assign-ticket-response";
import { GetEventsResponse } from "./model/get-events-response";
import { GetMarketplaceLocationsResponse } from "./model/get-locations-response";
import { GetMarketplacePriceRangeResponse } from "./model/get-marketplace-price-range-response";
import { GetTicketCategoriesResponse } from "./model/get-ticket-categories-response";
import { SearchAdminPanelTicketsRequest } from "./model/search-admin-panel-tickets-request";
import { IExportTicketController } from "./export-ticket-controller";
import { GetNonPersonalizedTicketsRequest } from "./model/get-non-personalized-tickets-request";
import { ExportPdfTicketController } from "./export-pdf-ticket-controller";
import { GetTicketsForSaleFromSameEventRequest } from "./model/get-tickets-for-sale-from-same-event-request";
import { GetTicketsForSaleFromSameEventResponse } from "./model/get-tickets-for-sale-from-same-event-response";
import { IEventController } from "../events/event-controller";
import { IEventValue } from "../events/event-value";
import { AdminTicketController } from "./admin-ticket-controller";
import { GetAdminTicketDetailsRequest, GetAdminTicketDetailsResponse } from "./model/get-admin-ticket-details-request";
import { GetTicketDetailsForRepersonalizationResponse } from "./model/get-ticket-details-for-repersonalization-response";
import { InputDateParameterParseUtil } from "./model/input-date-parameter-parse";
import { GetAdminPanelUserDetailsRequest } from "../user-profile/models/get-admin-panel-user-details-request";
import { GetChangeHistoryRequest } from "./model/get-change-history-request";
import { GetChangeHistoryResponse } from "./model/get-change-history-response";
import { IExportChangeHistoryController } from "./export-change-history-controller";
import { ExportPdfChangeHistoryController } from "./export-pdf-change-history-controller";
import { ChangeTicketHolderRequest } from "./model/change-ticket-holder-request";
import { ChangeTicketHolderResponse } from "./model/change-ticket-holder-response";
import { AssignTicketAdminPanelResponse } from "./model/assign-ticket-admin-panel-response";
import { AssignTicketAdminPanelRequest } from "./model/assign-ticket-admin-panel-request";
import { SearchByFirstAndLastNameRequest } from "./model/search-by-firstname-and-lastname-request";
import { SearchByFirstAndLastNameResponse } from "./model/search-by-firstname-and-lastname-response";
import { GetUsernamesAndEmailsRepersonalizationRequest } from "./model/get-usernames-and-emails-repersonalization-request";
import { Environment } from "../environment";
import { GetQRCodeResponse } from "./model/get-qr-code-response";
import { GenerateQrCodeRequest } from "./model/generate-qr-code-request";
import { IdVerificationPageType } from "./model/id-verification-page-type";
import { IQRUrlParamsValue } from "../qr-url-params/qr-url-params-value";
import { IQRUrlParamsController } from "../qr-url-params/qr-url-params-controller";
import { GetQRUrlParamsResponse } from "./model/get-gr-url-params-response";

const multer = require('multer');
var storage = multer.memoryStorage();
var upload = multer({ storage: storage });

export class TicketsRouter {
    public static SYNC_TICKET_API_URL = '/tickets/syncticket';
    public static GET_UPCOMING_EVENTS = '/tickets/upcomingevents';
    public static GET_VISITED_EVENTS = '/tickets/visitedevents';
    public static GET_TICKET_CATEGORIES = '/tickets/categories';

    public static SELL_TICKETS_API_URL = '/ticketsale/selltickets';
    public static EDIT_TICKET_SALE_API_URL = '/ticketsale/editticketsale';
    public static DELETE_TICKET_SALE_API_URL = '/ticketsale/deleteticketsale';
    public static GET_TICKETS_FROM_SAME_EVENT_API_URL = '/ticketsale/getticketsfromsameevent'
    public static GET_TICKETS_FOR_SALE_FROM_SAME_EVENT_API_URL = '/ticketsale/getticketsforsalefromsameevent'

    public static SEARCH_SALE_TICKETS_API_URL = '/tickets/marketplace';
    public static SEARCH_MY_SALE_TICKETS_API_URL = '/tickets/mysales';
    public static GET_MARKETPLACE_LOCATIONS_URL = '/tickets/marketplace/locations';
    public static GET_MARKETPLACE_PRICE_RANGE_URL = '/tickets/marketplace/pricerange';

    public static RESERVE_TICKETS_API_URL = '/tickets/buytickets/reservetickets';
    public static CANCEL_RESERVATION_API_URL = '/tickets/buytickets/cancelreservation';
    public static START_BUY_TICKETS_API_URL = '/tickets/buytickets/startbuyflow';

    public static RETURN_TICKET_URL = '/tickets/returnticket';
    public static GET_TICKET_DETAILS_URL = '/tickets/ticketdetails';
    public static GET_TICKET_DETAILS_FOR_REPERSONALIZATION_URL = '/tickets/ticketdetailsforrepersonalization';
    public static REPERSONALIZE_TICKET_URL = '/tickets/repersonalize';
    public static GET_USERNAMES_AND_EMAILS_REPERSONALIZATION_URL = '/tickets/getusernamesandemailsrepersonalization';

    public static GET_NON_PERSONALIZED_TICKETS_API_URL = '/tickets/personalization/getnonpersonalizedtickets';
    public static GET_NON_PERSONALIZED_TICKETS_BY_EVENT_API_URL = '/tickets/personalization/getnonpersonalizedticketsbyevent';
    public static CHANGE_FIRST_AND_LAST_NAME = '/tickets/personalization/changefirstandlastname';
    public static SEND_EMAIL_CHANGE_FIRST_AND_LAST_NAME = '/tickets/personalization/sendemailchangefirstandlastname';
    public static ASSIGN_TICKETS_API_URL = '/tickets/personalization/assigntickets';
    public static CHANGE_TICKET_HOLDER_URL = '/tickets/changeticketholder';

    public static SEARCH_ADMIN_PANEL_TICKETS = '/tickets/adminpanel/search';
    public static DETAILS_ADMIN_PANEL_TICKETS = '/tickets/adminpanel/details';
    public static EXPORT_EXCEL_ADMIN_PANEL_TICKETS = '/tickets/adminpanel/exportexcel';
    public static EXPORT_CSV_ADMIN_PANEL_TICKETS = '/tickets/adminpanel/exportcsv';
    public static EXPORT_PDF_ADMIN_PANEL_TICKETS = '/tickets/adminpanel/exportpdf';
    public static EVENTS_IMAGE = '/events/image';

    public static GET_CHANGE_HISTORY_ADMIN_PANEL_URL = '/tickets/adminpanel/changehistory/search';
    public static EXPORT_EXCEL_ADMIN_PANEL_CHANGE_HISTORY_URL = '/tickets/adminpanel/changehistory/exportexcel';
    public static EXPORT_CSV_ADMIN_PANEL_CHANGE_HISTORY_URL = '/tickets/adminpanel/changehistory/exportcsv';
    public static EXPORT_PDF_ADMIN_PANEL_CHANGE_HISTORY_URL = '/tickets/adminpanel/changehistory/exportpdf';

    public static TICKET_ASSIGNMENT_ADMIN_PANEL_URL = '/tickets/adminpanel/assignment';
    public static GET_POTENTIAL_TICKET_HOLDERS_URL = '/tickets/adminpanel/searchbyfirstandlastname'

    // trasfer session
    public static CONTINUE_ID_VERIFICATION_ON_MOBILE = '/tickets/qr';
    // generate qr code
    public static GET_QR_CODE_FOR_ID_CHECK = '/tickets/idcheck/qr';
    // decode qr url params
    public static GET_QR_URL_PARAMS = '/qr/params';

    constructor(private readonly expressApp: ExpressAppWrapper) { }

    public registerRoutes(): void {
        this.expressApp.post(TicketsRouter.GET_QR_CODE_FOR_ID_CHECK, async (req, res, next) => {
            const context = req.context as IUserContext;

            const controller: ITicketPersonalizationController = Bootstrapper.getTicketPersonalizationController(context);

            const request = new GenerateQrCodeRequest();
            request.pageType = req.body.pageType;
            request.urlParams = req.body.urlParams;
            request.selectedId = req.body.selectedId;

            const response: GetQRCodeResponse = await controller.generateQRCode(request);

            res.send(response);
        });

        this.expressApp.get(TicketsRouter.CONTINUE_ID_VERIFICATION_ON_MOBILE, async (req, res, next) => {
            const cookieManager = Bootstrapper.getCookieManager();

            const contextFactory = Bootstrapper.getUserContextFactory();
            cookieManager.setCookie(req, res, req.query.sessionId);

            const context = await contextFactory.getUserContext(req.query.sessionId);
            req.context = context;

            const controller: IQRUrlParamsController = Bootstrapper.getQRUrlParamsController(context);
            const response: IQRUrlParamsValue = await controller.getUrlParamsById(req.query.uuid);
            console.log(response)
            switch (response.pageType) {
                case IdVerificationPageType.Personalization:
                    res.redirect(Environment.getWebAppHost() + `/personalization/detail?uuid=${req.query.uuid}`);
                    break;
                case IdVerificationPageType.LinkedAccount:
                        res.redirect(Environment.getWebAppHost() + `/profile/create?uuid=${req.query.uuid}`);
                    break;
                case IdVerificationPageType.Admin:
                    res.redirect(Environment.getAdminPanelHost() + `/admin/users/detail/${response.urlParams}?uuid=${req.query.uuid}`);
                default:
                    break;
            }
           
        
        });

        this.expressApp.get(TicketsRouter.GET_QR_URL_PARAMS, async (req, res, next) => {
            const context = req.context as IUserContext;

            const controller: IQRUrlParamsController = Bootstrapper.getQRUrlParamsController(context);
            const params: IQRUrlParamsValue = await controller.getUrlParamsById(req.query.uuid);
            
            const response = new GetQRUrlParamsResponse();
            response.urlParams = params.urlParams;
            response.selectedId = params.selectedId;
            res.json(response)
           
        });


        this.expressApp.post(TicketsRouter.GET_POTENTIAL_TICKET_HOLDERS_URL, async (req, res, next) => {
            const context = req.context as IUserContext;
            const request = new SearchByFirstAndLastNameRequest();

            request.firstname = req.body.firstname;
            request.lastname = req.body.lastname;

            const controller: ITicketPersonalizationController = Bootstrapper.getTicketPersonalizationController(context);
            const response: SearchByFirstAndLastNameResponse = await controller.searchByFirstAndLastName(request);
            res.json(response);
        });

        this.expressApp.post(TicketsRouter.TICKET_ASSIGNMENT_ADMIN_PANEL_URL, async (req, res, next) => {
            const context = req.context as IUserContext;
            const request = new AssignTicketAdminPanelRequest();

            request.ticketId = req.body.ticketId;
            request.firstname = req.body.firstname;
            request.lastname = req.body.lastname;
            request.userId = req.body.userId;

            const controller: ITicketPersonalizationController = Bootstrapper.getTicketPersonalizationController(context);
            const response: AssignTicketAdminPanelResponse = await controller.assignTicketAdminPanel(request);
            res.json(response);
        });

        this.expressApp.post(TicketsRouter.CHANGE_TICKET_HOLDER_URL, async (req, res, next) => {
            const context = req.context as IUserContext;
            const request = new ChangeTicketHolderRequest();

            request.ticketId = req.body.ticketId;
            request.firstname = req.body.firstname;
            request.lastname = req.body.lastname;

            const controller: ITicketPersonalizationController = Bootstrapper.getTicketPersonalizationController(context);
            const response: ChangeTicketHolderResponse = await controller.changeTicketHolder(request);
            res.json(response);
        });

        this.expressApp.post(TicketsRouter.EXPORT_PDF_ADMIN_PANEL_CHANGE_HISTORY_URL, async (req, res, next) => {
            const context = req.context as IUserContext;

            const controller: ITicketController =
                Bootstrapper.getTicketController(context);

            const request: GetChangeHistoryRequest = new GetChangeHistoryRequest();
            request.ticketId = req.body.ticketId;
            request.page = req.body.page;
            request.limit = req.body.limit;

            const response: GetChangeHistoryResponse = await controller.getChangeHistory(request);


            const exportController: ExportPdfChangeHistoryController =
                Bootstrapper.getExportPdfChangeHistoryController(context);


            await exportController.exportPDF(response, res);

        });

        this.expressApp.post(TicketsRouter.EXPORT_EXCEL_ADMIN_PANEL_CHANGE_HISTORY_URL, async (req, res, next) => {
            const context = req.context as IUserContext;

            const controller: ITicketController =
                Bootstrapper.getTicketController(context);

            const request: GetChangeHistoryRequest = new GetChangeHistoryRequest();
            request.ticketId = req.body.ticketId;
            request.page = req.body.page;
            request.limit = req.body.limit;

            const response: GetChangeHistoryResponse = await controller.getChangeHistory(request);


            const exportController: IExportChangeHistoryController =
                Bootstrapper.getExportChangeHistoryController(context);


            await exportController.exportExcel(response, res);

        });

        this.expressApp.post(TicketsRouter.EXPORT_CSV_ADMIN_PANEL_CHANGE_HISTORY_URL, async (req, res, next) => {
            const context = req.context as IUserContext;

            const controller: ITicketController =
                Bootstrapper.getTicketController(context);

            const request: GetChangeHistoryRequest = new GetChangeHistoryRequest();
            request.ticketId = req.body.ticketId;
            request.page = req.body.page;
            request.limit = req.body.limit;

            const response: GetChangeHistoryResponse = await controller.getChangeHistory(request);


            const exportController: IExportChangeHistoryController =
                Bootstrapper.getExportChangeHistoryController(context);


            await exportController.exportCSV(response, res);

        });

        this.expressApp.post(TicketsRouter.GET_CHANGE_HISTORY_ADMIN_PANEL_URL, async (req, res, next) => {
            const context = req.context as IUserContext;

            const controller: ITicketController =
                Bootstrapper.getTicketController(context);

            const request: GetChangeHistoryRequest = new GetChangeHistoryRequest();
            request.ticketId = req.body.ticketId;
            request.page = req.body.page;
            request.limit = req.body.limit;

            const response: GetChangeHistoryResponse = await controller.getChangeHistory(request);

            res.json(response);

        });

        this.expressApp.get(TicketsRouter.DETAILS_ADMIN_PANEL_TICKETS, async (req, res, next) => {
            const context = req.context as IUserContext;

            const controller: AdminTicketController =
                Bootstrapper.getAdminTicketController(context);

            const request: GetAdminTicketDetailsRequest = new GetAdminTicketDetailsRequest();
            request.ticketId = req.query.ticketId;
            const response: GetAdminTicketDetailsResponse = await controller.getTicketDetails(request);

            res.json(response);
        });

        this.expressApp.get(TicketsRouter.EVENTS_IMAGE, async (req, res, next) => {
            const context = req.context as IUserContext;

            const controller: IEventController =
                Bootstrapper.getEventController(context);

            const event: IEventValue = await controller.getImage(req.query.eventId);

            
            if (event.image) {
                res.set('Content-Type', event.imageMimetype);
                res.send(Buffer.from(event.image));     
            }
            else {
                const image = await controller.getDefaultEventImage();
                res.set('Content-Type', 'image/jpg');
                res.send(image);
            }

        });

        this.expressApp.post(TicketsRouter.EXPORT_PDF_ADMIN_PANEL_TICKETS, async (req, res, next) => {
            const context = req.context as IUserContext;

            const controller: ISearchTicketController =
                Bootstrapper.getSearchTicketsController(context);

            const request: SearchAdminPanelTicketsRequest = this.getSearchAdminPanelTicketsRequest(req);

            const response: SearchTicketsResponse =
                await controller.searchAdminPanelTickets(request);

            const exportController: ExportPdfTicketController =
                Bootstrapper.getExportPDFTicketsController(context);

            await exportController.exportPDF(response, res);
        });

        this.expressApp.post(TicketsRouter.EXPORT_CSV_ADMIN_PANEL_TICKETS, async (req, res, next) => {
            const context = req.context as IUserContext;

            const controller: ISearchTicketController =
                Bootstrapper.getSearchTicketsController(context);

            const request: SearchAdminPanelTicketsRequest = this.getSearchAdminPanelTicketsRequest(req);

            const response: SearchTicketsResponse =
                await controller.searchAdminPanelTickets(request);

            const exportController: IExportTicketController =
                Bootstrapper.getExportTicketsController(context);

            await exportController.exportCSV(response, res);
        });

        this.expressApp.post(TicketsRouter.EXPORT_EXCEL_ADMIN_PANEL_TICKETS, async (req, res, next) => {
            const context = req.context as IUserContext;

            const controller: ISearchTicketController =
                Bootstrapper.getSearchTicketsController(context);

            const request: SearchAdminPanelTicketsRequest = this.getSearchAdminPanelTicketsRequest(req);

            const response: SearchTicketsResponse =
                await controller.searchAdminPanelTickets(request);

            const exportController: IExportTicketController =
                Bootstrapper.getExportTicketsController(context);

            await exportController.exportExcel(response, res);
        });

        this.expressApp.post(TicketsRouter.SEARCH_ADMIN_PANEL_TICKETS, async (req, res, next) => {
            const context = req.context as IUserContext;

            const controller: ISearchTicketController =
                Bootstrapper.getSearchTicketsController(context);

            const request: SearchAdminPanelTicketsRequest = this.getSearchAdminPanelTicketsRequest(req);

            const response = await controller.searchAdminPanelTickets(request);

            res.json(response);
        });

        this.expressApp.postWithFile(
            TicketsRouter.SYNC_TICKET_API_URL,
            upload.fields([
                { name: 'placeholderImage1', maxCount: 1 },
                { name: 'placeholderImage2', maxCount: 1 },
                { name: 'placeholderImage3', maxCount: 1 },
                { name: 'placeholderImage4', maxCount: 1 },
                { name: 'eventImage', maxCount: 1 }]),
            async (req, res, next) => {

                // req.files; 
                const context = req.context as IUserContext;

                const request = new SyncTicketRequest();
                request.email = req.body.email;
                request.additionalInfo = req.body.additionalInfo;
                request.barcode = req.body.barcode;
                request.bookingId = req.body.bookingId;
                request.date = InputDateParameterParseUtil.parseStringAsDateTime(req.body.date);
                request.doorsOpen = InputDateParameterParseUtil.parseStringAsDateTime(req.body.doorsOpen);
                request.eventName = req.body.eventName;
                request.locationAddress = req.body.locationAddress;
                request.locationName = req.body.locationName;
                request.organizer = req.body.organizer;
                request.price = req.body.price;
                request.qrCode = req.body.qrCode;
                request.seat = req.body.seat;
                request.termsOfEvent = req.body.termsOfEvent;
                request.ticketHolder = req.body.ticketHolder;
                request.ticketId = req.body.ticketId;
                request.category = req.body.category;
                request.firstName = req.body.firstName;
                request.lastName = req.body.lastName;

                request.placeholderImages = []; //req.files;

                if (req.files) {
                    if (req.files['placeholderImage1'] && req.files['placeholderImage1'].length) {
                        request.placeholderImages.push(req.files['placeholderImage1'][0])
                    }
                    if (req.files['placeholderImage2'] && req.files['placeholderImage2'].length) {
                        request.placeholderImages.push(req.files['placeholderImage2'][0])
                    }
                    if (req.files['placeholderImage3'] && req.files['placeholderImage3'].length) {
                        request.placeholderImages.push(req.files['placeholderImage3'][0])
                    }
                    if (req.files['placeholderImage4'] && req.files['placeholderImage4'].length) {
                        request.placeholderImages.push(req.files['placeholderImage4'][0])
                    }

                    if (req.files['eventImage'] && req.files['eventImage'].length) {
                        request.eventImage = req.files['eventImage'][0];
                    }
                }


                const controller: ITicketController = Bootstrapper.getTicketController(context)

                const response: SyncTicketResponse = await controller.syncTicket(request);

                res.json(response);
            });

        this.expressApp.post(TicketsRouter.SELL_TICKETS_API_URL, async (req, res, next) => {
            const context = req.context as IUserContext;

            const request = new SellTicketsRequest();
            request.tickets = req.body.tickets as Array<TicketOnSaleRequest>;

            const controller: ITicketSaleController = Bootstrapper.getTicketSaleController(context)

            const response: SellTicketsResponse = await controller.sellTickets(request);

            res.json(response);
        });

        this.expressApp.post(TicketsRouter.EDIT_TICKET_SALE_API_URL, async (req, res, next) => {
            const context = req.context as IUserContext;

            const request = new EditTicketSaleRequest();
            request.tickets = req.body.tickets as Array<TicketOnSaleRequest>;

            const controller: ITicketSaleController = Bootstrapper.getTicketSaleController(context)

            const response: EditTicketSaleResponse = await controller.editTicketSale(request);

            res.json(response);
        });

        this.expressApp.post(TicketsRouter.DELETE_TICKET_SALE_API_URL, async (req, res, next) => {
            const context = req.context as IUserContext;

            const request = new DeleteTicketSaleRequest();
            request.tickets = req.body.tickets as Array<string>;

            const controller: ITicketSaleController = Bootstrapper.getTicketSaleController(context)

            const response: DeleteTicketSaleResponse = await controller.deleteTicketSale(request);

            res.json(response);
        });

        this.expressApp.post(TicketsRouter.GET_TICKETS_FROM_SAME_EVENT_API_URL, async (req, res, next) => {
            const context = req.context as IUserContext;

            const request = new GetUserTicketsFromSameEventRequest();
            request.ticketId = req.body.ticketId;

            const controller: ITicketSaleController = Bootstrapper.getTicketSaleController(context)

            const response: GetUserTicketsFromSameEventResponse = await controller.getTicketsFromSameEvent(request);

            res.json(response);
        });

        this.expressApp.post(TicketsRouter.GET_TICKETS_FOR_SALE_FROM_SAME_EVENT_API_URL, async (req, res, next) => {
            const context = req.context as IUserContext;

            const request = new GetTicketsForSaleFromSameEventRequest();
            request.ticketId = req.body.ticketId;

            const controller: ITicketSaleController = Bootstrapper.getTicketSaleController(context)

            const response: GetTicketsForSaleFromSameEventResponse = await controller.getTicketsForSaleFromSameEvent(request);

            res.json(response);
        });

        this.expressApp.post(TicketsRouter.SEARCH_SALE_TICKETS_API_URL, async (req, res) => {
            const context = req.context as IUserContext;
            const request = new SearchSaleTicketsRequest();
            request.fromDate = req.body.fromDate;
            request.toDate = req.body.toDate;
            request.eventName = req.body.eventName;
            request.categories = req.body.categories;
            request.locations = req.body.locations;
            request.fromPrice = req.body.fromPrice;
            request.toPrice = req.body.toPrice;
            request.page = req.body.page;

            const controller = Bootstrapper.getSearchTicketsController(context);
            let response: SearchTicketsResponse = await controller.searchSaleTickets(request);

            res.json(response);
        });

        this.expressApp.post(TicketsRouter.SEARCH_MY_SALE_TICKETS_API_URL, async (req, res) => {
            const context = req.context as IUserContext;
            let request = new SearchMySaleTicketsRequest();
            request.categories = req.body.categories;
            request.eventName = req.body.eventName;
            request.fromDate = req.body.fromDate;
            request.toDate = req.body.toDate;
            request.page = req.body.page;

            const controller = Bootstrapper.getSearchTicketsController(context);
            let response: SearchTicketsResponse = await controller.searchSaleTicketsByUserAndLinkedAccounts(request);

            res.json(response);
        });

        this.expressApp.post(TicketsRouter.RESERVE_TICKETS_API_URL, async (req, res) => {
            const context = req.context as IUserContext;
            const request = new ReserveTicketsRequest();
            request.ticketId = req.body.ticketId;

            const controller = Bootstrapper.getBuyTicketController(context);
            let response: ReserveTicketsResponse = await controller.reserveTickets(request);

            res.json(response);
        });

        this.expressApp.post(TicketsRouter.CANCEL_RESERVATION_API_URL, async (req, res) => {
            const context = req.context as IUserContext;
            const request = new CancelTicketReservationRequest();
            request.tickets = req.body.tickets;

            const controller = Bootstrapper.getBuyTicketController(context);
            let response: CancelTicketReservationResponse = await controller.cancelReservation(request);

            res.json(response);
        });

        this.expressApp.post(TicketsRouter.START_BUY_TICKETS_API_URL, async (req, res) => {
            const context = req.context as IUserContext;
            const request = new PayTicketsRequest();
            request.tickets = req.body.tickets;
            request.ticketsToCancel = req.body.ticketsToCancel;
            request.paymentMethod = req.body.paymentMethod;

            const controller = Bootstrapper.getBuyTicketController(context);
            let response: PayTicketsResponse = await controller.startBuyTicketFlow(request);

            res.json(response);
        });

        this.expressApp.post(TicketsRouter.RETURN_TICKET_URL, async (req, res) => {
            const context = req.context as IUserContext;
            let request = new ReturnTicketRequest();
            request.id = req.body.id;
            request.acceptedReturnPolicy = req.body.acceptedReturnPolicy;
            request.reasonTicketReturn = req.body.reasonTicketReturn;

            const controller = Bootstrapper.getTicketController(context);
            let response: ReturnTicketResponse = await controller.returnTicket(request);

            res.json(response);
        });

        this.expressApp.post(TicketsRouter.GET_TICKET_DETAILS_URL, async (req, res, next) => {
            const context = req.context as IUserContext;
            let request = new GetTicketDetailsRequest();
            request.ticketId = req.body.ticketId;

            const controller = Bootstrapper.getTicketController(context);
            let response: GetTicketDetailsResponse = await controller.getTicketDetails(request);
            res.json(response);
        });

        this.expressApp.post(TicketsRouter.GET_TICKET_DETAILS_FOR_REPERSONALIZATION_URL, async (req, res, next) => {
            const context = req.context as IUserContext;
            let request = new GetTicketDetailsRequest();
            request.ticketId = req.body.ticketId;

            const controller = Bootstrapper.getRepersonalizeController(context);
            let response: GetTicketDetailsForRepersonalizationResponse = await controller.getTicketDetailsForRepersonalization(request);
            res.json(response);
        });

        this.expressApp.post(TicketsRouter.REPERSONALIZE_TICKET_URL, async (req, res, next) => {
            const context = req.context as IUserContext;
            let request = new RepersonalizeTicketRequest();
            request.ticketId = req.body.ticketId;
            request.usernameOrEmail = req.body.usernameOrEmail;
            request.paymentMethod = req.body.paymentMethod;

            //TEMPORARY FIX BECAUSE OF BUG:
            if (request.usernameOrEmail) {
                request.usernameOrEmail = request.usernameOrEmail.trim();
                const spaceIndex = request.usernameOrEmail.indexOf(' ');

                if (spaceIndex > 0) {
                    request.usernameOrEmail = request.usernameOrEmail.substring(0, spaceIndex);
                }
            }

            const controller = Bootstrapper.getRepersonalizeController(context);

            let response = await controller.repersonalizeTicket(request);
            res.json(response);
        });

        this.expressApp.post(TicketsRouter.GET_USERNAMES_AND_EMAILS_REPERSONALIZATION_URL, async (req, res, next) => {
            const context = req.context as IUserContext;

            const controller = Bootstrapper.getRepersonalizeController(context);

            let request: GetUsernamesAndEmailsRepersonalizationRequest = new GetUsernamesAndEmailsRepersonalizationRequest();
            request.usernameOrEmail = req.body.usernameOrEmail;

            let response = await controller.getUsernamesAndEmails(request);
            res.json(response);
        });

        this.expressApp.post(TicketsRouter.GET_NON_PERSONALIZED_TICKETS_API_URL, async (req, res, next) => {
            const context = req.context as IUserContext;
            const request = new GetNonPersonalizedTicketsRequest();
            request.page = req.body.page;

            const controller: ITicketPersonalizationController = Bootstrapper.getTicketPersonalizationController(context);

            let response: GetNonPersonalizedTicketsResponse = await controller.getNonPersonalizedTickets(request);
            res.json(response);
        });

        this.expressApp.post(TicketsRouter.GET_NON_PERSONALIZED_TICKETS_BY_EVENT_API_URL, async (req, res, next) => {
            const context = req.context as IUserContext;
            let request: GetNonPersonalizedTicketsByEventRequest = new GetNonPersonalizedTicketsByEventRequest();
            request.eventId = req.body.eventId;
            request.syncDate = req.body.syncDate;

            const controller: ITicketPersonalizationController = Bootstrapper.getTicketPersonalizationController(context);

            let response: GetNonPersonalizedTicketsByEventResponse = await controller.getNonPersonalizedTicketsByEvent(request);
            res.json(response);
        });

        this.expressApp.post(TicketsRouter.CHANGE_FIRST_AND_LAST_NAME, async (req, res, next) => {
            const context = req.context as IUserContext;
            const request = new ChangeFirstNameAndLastnameRequest();

            request.ticketId = req.body.ticketId;
            request.firstName = req.body.firstName;
            request.lastName = req.body.lastName;

            const controller: ITicketPersonalizationController = Bootstrapper.getTicketPersonalizationController(context);
            const response: ChangeFirstnameAndLastnameResponse = await controller.changeFirstnameAndLastname(request);
            res.json(response);
        });

        this.expressApp.post(TicketsRouter.SEND_EMAIL_CHANGE_FIRST_AND_LAST_NAME, async (req, res, next) => {
            const context = req.context as IUserContext;
            const request = new SendEmailChangeFirstAndLastNameRequest();

            request.ticketId = req.body.ticketId;
            request.firstName = req.body.firstName;
            request.lastName = req.body.lastName;
            request.username = req.body.username;

            const controller: ITicketPersonalizationController = Bootstrapper.getTicketPersonalizationController(context);
            const response: SendEmailChangeFirstAndLastNameResponse = await controller.sendEmailChangeFirstAndLastname(request);
            res.json(response);
        });

        this.expressApp.post(TicketsRouter.ASSIGN_TICKETS_API_URL, async (req, res, next) => {
            const context = req.context as IUserContext;
            const request = new AssignTicketRequest();

            request.tickets = req.body.tickets;

            const controller: ITicketPersonalizationController = Bootstrapper.getTicketPersonalizationController(context);
            const response: AssignTicketResponse = await controller.assignTicket(request);
            res.json(response);
        });

        this.expressApp.post(TicketsRouter.GET_UPCOMING_EVENTS, async (req, res, next) => {
            const context = req.context as IUserContext;

            const request = new SearchTicketsRequest();
            request.categories = req.body.categories;
            request.fromDate = req.body.fromDate;
            request.toDate = req.body.toDate;
            request.page = req.body.page;
            request.showLinkedAccountsFilter = req.body.showLinkedAccountsFilter;
            request.showTicketsOnSaleFilter = req.body.showTicketsOnSaleFilter;
            request.showTicketsWithRepersonalizationInProgress = req.body.showTicketsWithRepersonalizationInProgress;
            request.showWaitingForPayment = req.body.showWaitingForPayment;

            const controller: ISearchTicketController = Bootstrapper.getSearchTicketsController(context)

            const response: GetEventsResponse = await controller.getUpcomingEvents(request);

            res.json(response);
        });

        this.expressApp.post(TicketsRouter.GET_VISITED_EVENTS, async (req, res, next) => {
            const context = req.context as IUserContext;

            const request = new SearchTicketsRequest();
            request.categories = req.body.categories;
            request.fromDate = req.body.fromDate;
            request.toDate = req.body.toDate;
            request.page = req.body.page;
            request.showLinkedAccountsFilter = req.body.showLinkedAccountsFilter;
            const controller: ISearchTicketController = Bootstrapper.getSearchTicketsController(context)

            const response: GetEventsResponse = await controller.getVisitedEvents(request);

            res.json(response);
        });

        this.expressApp.get(TicketsRouter.GET_MARKETPLACE_LOCATIONS_URL, async (req, res, next) => {
            const context = req.context as IUserContext;

            const controller: ISearchTicketController = Bootstrapper.getSearchTicketsController(context)

            const response: GetMarketplaceLocationsResponse = await controller.getMarketplaceLocations();

            res.json(response);
        });

        this.expressApp.get(TicketsRouter.GET_MARKETPLACE_PRICE_RANGE_URL, async (req, res, next) => {
            const context = req.context as IUserContext;

            const controller: ISearchTicketController = Bootstrapper.getSearchTicketsController(context)

            const response: GetMarketplacePriceRangeResponse = await controller.getPriceRange();

            res.json(response);
        });

        this.expressApp.get(TicketsRouter.GET_TICKET_CATEGORIES, async (req, res, next) => {
            const context = req.context as IUserContext;

            const controller: ITicketController = Bootstrapper.getTicketController(context)

            const response: GetTicketCategoriesResponse = await controller.getTicketCategories();

            res.json(response);
        });


    }

    private getSearchAdminPanelTicketsRequest(req: any): SearchAdminPanelTicketsRequest {
        return {
            bookingId: req.body.bookingId,
            eventLocation: req.body.eventLocation,
            eventName: req.body.eventName,
            fromDate: req.body.fromDate,
            organizer: req.body.organizer,
            ticketHolder: req.body.ticketHolder,
            page: req.body.page,
            status: req.body.status,
            ticketBuyer: req.body.ticketBuyer,
            ticketId: req.body.ticketId,
            toDate: req.body.toDate,
            limit: req.body.limit,
            sortField: req.body.sortField,
            sortOrder: req.body.sortOrder
        };
    }
}