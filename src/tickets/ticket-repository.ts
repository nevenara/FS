import { EntityType } from "../db/entity-type";
import { MongoRepository, IMongoRepository } from "../db/mongo-repository";
import { TicketDbObject } from "./model/ticket-db-object";
import { Model } from "mongoose";
import { SearchTicketRepoRequest } from "./model/search-ticket-repo-request";
import { ITicketValue } from "./model/ticket";
import { QueryObject } from "../db/query/query-object";
import moment = require("moment");
import { TicketStatus } from "./model/ticket-status";
import { SearchTicketRepoResponse } from "./model/search-ticket-repo-response";
import { GetNonPersonalizedTicketsRepoRequest } from "./model/get-non-personalized-tickets-repo-request";
import { GetNonPersonalizedTicketsRepoResponse } from "./model/get-non-personalized-tickets-repo-response";
import { GetTicketByEventAndSyncDateRepoRequest } from "./model/get-ticket-by-event-and-sync-date-repo-request";
import * as mongoose from "mongoose";
import { SearchAdminPanelTicketsRepoRequest } from "./model/search-admin-panel-tickets-repo-request";
import { SortOrder } from "../db/query/sort-option";
import { isGetAccessor } from "typescript";
import { Guard } from "../common/errors/guard";
import { SearchEventOrganizersBillingRequest } from "../admin/organizers/models/search-events-organizers-billing-request";
import { IEventValue } from "../events/event-value";
import { fail } from "assert";

export interface ITicketRepository extends IMongoRepository<TicketDbObject> {
    getTicketByQRUuid(qrUuid: string): Promise<ITicketValue>;
    getGroupedTicketsByPrice(request: SearchEventOrganizersBillingRequest): Promise<any>;
    getTotalTicketsPerEventByOrganizer(organizerId: string, status: TicketStatus[]): Promise<any>;
    getTicketByEventAndSyncDate(ticketRepoRequest: GetTicketByEventAndSyncDateRepoRequest): Promise<ITicketValue>;
    search(request: SearchTicketRepoRequest): Promise<SearchTicketRepoResponse>;
    getTicketById(id: string): Promise<ITicketValue>;
    getTicketsByEmail(email: string): Promise<Array<ITicketValue>>;
    getNonPersonalizedGroupedTicketsByEventAndSyncDate(request: GetNonPersonalizedTicketsRepoRequest): Promise<GetNonPersonalizedTicketsRepoResponse>;
    getTotalPersonalizedTickets(organizerId: string): Promise<number>;
    getTotalIncomingTickets(organizerId: string): Promise<number>;
    searchAdminPanelTickets(request: SearchAdminPanelTicketsRepoRequest): Promise<SearchTicketRepoResponse>;
    getTotalIncomingTicketsByEvents(request: SearchEventOrganizersBillingRequest): Promise<ITicketValue[]>;
}

export class TicketRepository extends MongoRepository<TicketDbObject> implements ITicketRepository {
    constructor() {
        super(EntityType.Ticket);
    }
    
    public async getTicketByQRUuid(qrUuid: string): Promise<ITicketValue> {
        let tickets = [];
        const query = new QueryObject(new TicketDbObject());
        query.addSelectOption({ field: TicketDbObject.QRUuidName, value: qrUuid });

        const results: JSON[] = await this.find(query);

        if (results && results.length > 0) {
            return results[0] as unknown as ITicketValue;
        }

        return null;
    }

