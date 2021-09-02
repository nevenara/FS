import { GetEventDetailsRequest } from "../admin/organizers/models/get-event-details-request";
import { GetEventDetailsResponse } from "../admin/organizers/models/get-event-details-response";
import { ConfigService } from "../common/config-service";
import { Guard } from "../common/errors/guard";
import { ValidationError } from "../common/errors/validation-error";
import { IUserContext } from "../common/user-context";
import { LocalisationKey } from "../localisation/localisation-key";
import { UserType } from "../models/user-type";
import { EventDbObject } from "./event-db-object";
import { IEventRepository } from "./event-repository";
import { IEventValue } from "./event-value";
import moment = require("moment-timezone");
import { UploadEventImageRequest } from "../admin/organizers/models/upload-event-image-request";
import { UploadEventImageResponse } from "../admin/organizers/models/upload-event-image-response";
import { DeleteEventImageResponse } from "../admin/organizers/models/delete-event-image-response";
import { DeleteEventImageRequest } from "../admin/organizers/models/delete-event-image-request";
import { IOrganizerRepository } from "../organizer/organizer-repository";
import { IImageCompressor } from "../common/image-helper";
import { DeleteSeatPlanImageRequest } from "../admin/organizers/models/delete-seat-plan-image-request";
import { DeleteSeatPlanResponse } from "../admin/organizers/models/delete-seat-plan-response";
import { ISeatPlanRepository } from "./seat-plan/seat-plan-repository";
import { SeatPlanDbObject } from "./seat-plan/seat-plan-db-object";
import { ISeatPlanValue } from "./seat-plan/seat-plan-value";
import { UploadSeatPLanRequest } from "../admin/organizers/models/upload-seat-plan-request";
import { UploadSeatPlanResponse } from "../admin/organizers/models/upload-seat-plan-response";
import { CheckSeatPLanRequest } from "../admin/organizers/models/check-seat-plan-request";
import { CheckSeatPLanResponse } from "../admin/organizers/models/check-seat-plan-response";
import { InputDateParameterParseUtil } from "../tickets/model/input-date-parameter-parse";
import { Environment } from "../environment";
import { promises as fs } from 'fs';
import { ILocalisationProvider } from "../localisation/localisation-provider";

const path = require('path');


export interface IEventController {
    getDefaultEventImage(): Promise<any>;
    getDefaultSeatPLanImage(): Promise<any>;
    checkSeatPLan(request: CheckSeatPLanRequest): Promise<CheckSeatPLanResponse>;
    getSeatPlanImage(eventId: string): Promise<ISeatPlanValue>;
    uploadSeatPlan(request: UploadSeatPLanRequest): Promise<UploadSeatPlanResponse>;
    deleteSeatPlanImage(request: DeleteSeatPlanImageRequest): Promise<DeleteSeatPlanResponse>;
    deleteEventImage(request: DeleteEventImageResponse): Promise<DeleteEventImageResponse>;
    uploadEventImage(request: UploadEventImageRequest): Promise<UploadEventImageResponse>;
    getEventDetails(request: GetEventDetailsRequest): Promise<GetEventDetailsResponse>;
    getImage(eventId: string): Promise<IEventValue>
}

export class EventController implements IEventController {
    constructor(
        private eventRepository: IEventRepository,
        private configService: ConfigService,
        private seatPlanRepository: ISeatPlanRepository,
        private imageCompressor: IImageCompressor,
        private organizerRepository: IOrganizerRepository,
        private localisationProvider: ILocalisationProvider,
        private context?: IUserContext
        ) {
    }
    
    public async getDefaultEventImage(): Promise<any> {
        try{
            let imagePath = Environment.isInsideDocker()
            ? path.join('out', 'src', 'images', 'default-event-image.jpg')
            : path.join('src', 'images', 'default-event-image.jpg');

           
            const image = await fs.readFile(imagePath);
            return image;
        }
        catch(error){
            console.log('Default event image not found.');
            throw error;
        }
    }

    public async getDefaultSeatPLanImage(): Promise<any> {
        try{
            let imagePath = Environment.isInsideDocker()
            ? path.join('out', 'src', 'images', 'default-seat-plan-image.png')
            : path.join('src', 'images', 'default-seat-plan-image.png');

           
            const image = await fs.readFile(imagePath);
            return image;
        }
        catch(error){
            console.log('Default seat plan image not found.');
            throw error;
        }
    }

    public async checkSeatPLan(request: CheckSeatPLanRequest): Promise<CheckSeatPLanResponse> {
        this.context.validateIfAuthenticated();
        this.context.validateIfOrganizer();
        request.validate(this.context.lang);

        const seatPlan: ISeatPlanValue = await this.seatPlanRepository.getSeatPlanByEventId(request.eventId);

        if (!seatPlan) {
            throw new ValidationError(this.localisationProvider.translate(LocalisationKey.SeatPlanDoesntExist));
        }

        const response: CheckSeatPLanResponse = new CheckSeatPLanResponse();

        response.imageSet = seatPlan.image != null;
        response.urlSet = seatPlan.url != null;
        response.url = seatPlan.url;

        return response;

    }

