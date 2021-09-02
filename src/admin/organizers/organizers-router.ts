import { Bootstrapper } from "../../bootstrapper";
import { ValidationError } from "../../common/errors/validation-error";
import { IUserContext } from "../../common/user-context";
import { IEventCalendarController } from "../../event-calendar/event-calendar-controller";
import { IEventController } from "../../events/event-controller";
import { ISeatPlanValue } from "../../events/seat-plan/seat-plan-value";
import { ExpressAppWrapper } from "../../http/express-app-wrapper";
import { LocalisationKey } from "../../localisation/localisation-key";
import { IOrganizerPlaceholderImageValue } from "../../organizer-placeholder-image/organizer-placeholder-image-value";
import { SearchAdminPanelTicketsRequest } from "../../tickets/model/search-admin-panel-tickets-request";
import { SearchSaleTicketsRequest } from "../../tickets/model/search-sale-tickets-request";
import { SearchTicketsResponse } from "../../tickets/model/search-ticket-response";
import { SearchTicketController } from "../../tickets/search-ticket-controller";
import { TicketsRouter } from "../../tickets/tickets-router";
import { IExportOrganizersBillingController } from "./export-organizers-billing-controller";
import { IExportOrganizersController } from "./export-organizers-controller";
import { IExportOrganizersTicketsController } from "./export-organizers-ticket-list-controller";
import { ExportPdfOrganizersController } from "./export-pdf-organizers-controller";
import { AddOrganizerRequest } from "./models/add-organizer-request";
import { AddOrganizerResponse } from "./models/add-organizer-response";
import { CheckSeatPLanRequest } from "./models/check-seat-plan-request";
import { CheckSeatPLanResponse } from "./models/check-seat-plan-response";
import { DeleteEventImageRequest } from "./models/delete-event-image-request";
import { DeleteEventImageResponse } from "./models/delete-event-image-response";
import { DeleteOrganizerImageRequest } from "./models/delete-organizer-image-request";
import { DeleteOrganizerImageResponse } from "./models/delete-organizer-image-response";
import { DeleteOrganizerResponse } from "./models/delete-organizer-response";
import { DeleteOrganizerRequest } from "./models/delete-organizer-reuqest";
import { DeleteSeatPlanImageRequest } from "./models/delete-seat-plan-image-request";
import { DeleteSeatPlanResponse } from "./models/delete-seat-plan-response";
import { GetDistributionOfIncomingTicketsResponse } from "./models/get-distibution-of-incoming-tickets-response";
import { GetEventDetailsRequest } from "./models/get-event-details-request";
import { GetEventDetailsResponse } from "./models/get-event-details-response";
import { GetOrganizersAccountSettingRequest } from "./models/get-organizer-account-settings-request";
import { GetOrganizerAccountSettingsResponse } from "./models/get-organizer-account-settings-response";
import { GetOrganizerResponse } from "./models/get-organizer-response";
import { GetOrganizersMainDataRequest } from "./models/get-organizers-main-data-request";
import { GetOrganizersMainDataResponse } from "./models/get-organizers-main-data-response";
import { GetTicketListBillingResponse } from "./models/get-ticket-list-billing-response";
import { GetTotalEventsByOrganizerResponse } from "./models/get-total-events-by-organizer-response";
import { GetTotalIncomeResponse } from "./models/get-total-income-response";
import { GetTotalIncomingTicketsBillingResponse } from "./models/get-total-incoming-tickets-billing-response";
import { GetTotalIncomingTicketsPerEventResponse } from "./models/get-total-incoming-tickets-per-event-response";
import { GetTotalPersonalizedTicketsPerEventResponse } from "./models/get-total-personalized-tickets-response";
import { SearchEventLocationsOrganizersBillingRequest } from "./models/search-event-location-organizers-billing-request";
import { SearchEventLocationsOrganizersBillingResponse } from "./models/search-event-locations-organizers-billing-response";
import { SearchEventNamesOrganizersBillingRequest } from "./models/search-event-names-organizers-billing-request";
import { SearchEventNamesOrganizersBillingResponse } from "./models/search-event-names-organizers-billing-response";
import { SearchEventOrganizersBillingRequest } from "./models/search-events-organizers-billing-request";
import { SearchOrganizerSupportRequest } from "./models/search-organizer-support-request";
import { SearchOrganizersRequest } from "./models/search-organizers-request";
import { SearchOrganizersResponse } from "./models/search-organizers-response";
import { SearchOrganizersTicketsRequest } from "./models/search-organizers-ticket-list-request";
import { UpdateOrganizerRequest } from "./models/update-organizer-request";
import { UpdateOrganizerResponse } from "./models/update-organizer-response";
import { UploadEventImageRequest } from "./models/upload-event-image-request";
import { UploadEventImageResponse } from "./models/upload-event-image-response";
import { UploadOrganizerPlaceholderImageRequest } from "./models/upload-organizer-placeholder-image-request";
import { UploadOrganizerPlaceholderImageResponse } from "./models/upload-organizer-placeholder-image-response";
import { UploadSeatPLanRequest } from "./models/upload-seat-plan-request";
import { UploadSeatPlanResponse } from "./models/upload-seat-plan-response";
import { IOrganizerAdminPanelController } from "./organizer-admin-panel-controller";
import { IOrganizerSupportController } from "./organizer-support-controller";
import { IOrganizersBillingController } from "./organizers-billing-controller";
import { IOrganizersController } from "./organizers-controller";
import { ISearchOrganizersController } from "./search-organizers-controller";

