import { Bootstrapper } from "../bootstrapper";
import { IUserContext } from "../common/user-context";
import { ExpressAppWrapper } from "../http/express-app-wrapper";
import { IEventCalendarController } from "./event-calendar-controller";
import { ExportCalendarResponse } from "./models/export-calendar-response";
import { GetEventsByDayRequest } from "./models/get-events-by-day-request";
import { GetEventsByMonthRequest } from "./models/get-events-by-month-request";
import { GetEventsByWeekRequest } from "./models/get-events-by-week-request";

export class EventCalendarRouter {
    public static GET_EVENTS_BY_DAY_URL = '/eventcalendar/byday';
    public static GET_EVENTS_BY_WEEK_URL = '/eventcalendar/byweek';
    public static GET_EVENTS_BY_MONTH_URL = '/eventcalendar/bymonth';
    public static EXPORT_CALENDAR_URL = '/eventcalendar/exportcalendar';

    constructor(private readonly expressApp: ExpressAppWrapper) { }

    public registerRoutes(): void {

        this.expressApp.post(EventCalendarRouter.GET_EVENTS_BY_DAY_URL, async (req, res, next) => {
            const context = req.context as IUserContext;

            const request = new GetEventsByDayRequest();
            request.date = req.body.date;

            const controller: IEventCalendarController = Bootstrapper.getEventCalendarController(context);
            const response = await controller.getEventsByDay(request);

            res.json(response);
        });

        this.expressApp.post(EventCalendarRouter.GET_EVENTS_BY_WEEK_URL, async (req, res, next) => {
            const context = req.context as IUserContext;

            const request = new GetEventsByWeekRequest();
            request.fromDate = req.body.fromDate;
            request.toDate = req.body.toDate;

            const controller: IEventCalendarController = Bootstrapper.getEventCalendarController(context);
            const response = await controller.getEventsByWeek(request);

            res.json(response);
        });

        this.expressApp.post(EventCalendarRouter.GET_EVENTS_BY_MONTH_URL, async (req, res, next) => {
            const context = req.context as IUserContext;

            const request = new GetEventsByMonthRequest();
            request.month = req.body.month;
            request.year = req.body.year;

            const controller: IEventCalendarController = Bootstrapper.getEventCalendarController(context);
            const response = await controller.getEventsByMonth(request);

            res.json(response);
        });

        this.expressApp.get(EventCalendarRouter.EXPORT_CALENDAR_URL, async (req, res, next) => {
            const context = req.context as IUserContext;

            const controller: IEventCalendarController = Bootstrapper.getEventCalendarController(context);
            const response: ExportCalendarResponse = await controller.exportCalendar();

            res.attachment('FansafeCalendarEvents.ics');
            res.type('ics');
            res.send(response.calendarExportData);
        });
    }
}