    public async getGroupedTicketsByPrice(request: SearchEventOrganizersBillingRequest): Promise<any> {
        const model: Model<TicketDbObject> = this.getModel();
        const pipeline = [];

        const searchModel = {};

        searchModel['status'] = {"$in": [TicketStatus.NonPersonalized, TicketStatus.Personalized, TicketStatus.RePersonalisationWaiting,
                                        TicketStatus.WaitingForPaymentStatus, TicketStatus.ForSale]};

        if (request.organizerId) {
            searchModel['organizerId'] = new mongoose.Types.ObjectId(request.organizerId);
        }

        if (request.eventNames && request.eventNames.length > 0) {
            searchModel['eventName'] = { "$in": request.eventNames };
        }

        if (request.locations && request.locations.length > 0) {
            searchModel['locationName'] = { "$in": request.locations };
        }

        if (request.dateFrom || request.dateTo) {
            const dateFillter = {};

            if (request.dateFrom) {
                dateFillter['$gte'] = new Date(request.dateFrom);
            }

            if (request.dateTo) {
                request.dateTo = new Date(request.dateTo);
                request.dateTo.setHours(request.dateTo.getHours() + 24);
               
                dateFillter['$lte'] = request.dateTo;
            }

            searchModel['date'] = dateFillter;
        }


        pipeline.push({
            '$match': searchModel
        });

        pipeline.push({
            '$group': {
                _id: {
                    price: '$originalPrice'
                },
                amountOfTickets: {
                    $sum: 1
                }
            }
        });

        const results = await model.aggregate(pipeline).sort({ _id: SortOrder.ASCEND }).exec();
        return results || [];

    }

    public async getTotalIncomingTicketsByEvents(request: SearchEventOrganizersBillingRequest): Promise<ITicketValue[]> {
        const model: Model<TicketDbObject> = this.getModel();
        const searchModel = {};

        searchModel['status'] = {"$in": [TicketStatus.NonPersonalized, TicketStatus.Personalized, TicketStatus.RePersonalisationWaiting,
            TicketStatus.WaitingForPaymentStatus, TicketStatus.ForSale]};


        if (request.organizerId) {
            searchModel['organizerId'] = new mongoose.Types.ObjectId(request.organizerId);
        }

        if (request.eventNames && request.eventNames.length > 0) {
            searchModel['eventName'] = { "$in": request.eventNames };
        }

        if (request.locations && request.locations.length > 0) {
            searchModel['locationName'] = { "$in": request.locations };
        }

        if (request.dateFrom || request.dateTo) {
            const dateFillter = {};

            if (request.dateFrom) {
                dateFillter['$gte'] = new Date(request.dateFrom);
            }

            if (request.dateTo) {
                request.dateTo = new Date(request.dateTo);
                request.dateTo.setHours(request.dateTo.getHours() + 24);
               
                dateFillter['$lte'] = request.dateTo;
            }

            searchModel['date'] = dateFillter;
        }

        console.log(searchModel)
        const results = await model.find(searchModel).exec();
        return results;

    }

    public async getTotalTicketsPerEventByOrganizer(organizerId: string, status: TicketStatus[]) {
        const model: Model<TicketDbObject> = this.getModel();
        const pipeline = [];

        const searchModel = {};

        searchModel['organizerId'] = new mongoose.Types.ObjectId(organizerId);

        if (status) {
            searchModel['status'] = { '$in': status };
        }

        pipeline.push({
            '$match': searchModel
        });

        pipeline.push({
            '$group': {
                _id: {
                    eventId: '$eventId',
                    event: '$eventName'
                },
                amountOfTickets: {
                    $sum: 1
                }
            }
        });
        console.log(searchModel);
        const tickets = await model.aggregate(pipeline).sort({ amountOfTickets: -1 }).exec();
        return tickets;
    }

    public async getTicketByEventAndSyncDate(ticketRepoRequest: GetTicketByEventAndSyncDateRepoRequest): Promise<ITicketValue> {
        let query = {
            'eventId': ticketRepoRequest.eventId,
            'syncDate': ticketRepoRequest.syncDate
        }

        const results: JSON[] = await this.getModel().find(query);

        if (results && results.length > 0) {

            return (results[0] as unknown) as ITicketValue;
        }

        return null;
    }

