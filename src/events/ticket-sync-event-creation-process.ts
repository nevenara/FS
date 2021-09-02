import { IImageCompressor } from "../common/image-helper";
import { MultierFile } from "../common/multier-file";
import { IOrganizerRepository } from "../organizer/organizer-repository";
import { TicketDbObject } from "../tickets/model/ticket-db-object";
import { ITicketRepository } from "../tickets/ticket-repository";
import { EventDbObject } from "./event-db-object";
import { IEventRepository } from "./event-repository";
import { IEventValue } from "./event-value";

export interface ITicketSyncEventCreationProcess {
    checkSyncTicket(ticket: TicketDbObject, eventImage: MultierFile): Promise<EventDbObject>;
}

//Event can be created when first ticket of that event is synced or by organizer in admin panel
export class TicketSyncEventCreationProcess implements ITicketSyncEventCreationProcess {

    constructor(
        private eventRepository: IEventRepository,
        private imageCompressor: IImageCompressor) {
    }

    public async checkSyncTicket(ticket: TicketDbObject, eventImage: MultierFile): Promise<EventDbObject> {
        //check if event exists already and if so skip creation

        const event: IEventValue =
            await this.eventRepository.getByEventNameAndLocation(ticket.eventName, ticket.locationName, ticket.date);

        if (!event) {
            const eventDb = new EventDbObject();
            eventDb.organizerId = [];
            eventDb.eventName = ticket.eventName;
            eventDb.locationAddress = ticket.locationAddress;
            eventDb.locationName = ticket.locationName;
            eventDb.date = ticket.date;
            eventDb.beginTime = ticket.beginTime;
            eventDb.doorsOpen = ticket.doorsOpen;
            eventDb.organizerId.push(ticket.organizerId);

            if (eventImage) {
                const smallImage = await this.imageCompressor.compressImage(eventImage.buffer);
                eventDb.image = smallImage || eventImage.buffer;
                eventDb.imageMimetype = eventImage.mimetype;
                eventDb.imageSize = eventImage.size;
                eventDb.imageOriginalName = eventImage.originalname;
            }

            await this.eventRepository.create(eventDb);

            return eventDb;
        }

        if (!event.organizerId.includes(ticket.organizerId)){
            event.organizerId.push(ticket.organizerId);

            await this.eventRepository.updateObjectById(event._id, new EventDbObject(event));
        }

        return new EventDbObject(event);
    }
}