const multer = require('multer');
var storage = multer.memoryStorage();
var upload = multer({ storage: storage });

export class OrganizersRouter {
    public static ADD_ORGANIZER_URL = '/organizers/adminpanel/add';
    public static UPLOAD_ORGANIZER_IMAGE_URL = '/organizers/adminpanel/uploadimage';

    public static SEARCH_ORGANIZERS_URL = '/organizers/adminpanel/search'
    public static EXPORT_EXCEL_ORGANIZERS_URL = '/organizers/adminpanel/exportexcel';
    public static EXPORT_CSV_ORGANIZERS_URL= '/organizers/adminpanel/exportcsv';
    public static EXPORT_PDF_ORGANIZERS_URL = '/organizers/adminpanel/exportpdf';
    
    public static GET_ORGANIZERS_MAIN_DATA_URL = '/organizers/adminpanel/maindata';
    public static GET_ORGANIZERS_ACCOUNT_SETTINGS_URL = '/organizers/adminpanel/accountsettings';
    public static GET_ORGANIZERS_IMAGE_URL = '/organizers/adminpanel/image';
    public static UPDATE_ORGANIZER_URL = '/organizers/adminpanel/update';
    public static DELETE_ORGANIZER_URL = '/organizers/adminpanel/delete';
    public static DELETE_ORGANIZER_IMAGE_URL = '/organizers/adminpanel/deleteimage';

    public static SEARCH_ORGANIZER_SUPPORT_URL = '/organizersupport/adminpanel/search';
    public static EXPORT_EXCEL_ORGANIZER_SUPPORT_URL = '/organizersupport/adminpanel/exportexcel';
    public static EXPORT_CSV_ORGANIZER_SUPPORT_URL= '/organizersupport/adminpanel/exportcsv';
    public static EXPORT_PDF_ORGANIZER_SUPPORT_URL = '/organizersupport/adminpanel/exportpdf';
    
    public static GET_TOTAL_INCOMING_TICKETS_PER_EVENT_URL = '/organizers/adminpanel/dashboard/incoming';
    public static GET_TOTAL_PERSONALIZED_TICKETS_PER_EVENT_URL = '/organizers/adminpanel/dashboard/personalized';
    
    public static SEARCH_ORGANIZER_TICKET_LIST_URL = '/organizers/adminpanel/ticketlist/search';
    public static EXPORT_EXCEL_ORGANIZER_TICKET_LIST_URL = '/organizers/adminpanel/ticketlist/exportexcel';
    public static EXPORT_CSV_ORGANIZER_TICKET_LIST_URL= '/organizers/adminpanel/ticketlist/exportcsv';
    public static EXPORT_PDF_ORGANIZER_TICKET_LIST_URL = '/organizers/adminpanel/ticketlist/exportpdf';
    
