import { IUserContext } from "../common/user-context";
import { EventCalendarResponse, GetEventsResponse } from "./models/get-events-response";
import { ITicketRepository } from "../tickets/ticket-repository";
import { GetEventsByDayRequest } from "./models/get-events-by-day-request";
import { GetEventsByWeekRequest } from "./models/get-events-by-week-request";
import { GetEventsByMonthRequest } from "./models/get-events-by-month-request";
import { SearchTicketRepoRequest } from "../tickets/model/search-ticket-repo-request";
import moment = require("moment-timezone");
import { ExportCalendarResponse } from "./models/export-calendar-response";
import { ICalendarExportService } from "../common/calendar-export-service";
import { ConfigService } from "../common/config-service";
import { IEventRepository } from "../events/event-repository";
import { SearchEventsByUserRepoRequest } from "./models/search-events-by-user-repo-request";
import { DoorsOpenTimeFormat } from "../tickets/model/doors-open-time-format";
import { InputDateParameterParseUtil } from "../tickets/model/input-date-parameter-parse";

export interface IEventCalendarController {
    getEventsByDay(request: GetEventsByDayRequest): Promise <GetEventsResponse>;
    getEventsByWeek(request: GetEventsByWeekRequest): Promise <GetEventsResponse>;
    getEventsByMonth(request: GetEventsByMonthRequest): Promise <GetEventsResponse>;
    exportCalendar(): Promise<ExportCalendarResponse>;
}

export class EventCalendarController implements IEventCalendarController {
    constructor(
        private context: IUserContext,
        private eventRepository: IEventRepository,
        private calendarExportService: ICalendarExportService,
        private configService: ConfigService
    ){}

    public async getEventsByDay(request: GetEventsByDayRequest): Promise<GetEventsResponse> {
        this.context.validateIfAuthenticated();
        request.validate(this.context.lang);
        const timeZone = await this.configService.getConfig("timeZone", "Europe/Vienna");
        const response = new GetEventsResponse();

        const searchRequest = new SearchEventsByUserRepoRequest();
        searchRequest.fromDate = request.date;
        searchRequest.toDate = request.date;
        searchRequest.userId = this.context.userId;

        const events = await this.eventRepository.search(searchRequest);
        response.events = [];

        for (let i = 0; i < events.length; i++) {
            const t = events[i];

            const eventCalendarResponse = new EventCalendarResponse();
            eventCalendarResponse.date = InputDateParameterParseUtil.getDateInTimeZone(t.date, timeZone);
            eventCalendarResponse.eventName = t.eventName;
            eventCalendarResponse.locationAddres = t.locationAddress;
            eventCalendarResponse.locationName = t.locationName;
            eventCalendarResponse.beginTime = InputDateParameterParseUtil.getDateInTimeZone(t.beginTime, timeZone);
            eventCalendarResponse.doorsOpen = DoorsOpenTimeFormat.format(t.doorsOpen);
            response.events.push(eventCalendarResponse);
        }


        return response;
    }

    public async getEventsByWeek(request: GetEventsByWeekRequest): Promise<GetEventsResponse> {
        this.context.validateIfAuthenticated();
        request.validate(this.context.lang);
        const timeZone = await this.configService.getConfig("timeZone", "Europe/Vienna");

        const response = new GetEventsResponse();

        const searchRequest = new SearchEventsByUserRepoRequest();
        searchRequest.fromDate = request.fromDate;
        searchRequest.toDate = request.toDate;
        searchRequest.userId = this.context.userId;

        const events = await this.eventRepository.search(searchRequest);
        response.events = [];

        for (let i = 0; i < events.length; i++) {
            const t = events[i];

            const eventCalendarResponse = new EventCalendarResponse();
            eventCalendarResponse.date = InputDateParameterParseUtil.getDateInTimeZone(t.date, timeZone)
            eventCalendarResponse.eventName = t.eventName;
            eventCalendarResponse.locationAddres = t.locationAddress;
            eventCalendarResponse.locationName = t.locationName;
            eventCalendarResponse.beginTime = InputDateParameterParseUtil.getDateInTimeZone(t.beginTime, timeZone);
            eventCalendarResponse.doorsOpen = DoorsOpenTimeFormat.format(t.doorsOpen);
            response.events.push(eventCalendarResponse);
        }


        return response;
    }

    public async getEventsByMonth(request: GetEventsByMonthRequest): Promise<GetEventsResponse> {
        this.context.validateIfAuthenticated();
        request.validate(this.context.lang);
        const timeZone = await this.configService.getConfig("timeZone", "Europe/Vienna");

        const response = new GetEventsResponse();

        const searchRequest = new SearchEventsByUserRepoRequest();
        
        const fromDate = moment.tz(moment([request.year, request.month - 1]), timeZone);
        const toDate = moment(fromDate).endOf('month');

        searchRequest.fromDate = new Date(fromDate.format());
        searchRequest.toDate = new Date(toDate.format());

        searchRequest.userId = this.context.userId;

        const events = await this.eventRepository.search(searchRequest);
        response.events = [];

        for (let i = 0; i < events.length; i++) {
            const t = events[i];

            const eventCalendarResponse = new EventCalendarResponse();
            eventCalendarResponse.date = InputDateParameterParseUtil.getDateInTimeZone(t.date, timeZone);
            eventCalendarResponse.eventName = t.eventName;
            eventCalendarResponse.locationAddres = t.locationAddress;
            eventCalendarResponse.locationName = t.locationName;
            eventCalendarResponse.beginTime = InputDateParameterParseUtil.getDateInTimeZone(t.beginTime, timeZone);
            eventCalendarResponse.doorsOpen = DoorsOpenTimeFormat.format(t.doorsOpen);
            response.events.push(eventCalendarResponse);
        }


        return response;
    }

    public async exportCalendar(): Promise<ExportCalendarResponse> {
        this.context.validateIfAuthenticated();

        let file = await this.calendarExportService.exportCalendarEvents(this.context.userId);

        let response: ExportCalendarResponse = new ExportCalendarResponse();
        response.calendarExportData = file;

        return response;
    }

}