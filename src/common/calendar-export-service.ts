import { LocalisationKey } from "../localisation/localisation-key";
import { IOrganizerRepository } from "../organizer/organizer-repository";
import { IOrganizerValue } from "../organizer/organizer-value";
import { ValidationError } from "./errors/validation-error";
import { InternalError } from "./errors/internal-error";
import { ILocalisationProvider } from "../localisation/localisation-provider";
import { IEventRepository } from "../events/event-repository";
import { SearchEventsByUserRepoRequest } from "../event-calendar/models/search-events-by-user-repo-request";

const ics = require('ics');

export interface ICalendarExportService {
    exportCalendarEvents(userId: string): Promise<string>;
}

export class CalendarExportService {
    constructor(
        private eventRepository: IEventRepository,
        private organizerRepository: IOrganizerRepository,
        private localisationProvider: ILocalisationProvider
    ) {}

    public async exportCalendarEvents(userId: string): Promise<string> {
        let searchRequest: SearchEventsByUserRepoRequest = new SearchEventsByUserRepoRequest();
        searchRequest.userId = userId;

        let eventsRepoRes = await this.eventRepository.search(searchRequest);
        let events = [];

        for (let i = 0; i < eventsRepoRes.length; i++) {
            const eventRepoRes = eventsRepoRes[i];

            if(eventRepoRes.eventName && eventRepoRes.beginTime) {
                let event = {
                    title: eventRepoRes.eventName,
                    start: [eventRepoRes.beginTime.getFullYear(), eventRepoRes.beginTime.getMonth() + 1, eventRepoRes.beginTime.getDate(), eventRepoRes.beginTime.getHours(), eventRepoRes.beginTime.getMinutes()],
                    location: eventRepoRes.locationName + ', ' + eventRepoRes.locationAddress,
                    end: [eventRepoRes.beginTime.getFullYear(), eventRepoRes.beginTime.getMonth() + 1, eventRepoRes.beginTime.getDate(), 23, 59],
                };
                
                events.push(event);
            }
        }

        let createEventResponse = await ics.createEvents(events);

        if (createEventResponse.error) {
            throw new InternalError(createEventResponse.error, this.localisationProvider.translate(LocalisationKey.CalendarExportError));
        }

        return createEventResponse.value;
    }
}