    public async getSeatPlanImage(eventId: string): Promise<ISeatPlanValue> {
        Guard.isTruthy(eventId, 'eventId is required');
        this.context.validateIfAuthenticated();

        const seatPlan: ISeatPlanValue = await this.seatPlanRepository.getSeatPlanByEventId(eventId);

        return seatPlan;
    }

    public async uploadSeatPlan(request: UploadSeatPLanRequest): Promise<UploadSeatPlanResponse> {
        this.context.validateIfAuthenticated();
        this.context.validateIfOrganizer();
        request.validate(this.context.lang);


        let seatPlan: ISeatPlanValue = await this.seatPlanRepository.getSeatPlanByEventId(request.eventId);
    
        if (seatPlan) {
            seatPlan.url = request.url;

            if (request.image) {

                seatPlan.image = request.image['buffer'];
                seatPlan.imageOriginalName = request.image['originalname'];
                seatPlan.imageMimetype = request.image['mimetype'];
                seatPlan.imageSize = request.image['size'];
            }


            await this.seatPlanRepository.updateObjectById(seatPlan._id, new SeatPlanDbObject(seatPlan));
        }
        else {
            const newSeatPlan = new SeatPlanDbObject();
            newSeatPlan.url = request.url;
            newSeatPlan.eventId = request.eventId;

            if (request.image) {

                newSeatPlan.image = request.image['buffer'];
                newSeatPlan.imageOriginalName = request.image['originalname'];
                newSeatPlan.imageMimetype = request.image['mimetype'];
                newSeatPlan.imageSize = request.image['size'];
            }


            await this.seatPlanRepository.create(newSeatPlan);

        }

        const response = new UploadSeatPlanResponse();
        return response;

    }

    public async deleteSeatPlanImage(request: DeleteSeatPlanImageRequest): Promise<DeleteSeatPlanResponse> {
        this.context.validateIfAuthenticated();
        this.context.validateIfOrganizer();

        request.validate(this.context.lang);

        const seatPlan: ISeatPlanValue = await this.seatPlanRepository.getSeatPlanByEventId(request.eventId);
        if (!seatPlan) return;

        seatPlan.image = null;
        seatPlan.imageMimetype = null;
        seatPlan.imageOriginalName = null;
        seatPlan.imageSize = null;

        await this.seatPlanRepository.updateObjectById(seatPlan._id, new SeatPlanDbObject(seatPlan));

        const response: DeleteSeatPlanResponse = new DeleteSeatPlanResponse();
        return response;
    }

    public async deleteEventImage(request: DeleteEventImageRequest): Promise<DeleteEventImageResponse> {
        this.context.validateIfAuthenticated();
        this.context.validateIfOrganizer();

        request.validate(this.context.lang);

        const event: IEventValue = await this.eventRepository.getById(request.eventId);
        if (!event) return;
        event.image = null;
        event.imageMimetype = null;
        event.imageOriginalName = null;
        event.imageSize = null;

        await this.eventRepository.updateObjectById(event._id, new EventDbObject(event));

        const response: DeleteEventImageResponse = new DeleteEventImageResponse();
        return response;
    }

    public async uploadEventImage(request: UploadEventImageRequest): Promise<UploadEventImageResponse> {
        this.context.validateIfAuthenticated();
        this.context.validateIfOrganizer();
        request.validate(this.context.lang);


        let event: IEventValue = await this.eventRepository.getById(request.eventId);
        const smallImage = await this.imageCompressor.compressImage(request.image['buffer']);

        if (event) {

            event.image = smallImage || request.image['buffer'];
            event.imageOriginalName = request.image['originalname'];
            event.imageMimetype = request.image['mimetype'];
            event.imageSize = request.image['size'];

            await this.eventRepository.updateObjectById(event._id, new EventDbObject(event));
        }

        const response = new UploadEventImageResponse();
        return response;

    }

    public async getEventDetails(request: GetEventDetailsRequest): Promise<GetEventDetailsResponse> {
        this.context.validateIfAuthenticated();
        this.context.validateIfOrganizer();

        const response: GetEventDetailsResponse = new GetEventDetailsResponse();
        const event: IEventValue = await this.eventRepository.getById(request.eventId);

        response.eventName = event.eventName;

        const timeZone = await this.configService.getConfig("timeZone", "Europe/Vienna");
        response.eventDate = InputDateParameterParseUtil.getDateInTimeZone(event.date, timeZone);
        response.begin = InputDateParameterParseUtil.getDateInTimeZone(event.beginTime, timeZone);
        response.doorsOpen = moment.tz(event.doorsOpen, timeZone).format('HH:mm');
        response.locationAddress = event.locationAddress;
        response.locationName = event.locationName;
        const organizer = await this.organizerRepository.getOrganizerById(this.context.organizerId);
        response.organizer = organizer.companyName;

        return response;
    }

    public async getImage(eventId: string): Promise<IEventValue> {
        Guard.isTruthy(eventId, 'eventId is required');

        const event: IEventValue = await this.eventRepository.getById(eventId);

        return event;
    }
}