    public static GET_ORGANIZER_URL = '/organizers/adminpanel/context';
    public static GET_EVENT_DETAILS_URL = '/organizers/adminpanel/eventdetails';
    public static CHECK_SEAT_PLAN_URL = '/organizers/adminpanel/seatplan/check';
    public static UPLOAD_EVENT_IMAGE_URL = '/organizers/adminpanel/eventimage/upload';
    public static DELETE_EVENT_IMAGE_URL = '/organizers/adminpanel/eventimage/delete';
    public static UPLOAD_SEAT_PLAN_URL = '/organizers/adminpanel/seatplan/upload';
    public static DELETE_SEAT_PLAN_IMAGE_URL = '/organizers/adminpanel/seatplanimage/delete';
    public static GET_SEAT_PLAN_IMAGE_URL = '/organizers/adminpanel/seatplanimage';

    //Billing 
    public static GET_TOTAL_EVENTS_BY_ORGANIZER_URL = '/organizers/adminpanel/billing/events';
    public static GET_TOTAL_INCOMING_TICKETS_FOR_EVENTS_URL = '/organizers/adminpanel/billing/incomingtickets';
    public static GET_INCOME_URL = '/organizers/adminpanel/billing/income';
    public static SEARCH_EVENT_LOCATIONS_URL = '/organizers/adminpanel/billing/eventlocations';
    public static SEARCH_EVENT_NAMES_URL = '/organizers/adminpanel/billing/eventnames';
    public static DISTRIBUTION_OF_TICKETS_BY_PRICES_URL = '/organizers/adminpanel/billing/distributionbyprices';
    public static TICKET_LIST_URL = '/organizers/adminpanel/billing/ticketlist';
    public static EXPORT_EXCEL_TICKET_LIST_URL = '/organizers/adminpanel/billing/exportexcel';
    public static EXPORT_CSV_TICKET_LIST_URL = '/organizers/adminpanel/billing/exportcsv';


    constructor(private readonly expressApp: ExpressAppWrapper){}