    public async search(request: SearchTicketRepoRequest): Promise<SearchTicketRepoResponse> {
        const model: Model<TicketDbObject> = this.getModel();

        const searchModel = {};
        let users = [];

        if (request.userId || request.linkedAccounts) {
            if (request.userId) {
                users.push(request.userId);
            }

            if (request.linkedAccounts && request.linkedAccounts.length > 0) {
                users = users.concat(request.linkedAccounts);
            }

            searchModel['userId'] = { "$in": users };
        }

        if (request.ticketId) {
            searchModel['ticketId'] = request.ticketId;
        }

        if (request.locationName) {
            searchModel['locationName'] = request.locationName;
        }

        if (request.eventId) {
            searchModel['eventId'] = request.eventId;
        }

        if (request.originalUserId) {
            searchModel['originalUserId'] = request.originalUserId;
        }

        if (request.organizerId) {
            searchModel['organizerId'] = request.organizerId;
        }

        if (request.bookingId) {
            searchModel['bookingId'] = request.bookingId;
        }

        if (request.categories && request.categories.length != 0) {
            searchModel['category'] = { "$in": request.categories };
        }

        if (request.fromDate || request.toDate) {
            const dateFillter = {};

            if (request.fromDate) {
                dateFillter['$gte'] = request.fromDate;
            }

            if (request.toDate) {
                request.toDate = new Date(request.toDate);
                request.toDate.setHours(request.toDate.getHours() + 24);
               
                dateFillter['$lte'] = request.toDate;
            }

            searchModel['date'] = dateFillter;
        }

        if (request.beginTime) {
            searchModel['beginTime'] = request.beginTime;
        }

        if (request.syncDate) {
            searchModel['syncDate'] = request.syncDate;
        }

        if (request.fromPrice || request.toPrice) {
            const priceFilter = {};
            if (request.fromPrice) {
                priceFilter['$gte'] = request.fromPrice;
            }

            if (request.toPrice) {
                priceFilter['$lte'] = request.toPrice;
            }

            searchModel['priceForSale'] = priceFilter;
        }

        if (request.eventName && request.eventName.trim() != "") {
            let regexp = new RegExp(request.eventName);
            searchModel['eventName'] = { '$regex': regexp, '$options': 'i' };
        }

        if (request.location && request.location.trim() != "") {
            let regexp = new RegExp(request.location);
            searchModel['locationName'] = { '$regex': regexp, '$options': 'i' };
        }

        if (request.locations && request.locations.length != 0) {
            searchModel['locationName'] = { '$in': request.locations };
        }

        if (request.status && request.status.length) {
            searchModel['status'] = { '$in': request.status };

            //check if it is for marketplace
            if (request.status.includes(TicketStatus.ForSale) && request.marketplace) {
                const nullFilter = { reservationExpirationDate: null };

                let othersTickets = { '$not': { '$in': users } };
                searchModel['userId'] = othersTickets;
            }
        }

        if(request.notPending) {
            searchModel['$or'] = [{pendingUsername: {$exists: false}}, {pendingUsername:  {$eq: null}}];
        }

        if(request.status && request.status.length > 0 && request.linkedAccountsTicket && request.linkedAccounts && request.linkedAccounts.length > 0) {
            delete searchModel['status'];

            const allowedStatuses = [TicketStatus.Personalized, TicketStatus.RePersonalisationWaiting, TicketStatus.WaitingForPaymentStatus, TicketStatus.ForSale, TicketStatus.CheckedIn];

            searchModel['$or'] = [{ 'userId': { '$in': request.linkedAccounts }}, 
            { '$and': [ { 'userId': { '$in': users }}, {'status': { '$in': request.status }}]}];


            if(request.notPending){
                delete searchModel['$or'];
                searchModel['$and'] = [ { '$or': /*[{ 'status': { '$in': request.status }}, 
            { '$and': [ { 'userId': { '$in': request.linkedAccounts }}, {'status': { '$in': allowedStatuses }} ]}]}*/

            [  { '$and': [ { 'userId': { '$in': request.linkedAccounts }}, {'status': { '$in': allowedStatuses }} ]}, 
            { '$and': [ { 'userId': { '$in': users }}, {'status': { '$in': request.status }}]}]},
                                     { '$or': [{ pendingUsername: {$exists: false}}, {pendingUsername:  {$eq: null}}]}];
            }
        }

        if (request.notInTicketIds) {
            searchModel['_id'] = { '$not': { '$in': request.notInTicketIds } }
        }

        if (request.firstName) {
            searchModel['firstName'] = request.firstName.trim();
        }

        if (request.lastName) {
            searchModel['lastName'] = request.lastName.trim();
        }

        console.log(searchModel)
        const response = new SearchTicketRepoResponse();
        var tickets: Array<ITicketValue> = new Array<ITicketValue>();
        let results = null;

        if (request.page && request.limit) {
            //pagination
            const count = await model.countDocuments(searchModel);
            response.totalPages = Math.ceil(count / request.limit);

            results = await model.find(searchModel)
                .sort({
                    date: 1,
                    beginTime: 1,
                    eventName: 1,
                    firstName: 1,
                    lastName: 1
                })
                .limit(request.limit)
                .skip((request.page - 1) * request.limit)
                .lean()
                .exec();
        }
        else {
            results = await model.find(searchModel).lean().exec();
        }

        if (results && results.length > 0) {
            results.forEach(result => {
                tickets.push((result as unknown) as ITicketValue);
            });
        }

        response.tickets = tickets;

        return response;
    }

