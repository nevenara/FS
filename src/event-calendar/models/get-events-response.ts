export class GetEventsResponse {
    public events: EventCalendarResponse[];
}

export class EventCalendarResponse {
    eventId: string;
    date: string;
    eventName: string;
    locationAddres: string;
    locationName: string;
    beginTime: string;
    doorsOpen: string;
}