    public registerRoutes(): void {
        this.expressApp.post(OrganizersRouter.EXPORT_CSV_TICKET_LIST_URL, async (req, res, next) => {
            const context = req.context as IUserContext;

            const controller: IOrganizersBillingController =
                Bootstrapper.getOrganizersBillingController(context);

            const request: SearchEventOrganizersBillingRequest = this.getSearchEventsOrganizersBillingRequest(req);
            const response: GetTicketListBillingResponse = await controller.getTicketList(request);

            if(response.rows.length > 30) {
                const localisationProvider = Bootstrapper.getLocalisationProvider(context);
                throw new ValidationError(localisationProvider.translate(LocalisationKey.TooMuchData));
            }
            const exportController: IExportOrganizersBillingController = Bootstrapper.getExportOrganizersBillingController(context);
            exportController.exportCSV(response, res);

        });

        this.expressApp.post(OrganizersRouter.EXPORT_EXCEL_TICKET_LIST_URL, async (req, res, next) => {
            const context = req.context as IUserContext;

            const controller: IOrganizersBillingController =
                Bootstrapper.getOrganizersBillingController(context);

            const request: SearchEventOrganizersBillingRequest = this.getSearchEventsOrganizersBillingRequest(req);
            const response: GetTicketListBillingResponse = await controller.getTicketList(request);

            if(response.rows.length > 30) {
                const localisationProvider = Bootstrapper.getLocalisationProvider(context);
                throw new ValidationError(localisationProvider.translate(LocalisationKey.TooMuchData));
            }
            const exportController: IExportOrganizersBillingController = Bootstrapper.getExportOrganizersBillingController(context);
            exportController.exportExcel(response, res);
        });

        this.expressApp.post(OrganizersRouter.TICKET_LIST_URL, async (req, res, next) => {
            const context = req.context as IUserContext;

            const controller: IOrganizersBillingController =
                Bootstrapper.getOrganizersBillingController(context);

            const request: SearchEventOrganizersBillingRequest = this.getSearchEventsOrganizersBillingRequest(req);
            const response: GetTicketListBillingResponse = await controller.getTicketList(request);

            res.json(response);
        });

        this.expressApp.post(OrganizersRouter.DISTRIBUTION_OF_TICKETS_BY_PRICES_URL, async (req, res, next) => {
            const context = req.context as IUserContext;

            const controller: IOrganizersBillingController =
                Bootstrapper.getOrganizersBillingController(context);

            const request: SearchEventOrganizersBillingRequest = this.getSearchEventsOrganizersBillingRequest(req);
            const response: GetDistributionOfIncomingTicketsResponse = await controller.getDistributionOfTicketsByPrices(request);

            res.json(response);
        });

        this.expressApp.post(OrganizersRouter.GET_INCOME_URL, async (req, res, next) => {
            const context = req.context as IUserContext;

            const controller: IOrganizersBillingController =
                Bootstrapper.getOrganizersBillingController(context);

            const request: SearchEventOrganizersBillingRequest = this.getSearchEventsOrganizersBillingRequest(req);
            const response: GetTotalIncomeResponse = await controller.getTotalIncome(request);

            res.json(response);
        });

        this.expressApp.post(OrganizersRouter.SEARCH_EVENT_NAMES_URL, async (req, res, next) => {
            const context = req.context as IUserContext;

            const controller: IOrganizersBillingController =
            Bootstrapper.getOrganizersBillingController(context);

            const request: SearchEventNamesOrganizersBillingRequest = new SearchEventNamesOrganizersBillingRequest();
            request.organizerId = req.body.organizerId;
            request.locations = req.body.locations;
            request.dateFrom = req.body.dateFrom;
            request.dateTo = req.body.dateTo;
            const response: SearchEventNamesOrganizersBillingResponse = await controller.getEventNamesByOrganizer(request);

            res.json(response);
        });

        this.expressApp.post(OrganizersRouter.SEARCH_EVENT_LOCATIONS_URL, async (req, res, next) => {
            const context = req.context as IUserContext;

            const controller: IOrganizersBillingController =
            Bootstrapper.getOrganizersBillingController(context);

            const request: SearchEventLocationsOrganizersBillingRequest = new SearchEventLocationsOrganizersBillingRequest();
            request.organizerId = req.body.organizerId;
            request.eventNames = req.body.eventNames;
            request.dateFrom = req.body.dateFrom;
            request.dateTo = req.body.dateTo;
            const response: SearchEventLocationsOrganizersBillingResponse = await controller.getEventLocationsByOrganizer(request);

            res.json(response);
        });

        this.expressApp.post(OrganizersRouter.GET_TOTAL_INCOMING_TICKETS_FOR_EVENTS_URL, async (req, res, next) => {
            const context = req.context as IUserContext;

            const controller: IOrganizersBillingController =
                Bootstrapper.getOrganizersBillingController(context);

            const request: SearchEventOrganizersBillingRequest = this.getSearchEventsOrganizersBillingRequest(req);
            const response: GetTotalIncomingTicketsBillingResponse = await controller.getTotalTicketsForEvents(request);

            res.json(response);
        });

        this.expressApp.post(OrganizersRouter.GET_TOTAL_EVENTS_BY_ORGANIZER_URL, async (req, res, next) => {
            const context = req.context as IUserContext;

            const controller: IOrganizersBillingController =
                Bootstrapper.getOrganizersBillingController(context);

            const request: SearchEventOrganizersBillingRequest = this.getSearchEventsOrganizersBillingRequest(req);
            const response: GetTotalEventsByOrganizerResponse = await controller.getTotalEventsByOrganizer(request);

            res.json(response);
        });

        this.expressApp.post(OrganizersRouter.CHECK_SEAT_PLAN_URL, async (req, res, next) => {
            const context = req.context as IUserContext;

            const controller: IEventController =
                Bootstrapper.getEventController(context);

            const request: CheckSeatPLanRequest = new CheckSeatPLanRequest();

            request.eventId = req.body.eventId;
            const response: CheckSeatPLanResponse = await controller.checkSeatPLan(request);

            res.json(response);
        });

        this.expressApp.get(OrganizersRouter.GET_SEAT_PLAN_IMAGE_URL, async (req, res, next) => {
            const context = req.context as IUserContext;

            const controller: IEventController =
                Bootstrapper.getEventController(context);

            const seatPLan: ISeatPlanValue = await controller.getSeatPlanImage(req.query.eventId);

            if (seatPLan && seatPLan.image) {
                res.set('Content-Type', seatPLan.imageMimetype);
                res.send(Buffer.from(seatPLan.image));     
            }
            else {
                const image = await controller.getDefaultSeatPLanImage();
                res.set('Content-Type', 'image/png');
                res.send(image);
            }
           
        });

        this.expressApp.postWithFile(OrganizersRouter.UPLOAD_SEAT_PLAN_URL, upload.single('image'), async (req, res, next) => {
            const context = req.context as IUserContext;

            const controller: IEventController =
                Bootstrapper.getEventController(context);

            const request: UploadSeatPLanRequest = new UploadSeatPLanRequest();

            request.eventId = req.body.eventId;
            request.url = req.body.url;
            request.image = req.file || null;
            const response: UploadSeatPlanResponse = await controller.uploadSeatPlan(request);

            res.json(response);
        });

        this.expressApp.post(OrganizersRouter.DELETE_SEAT_PLAN_IMAGE_URL, async (req, res, next) => {
            const context = req.context as IUserContext;

            const controller: IEventController =
                Bootstrapper.getEventController(context);

            const request: DeleteSeatPlanImageRequest = new DeleteSeatPlanImageRequest();
            request.eventId = req.body.eventId;
            const response: DeleteSeatPlanResponse = await controller.deleteSeatPlanImage(request);

            res.json(response);
        });

        this.expressApp.postWithFile(OrganizersRouter.UPLOAD_EVENT_IMAGE_URL, upload.single('image'), async (req, res, next) => {
            const context = req.context as IUserContext;

            const controller: IEventController =
                Bootstrapper.getEventController(context);

            const request: UploadEventImageRequest = new UploadEventImageRequest();

            request.eventId = req.body.eventId;
            request.image = req.file || null;
            const response: UploadEventImageResponse = await controller.uploadEventImage(request);

            res.json(response);
        });

        this.expressApp.post(OrganizersRouter.DELETE_EVENT_IMAGE_URL, async (req, res, next) => {
            const context = req.context as IUserContext;

            const controller: IEventController =
                Bootstrapper.getEventController(context);

            const request: DeleteEventImageRequest = new DeleteEventImageRequest();
            request.eventId = req.body.eventId;
            const response: DeleteEventImageResponse = await controller.deleteEventImage(request);

            res.json(response);
        });

        this.expressApp.post(OrganizersRouter.GET_EVENT_DETAILS_URL, async (req, res, next) => {
            const context = req.context as IUserContext;
            const request: GetEventDetailsRequest = new GetEventDetailsRequest();
            request.eventId = req.body.eventId;
            const controller: IEventController =
                Bootstrapper.getEventController(context);

            const response:  GetEventDetailsResponse = await controller.getEventDetails(request);

            res.json(response);
        });

        this.expressApp.get(OrganizersRouter.GET_ORGANIZER_URL, async (req, res, next) => {
            const context = req.context as IUserContext;

            const controller: IOrganizerAdminPanelController =
                Bootstrapper.getOrganizerAdminPanelController(context);

            const response:  GetOrganizerResponse = await controller.getOrganizer();

            res.json(response);
        });

        this.expressApp.post(OrganizersRouter.EXPORT_CSV_ORGANIZER_TICKET_LIST_URL, async (req, res, next) => {
            const context = req.context as IUserContext;

            const searchController: IOrganizersController =
                Bootstrapper.getOrganizersController(context);

            const controller: IExportOrganizersTicketsController =
                Bootstrapper.getExportOrganizersTicketsController(context);

            const request: SearchOrganizersTicketsRequest = this.getOrganizersTicketsRequest(req);

            const response = await searchController.searchTickets(request);
            await controller.exportCSV(response, res);

        });

        this.expressApp.post(OrganizersRouter.EXPORT_EXCEL_ORGANIZER_TICKET_LIST_URL, async (req, res, next) => {
            const context = req.context as IUserContext;

            const searchController: IOrganizersController =
                Bootstrapper.getOrganizersController(context);

            const controller: IExportOrganizersTicketsController =
                Bootstrapper.getExportOrganizersTicketsController(context);

            const request: SearchOrganizersTicketsRequest = this.getOrganizersTicketsRequest(req);

            const response = await searchController.searchTickets(request);
            await controller.exportExcel(response, res);

        });

        this.expressApp.post(OrganizersRouter.EXPORT_PDF_ORGANIZER_TICKET_LIST_URL, async (req, res, next) => {
            const context = req.context as IUserContext;

            const searchController: IOrganizersController =
                Bootstrapper.getOrganizersController(context);

            const controller: IExportOrganizersTicketsController =
                Bootstrapper.getExportOrganizersTicketsController(context);

            const request: SearchOrganizersTicketsRequest = this.getOrganizersTicketsRequest(req);

            const response = await searchController.searchTickets(request);
            await controller.exportPdf(response, res);

        });

        this.expressApp.post(OrganizersRouter.SEARCH_ORGANIZER_TICKET_LIST_URL, async (req, res, next) => {
            const context = req.context as IUserContext;

            const controller: IOrganizersController =
                Bootstrapper.getOrganizersController(context);

            const request: SearchOrganizersTicketsRequest = this.getOrganizersTicketsRequest(req);

            const response: SearchTicketsResponse = await controller.searchTickets(request);

            res.json(response);
        });

        this.expressApp.get(OrganizersRouter.GET_TOTAL_PERSONALIZED_TICKETS_PER_EVENT_URL, async (req, res, next) => {
            const context = req.context as IUserContext;

            const controller: IOrganizersController =
                Bootstrapper.getOrganizersController(context);

            const response:  GetTotalPersonalizedTicketsPerEventResponse = await controller.getTotalPersonalizedTicketsPerEvent();

            res.json(response);
        });

        this.expressApp.get(OrganizersRouter.GET_TOTAL_INCOMING_TICKETS_PER_EVENT_URL, async (req, res, next) => {
            const context = req.context as IUserContext;

            const controller: IOrganizersController =
                Bootstrapper.getOrganizersController(context);

            const response:  GetTotalIncomingTicketsPerEventResponse = await controller.getTotalIncomingTicketsPerEvent();

            res.json(response);
        });

        this.expressApp.postWithFile(OrganizersRouter.ADD_ORGANIZER_URL, upload.single('image'),  async (req, res) => {
            const context = req.context as IUserContext;

            const request = new AddOrganizerRequest();
            request.companyName = req.body.companyName;
            request.email = req.body.email;
            request.contactPerson = req.body.contactPerson;
            request.address = req.body.address;
            request.postCode = req.body.postCode;
            request.city = req.body.city;
            request.country = req.body.country;
            request.phone = req.body.phone;
            request.url = req.body.url;
            request.status = req.body.status;
            request.ticketReturn = req.body.ticketReturn;
            request.fansafeSale = req.body.fansafeSale;
            request.revenueSharing = req.body.revenueSharing;
            request.linkLomnido = req.body.linkLomnido;
            request.image = req.file || null;

            const controller: IOrganizersController = Bootstrapper.getOrganizersController(context);
            const response: AddOrganizerResponse = await controller.addOrganizer(request);

            res.json(response);
        });

        this.expressApp.postWithFile(OrganizersRouter.UPLOAD_ORGANIZER_IMAGE_URL, upload.single('image'), async (req, res, next) => {
            const context = req.context as IUserContext;

            const controller: IOrganizersController =
                Bootstrapper.getOrganizersController(context);

            const request: UploadOrganizerPlaceholderImageRequest = new UploadOrganizerPlaceholderImageRequest();

            request.organizerId = req.body.organizerId;
            request.image = req.file || null;
            const response: UploadOrganizerPlaceholderImageResponse = await controller.uploadImage(request);

            res.json(response);
        });

        this.expressApp.post(OrganizersRouter.SEARCH_ORGANIZERS_URL, async (req, res, next) => {
            const context = req.context as IUserContext;

            const controller: ISearchOrganizersController =
                Bootstrapper.getSearchOrganizersController(context);

            const request: SearchOrganizersRequest = this.getSearchOrganizersRequest(req);

            const response = await controller.search(request);

            res.json(response);
        });

        this.expressApp.post(OrganizersRouter.SEARCH_ORGANIZER_SUPPORT_URL, async (req, res, next) => {
            const context = req.context as IUserContext;

            const controller: IOrganizerSupportController =
                Bootstrapper.getOrganizerSupportController(context);

            const request: SearchOrganizerSupportRequest = this.getSearchOrganizerSupportRequest(req);

            const response = await controller.search(request);

            res.json(response);
        });

        this.expressApp.post(OrganizersRouter.EXPORT_CSV_ORGANIZER_SUPPORT_URL, async (req, res, next) => {
            const context = req.context as IUserContext;

            const controller: IOrganizerSupportController =
                Bootstrapper.getOrganizerSupportController(context);

            const request: SearchOrganizerSupportRequest = this.getSearchOrganizerSupportRequest(req);

            const response = await controller.search(request);
            await controller.exportCSV(response, res);

        });

        this.expressApp.post(OrganizersRouter.EXPORT_EXCEL_ORGANIZER_SUPPORT_URL, async (req, res, next) => {
            const context = req.context as IUserContext;

            const controller: IOrganizerSupportController =
                Bootstrapper.getOrganizerSupportController(context);

            const request: SearchOrganizerSupportRequest = this.getSearchOrganizerSupportRequest(req);

            const response = await controller.search(request);
            await controller.exportExcel(response, res);

        });

        this.expressApp.post(OrganizersRouter.EXPORT_PDF_ORGANIZER_SUPPORT_URL, async (req, res, next) => {
            const context = req.context as IUserContext;

            const controller: IOrganizerSupportController =
                Bootstrapper.getOrganizerSupportController(context);

            const request: SearchOrganizerSupportRequest = this.getSearchOrganizerSupportRequest(req);

            const response = await controller.search(request);
            await controller.exportPdf(response, res);

        });

        this.expressApp.post(OrganizersRouter.EXPORT_EXCEL_ORGANIZERS_URL, async (req, res, next) => {
            const context = req.context as IUserContext;

            const controller: ISearchOrganizersController =
                Bootstrapper.getSearchOrganizersController(context);

            const request: SearchOrganizersRequest = this.getSearchOrganizersRequest(req);

            const response: SearchOrganizersResponse =
                await controller.search(request);

            const exportController: IExportOrganizersController =
                Bootstrapper.getExportOrganizersController(context);

            await exportController.exportExcel(response, res);
        });

        this.expressApp.post(OrganizersRouter.EXPORT_CSV_ORGANIZERS_URL, async (req, res, next) => {
            const context = req.context as IUserContext;

            const controller: ISearchOrganizersController =
                Bootstrapper.getSearchOrganizersController(context);

            const request: SearchOrganizersRequest = this.getSearchOrganizersRequest(req);

            const response: SearchOrganizersResponse =
                await controller.search(request);

            const exportController: IExportOrganizersController =
                Bootstrapper.getExportOrganizersController(context);

            await exportController.exportCSV(response, res);
        });

        this.expressApp.post(OrganizersRouter.EXPORT_PDF_ORGANIZERS_URL, async (req, res, next) => {
            const context = req.context as IUserContext;

            const controller: ISearchOrganizersController =
                Bootstrapper.getSearchOrganizersController(context);

            const request: SearchOrganizersRequest = this.getSearchOrganizersRequest(req);

            const response: SearchOrganizersResponse =
                await controller.search(request);

            const exportController: ExportPdfOrganizersController =
                Bootstrapper.getExportPDFOrganizersController(context);

            await exportController.exportPDF(response, res);
        });

        this.expressApp.post(OrganizersRouter.GET_ORGANIZERS_MAIN_DATA_URL, async (req, res, next) => {
            const context = req.context as IUserContext;
            const controller: IOrganizersController =
                Bootstrapper.getOrganizersController(context);
            const request: GetOrganizersMainDataRequest = new GetOrganizersMainDataRequest();
            request.organizerId = req.body.organizerId;
            const response: GetOrganizersMainDataResponse = await controller.getMainData(request);

            res.json(response);
        });

        this.expressApp.post(OrganizersRouter.UPDATE_ORGANIZER_URL, async (req, res, next) => {
            const context = req.context as IUserContext;

            const controller: IOrganizersController =
                Bootstrapper.getOrganizersController(context);

            const request: UpdateOrganizerRequest = new UpdateOrganizerRequest();

            request.organizerId = req.body.organizerId;

            request.ticketReturn = req.body.ticketReturn;
            request.fansafeSale = req.body.fansafeSale;
            request.linkToLomnidoBridge = req.body.linkToLomnidoBridge;
            request.revenueSharing = req.body.revenueSharing;
            request.status = req.body.status;
            request.contactPerson = req.body.contactPerson;
            request.email = req.body.email;
            request.address = req.body.address;
            request.postCode = req.body.postCode;
            request.phone = req.body.phone;
            request.city = req.body.city;
            request.country = req.body.country;
            request.url = req.body.url;

            const response: UpdateOrganizerResponse = await controller.updateOrganizer(request);

            res.json(response);
        });

        this.expressApp.get(OrganizersRouter.GET_ORGANIZERS_IMAGE_URL, async (req, res, next) => {
            const context = req.context as IUserContext;

            const controller: IOrganizersController =
                Bootstrapper.getOrganizersController(context);

            const image: IOrganizerPlaceholderImageValue = await controller.getImage(req.query.organizerId);

            if(image){
                res.set('Content-Type', image.mimetype);
                res.send(Buffer.from(image.image));
            }
            else{
                const image = await controller.getDefaultOrganizerImage();
                res.set('Content-Type', 'image/png');
                res.send(image);
            }
           
        });

        this.expressApp.post(OrganizersRouter.DELETE_ORGANIZER_URL, async (req, res, next) => {
            const context = req.context as IUserContext;

            const controller: IOrganizersController =
                Bootstrapper.getOrganizersController(context);

            const request: DeleteOrganizerRequest = new DeleteOrganizerRequest();
            request.organizerId = req.body.organizerId;
            const response: DeleteOrganizerResponse = await controller.deleteOrganizer(request);

            res.json(response);
        });

        this.expressApp.post(OrganizersRouter.DELETE_ORGANIZER_IMAGE_URL, async (req, res, next) => {
            const context = req.context as IUserContext;

            const controller: IOrganizersController =
                Bootstrapper.getOrganizersController(context);

            const request: DeleteOrganizerImageRequest = new DeleteOrganizerImageRequest();
            request.organizerId = req.body.organizerId;
            const response: DeleteOrganizerImageResponse = await controller.deleteOrganizerImage(request);

            res.json(response);
        });

        this.expressApp.post(OrganizersRouter.GET_ORGANIZERS_ACCOUNT_SETTINGS_URL, async (req, res, next) => {
            const context = req.context as IUserContext;
            const controller: IOrganizersController =
                Bootstrapper.getOrganizersController(context);
            const request: GetOrganizersAccountSettingRequest = new GetOrganizersAccountSettingRequest();
            request.organizerId = req.body.organizerId;
            const response: GetOrganizerAccountSettingsResponse = await controller.getAccountSettings(request);

            res.json(response);
        });

    }
    private getSearchOrganizerSupportRequest(req: any): SearchOrganizerSupportRequest {
            return {
                companyName: req.body.companyName,
                createdFrom: req.body.createdFrom,
                createdTo: req.body.createdTo,
                status: req.body.status,
                page: req.body.page,
                limit: req.body.limit,
                sortField: req.body.sortField,
                sortOrder: req.body.sortOrder
            };  
    }

    private getSearchOrganizersRequest(req: any): SearchOrganizersRequest {
        const request = new SearchOrganizersRequest();
        request.companyName = req.body.companyName;
        request.contactPerson = req.body.contactPerson;
        request.status = req.body.status;
        request.page = req.body.page;
        request.limit = req.body.limit;
        request.sortField = req.body.sortField;
        request.sortOrder = req.body.sortOrder;
        
        return request;
    }

    private getOrganizersTicketsRequest(req: any): SearchOrganizersTicketsRequest {
        return {
            bookingId: req.body.bookingId,
            eventLocation: req.body.eventLocation,
            eventName: req.body.eventName,
            fromDate: req.body.fromDate,
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

    private getSearchEventsOrganizersBillingRequest(req: any): SearchEventOrganizersBillingRequest {
        return {
            organizerId: req.body.organizerId,
            locations: req.body.locations,
            eventNames: req.body.eventNames,
            dateFrom: req.body.dateFrom,
            dateTo: req.body.dateTo
        }
    }
}