    public async getTicketById(id: string): Promise<ITicketValue> {
        Guard.isTruthy(id, 'ticket id cannot be null.');
        const query = new QueryObject(new TicketDbObject());
        query.addSelectOption({ field: TicketDbObject.TicketIdFieldName, value: id });

        const result: JSON = await this.findById(id);

        if (result) {
            return (result as unknown) as ITicketValue;
        }

        return null;
    }

    public async getTicketsByEmail(email: string): Promise<Array<ITicketValue>> {
        let tickets = [];
        const query = new QueryObject(new TicketDbObject());
        query.addSelectOption({ field: TicketDbObject.EmailFieldName, value: email });

        const results: JSON[] = await this.find(query);

        if (results && results.length > 0) {
            results.forEach(r => {
                tickets.push((r as unknown) as ITicketValue);
            });
        }

        return tickets;
    }

    public async getNonPersonalizedGroupedTicketsByEventAndSyncDate(request: GetNonPersonalizedTicketsRepoRequest): Promise<GetNonPersonalizedTicketsRepoResponse> {
        let model = this.getModel();

        const pipeline = [];
        pipeline.push({
            '$match': {
                'userId': new mongoose.Types.ObjectId(request.userId),
                'status': { '$in': [TicketStatus.NonPersonalized, TicketStatus.RePersonalisationWaiting] }
            }
        });

        pipeline.push({
            '$group': {
                _id: {
                    eventId: '$eventId',
                    event: '$eventName',
                    date: '$date',
                    time: '$beginTime',
                    locationName: '$locationName',
                    locationAddress: '$locationAddress',
                    doorsOpen: '$doorsOpen',
                    syncDate: '$syncDate'
                },
                amountOfTickets: {
                    $sum: 1
                }
            }
        });

        console.log('Personalization: ', pipeline[0]['$match']);

        let results: JSON[] = await model.aggregate(pipeline)
            .sort({ _id: 1 })
            .skip((request.page - 1) * request.limit)
            .limit(request.limit)
            .exec();

        const response = new GetNonPersonalizedTicketsRepoResponse();
        response.tickets = results;

        pipeline.push({
            '$count': 'totalTickets'
        });

        const count = await model.aggregate(pipeline).exec();
        const totalPages = count[0] ? count[0]['totalTickets'] : 0;
        response.totalPages = Math.ceil(totalPages / request.limit);


        return response;
    }

    public async getTotalIncomingTickets(organizerId: string): Promise<number> {
        const model: Model<TicketDbObject> = this.getModel();


        let count = 0;

        if (organizerId) {
            count = await model.countDocuments({ organizerId: organizerId });

        }
        else {
            count = await model.countDocuments();

        }

        return count;
    }

    public async getTotalPersonalizedTickets(organizerId: string): Promise<number> {
        const model: Model<TicketDbObject> = this.getModel();

        let count = 0;

        if (organizerId) {
            count = await model.countDocuments({ organizerId: organizerId, status: TicketStatus.Personalized });

        }
        else {
            count = await model.countDocuments({ status: TicketStatus.Personalized });

        }

        return count;
    }

