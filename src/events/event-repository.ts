import { pipeline } from "stream";
import { EntityType } from "../db/entity-type";
import { IMongoRepository, MongoRepository } from "../db/mongo-repository";
import { SearchEventsByUserRepoRequest } from "../event-calendar/models/search-events-by-user-repo-request";
import { EventDbObject } from "./event-db-object";
import { IEventValue } from "./event-value";
import { Model } from "mongoose";
import * as mongoose from "mongoose";
import { SearchEventOrganizersBillingRequest } from "../admin/organizers/models/search-events-organizers-billing-request";

export interface IEventRepository extends IMongoRepository<EventDbObject> {
    searchEventsByOrganizer(request: SearchEventOrganizersBillingRequest): Promise<any>;
    getById(eventId: string): Promise<IEventValue>;
    getByEventNameAndLocation(eventName: string, locationName: string, date: Date): Promise<IEventValue>;
    search(request: SearchEventsByUserRepoRequest): Promise<any>;
}

export class EventRepository extends MongoRepository<EventDbObject> implements IEventRepository {
    constructor() {
        super(EntityType.Event);
    }
    
    public async searchEventsByOrganizer(request: SearchEventOrganizersBillingRequest): Promise<any> {
        const model: Model<EventDbObject> = this.getModel();

        const searchModel = {};

        if(request.organizerId) {
            searchModel['organizerId'] = request.organizerId;
        }

        if(request.eventNames && request.eventNames.length > 0){
            searchModel['eventName'] = { "$in": request.eventNames };
        }

        if(request.locations && request.locations.length > 0){
            searchModel['locationName'] = { "$in": request.locations };
        }

        if (request.dateFrom || request.dateTo) {
            const dateFillter = {};

            if (request.dateFrom) {
                dateFillter['$gte'] = request.dateFrom;
            }

            if (request.dateTo) {
                request.dateTo = new Date(request.dateTo);
                request.dateTo.setHours(request.dateTo.getHours() + 24);
               
                dateFillter['$lte'] = request.dateTo;
            }

            searchModel['date'] = dateFillter;
        }

        
        const results = await model.find(searchModel).lean().exec();
       
        return results;

    }

    public async search(request: SearchEventsByUserRepoRequest): Promise<any> {
        let model: Model<EventDbObject> = this.getModel();

        const pipeline = [];

        //We need just users events
        pipeline.push({
            '$lookup': {
                from: 'tickets',
                localField: '_id',
                foreignField: 'eventId',
                as: 'tickets'
            }
        });

        pipeline.push({
            '$project': {
                eventName: '$eventName',
                date: '$date',
                beginTime: '$beginTime',
                locationAddress: '$locationAddress',
                locationName: '$locationName',
                doorsOpen: '$doorsOpen',
                tickets: {
                    $filter: {input: '$tickets', as: 'ticket', cond: {$eq: ['$$ticket.userId', new mongoose.Types.ObjectId(request.userId)]}}
                }
            }
        });

        //Filters
        const searchModel = {};

        if (request.fromDate || request.toDate) {
            const dateFillter = {};

            if (request.fromDate) {
                dateFillter['$gte'] = new Date(request.fromDate);
            }

            if (request.toDate) {
                request.toDate = new Date(request.toDate);
                request.toDate.setHours(request.toDate.getHours() + 24);
               
                dateFillter['$lte'] = new Date(request.toDate);
            }

            searchModel['date'] = dateFillter;
        }
       
        searchModel['tickets'] = {'$not': {$size: 0}};
        
        pipeline.push({
            '$match': searchModel 
        });

        let results: JSON[] = await model.aggregate(pipeline).exec();
        
        return results;
    }

    public async getByEventNameAndLocation(eventName: string, locationName: string, date: Date): Promise<IEventValue> {
        let query = {
            'eventName': eventName,
            'date': date,
            'locationName': locationName
        }

        const results: JSON[] = await this.getModel().find(query);

        if (results && results.length > 0) {

            return (results[0] as unknown) as IEventValue;
        }

        return null;
    }

    public async getById(eventId: string): Promise<IEventValue> {
        let query = {
            '_id': eventId,
        }

        const results: JSON[] = await this.getModel().find(query);

        if (results && results.length > 0) {

            return (results[0] as unknown) as IEventValue;
        }

        return null;
    }
}