    public async searchAdminPanelTickets(request: SearchAdminPanelTicketsRepoRequest): Promise<SearchTicketRepoResponse> {
        const model: Model<TicketDbObject> = this.getModel();
        const pipeline = [];

        /** For fields:
         * Organizer ---> lookup in organizers
         * Ticket buyer (originalUserId) ---> lookup in users
         * 
         */

        pipeline.push({
            '$match': {
                status: { '$not': {'$in': [TicketStatus.Returned, TicketStatus.Blocked, TicketStatus.NotAvailable]}} 
            }
        });

        pipeline.push({
            '$lookup': {
                from: 'organizers',
                localField: 'organizerId',
                foreignField: '_id',
                as: 'organizer'
            }
        });

        pipeline.push({
            '$lookup': {
                from: 'users',
                localField: 'originalUserId',
                foreignField: '_id',
                as: 'ticketBuyer'
            }
        });

        pipeline.push({
            '$lookup': {
                from: 'users',
                localField: 'userId',
                foreignField: '_id',
                as: 'ticketHolder'
            }
        });

        //Transform array fields to objects
        pipeline.push({
            '$unwind': {
                path: '$organizer',
                preserveNullAndEmptyArrays: true
            }
        });

        pipeline.push({
            '$unwind': {
                path: '$ticketBuyer',
                preserveNullAndEmptyArrays: true
            }
        });

        pipeline.push({
            '$unwind': {
                path: '$ticketHolder',
                preserveNullAndEmptyArrays: true
            }
        });


        //Getting all necessary fields
        pipeline.push({
            '$project': {
                bookingId: '$bookingId',
                ticketId: '$ticketId',
                organizer: '$organizer.companyName',
                eventName: '$eventName',
                eventDate: '$date',
                eventId: '$eventId',
                eventLocation: { $concat: ['$locationName', '-', '$locationAddress'] },
                ticketBuyer: { $concat: ['$ticketBuyer.firstname', ' ', '$ticketBuyer.lastname'] },
                ticketHolder: { $concat: ['$ticketHolder.firstname', ' ', '$ticketHolder.lastname'] },
                status: '$status',
                seat: '$seat',
                syncDate: '$syncDate',
                ticketHolderUser: '$ticketHolder',
                pendingUsername: '$pendingUsername',
                userId: '$userId'
            }
        });


        //Filters
        const searchModel = {};

        if (request.eventName && request.eventName.trim() != "") {
            let regexp = new RegExp(request.eventName);

            searchModel['eventName'] = { '$regex': regexp, '$options': 'i' };
        }

        if (request.eventLocation && request.eventLocation.trim() != "") {
            let regexp = new RegExp(request.eventLocation);

            searchModel['eventLocation'] = { '$regex': regexp, '$options': 'i' };
        }

        if (request.ticketId && request.ticketId.trim() != "") {
            let regexp = new RegExp(request.ticketId);

            searchModel['ticketId'] = { '$regex': regexp, '$options': 'i' };
        }

        if (request.bookingId && request.bookingId.trim() != "") {
            let regexp = new RegExp(request.bookingId);

            searchModel['bookingId'] = { '$regex': regexp, '$options': 'i' };
        }

        if (request.organizer && request.organizer.trim() != "") {
            if (request.organizerAdminPanel) {
                searchModel['organizer'] = request.organizer;
            }
            else {
                let regexp = new RegExp(request.organizer);

                searchModel['organizer'] = { '$regex': regexp, '$options': 'i' };
            }

        }

        if (request.ticketBuyer && request.ticketBuyer.trim() != "") {
            let regexp = new RegExp(request.ticketBuyer);

            searchModel['ticketBuyer'] = { '$regex': regexp, '$options': 'i' };
        }

        const ticketHolderFilter = {};
        if (request.ticketHolder && request.ticketHolder.trim() != "") {
            let regexp = new RegExp(request.ticketHolder);

            ticketHolderFilter['$regex'] = regexp;
            ticketHolderFilter['$options'] = 'i';

        }

        const pendingFilter = {};
        const beforeTwoDays = moment().subtract(2,'d').toDate();

        if (request.personalizationPending) {
            const stripeErrorsFilter = {};
            stripeErrorsFilter['$or'] = [{'ticketHolderUser.stripeErrors': {$exists: false}}, 
                                    {'ticketHolderUser.stripeErrors':  {$eq: null}}, 
                                    {'ticketHolderUser.stripeErrors': {$size: 0}}];
            
            const dateFilter = {};
            dateFilter['$or'] = [ {'$and': [{'pendingUsername': {$exists: true}}, {'pendingUsername': {$ne: null}}]},
                                { syncDate: {$gte: beforeTwoDays} }]
            pendingFilter['$and'] = [stripeErrorsFilter, dateFilter];
            
        }

        const blockedFilter = {};
        if(request.blocked) {
            const stripeErrorsFilter = {};
            stripeErrorsFilter['$or'] = [{'ticketHolderUser.stripeErrors': {$exists: false}}, 
                                    {'ticketHolderUser.stripeErrors':  {$eq: null}}, 
                                    {'ticketHolderUser.stripeErrors': {$size: 0}}];
            
            const usernamePendindFilter = {};
            usernamePendindFilter['$or'] = [{'pendingUsername': {$exists: false}}, 
                                            {'pendingUsername':  {$eq: null}}];
            
            blockedFilter['$and'] = [stripeErrorsFilter, { syncDate: {$lt: beforeTwoDays} }, usernamePendindFilter];
        }

        const failedFilter = {};

        if(request.personalizationFailed) {
            failedFilter['$and'] = [{'ticketHolderUser.stripeErrors': {$exists: true}},  
                                    {'$nor': [{'ticketHolderUser.stripeErrors': {$size: 0}}, {'ticketHolderUser.stripeErrors':  {$eq: null}}]}];
            
        }

        searchModel['$or'] = [];

        if (Object.keys(pendingFilter).length != 0) {
            searchModel['$or'].push(pendingFilter);
        }

        if (Object.keys(blockedFilter).length != 0) {
            searchModel['$or'].push(blockedFilter);
        }

        if (Object.keys(failedFilter).length != 0) {
            searchModel['$or'].push(failedFilter);
        }

        if(searchModel['$or'].length == 0) {
            delete searchModel['$or'];
        }

        if (Object.keys(ticketHolderFilter).length != 0) {
            searchModel['ticketHolder'] = ticketHolderFilter;
        }

        if (request.status && request.status.length != 0) {
            searchModel['status'] = { '$in': request.status };
        }



        if (request.fromDate || request.toDate) {
            const dateFillter = {};

            if (request.fromDate) {
                dateFillter['$gte'] = new Date(request.fromDate);
            }

            if (request.toDate) {
                let toDate = new Date(request.toDate);
                toDate.setHours(toDate.getHours() + 24);
               
                dateFillter['$lte'] = toDate;
            }

            searchModel['eventDate'] = dateFillter;
        }
        console.log(searchModel)
        //Filters are set
        if (Object.keys(searchModel).length != 0) {
            pipeline.push({
                '$match': searchModel
            });
        }

        //Sort
        let sortField = '_id';
        if (request.sortField) {
            sortField = request.sortField;
        }

        let sortOrder = SortOrder.DESCEND;
        if (request.sortOrder) {
            sortOrder = request.sortOrder;
        }

        let results: JSON[] = await model.aggregate(pipeline)
            //custom sort
            .sort({ [sortField]: sortOrder })
            .skip((request.page - 1) * request.limit)
            .limit(request.limit)
            .exec();

        const response: SearchTicketRepoResponse = new SearchTicketRepoResponse();
        response.tickets = results;

        pipeline.push({
            '$count': 'totalTickets'
        });

        const count = await model.aggregate(pipeline).exec();
        const totalRecords = count[0] ? count[0]['totalTickets'] : 0;
        response.totalPages = Math.ceil(totalRecords / request.limit);
        response.totalRecords = totalRecords;

        return response;
    }

}