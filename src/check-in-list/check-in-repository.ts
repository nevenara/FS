import { EntityType } from "../db/entity-type";
import { IMongoRepository, MongoRepository } from "../db/mongo-repository";
import { SearchCheckInListRepoResponse } from "../scanner/models/search-check-in-list-repo-response";
import { CheckInDbObject } from "./check-in-db-object";
import { ICheckInValue } from "./check-in-value";
import { Model } from "mongoose";
import { SortOrder } from "../db/query/sort-option";
import { SearchCheckInListRepoRequest } from "../scanner/models/search-check-in-list-repo-request";
import * as mongoose from "mongoose";

export interface ICheckInRepository extends IMongoRepository<CheckInDbObject> {
    search(request: SearchCheckInListRepoRequest): Promise<SearchCheckInListRepoResponse>;
    getCheckInById(id: string): Promise<ICheckInValue>;
}

export class CheckInRepository extends MongoRepository<CheckInDbObject> implements ICheckInRepository {
    constructor() {
        super(EntityType.CheckIn);
    }
    
    public async search(request: SearchCheckInListRepoRequest): Promise<SearchCheckInListRepoResponse> {
        const model: Model<CheckInDbObject> = this.getModel();
        const pipeline = [];

        pipeline.push({
            '$lookup': {
                from: 'tickets',
                localField: 'ticketId',
                foreignField: '_id',
                as: 'ticket'
            }
        });

        pipeline.push({
            '$unwind': {
                path: '$ticket',
                preserveNullAndEmptyArrays: true
            }
        });

        pipeline.push({
            '$project': {
                id: '$ticket._id',
                ticketId: '$ticket.ticketId',
                ticketStatus: '$ticket.status',
                firstName: '$ticket.firstName',
                lastName: '$ticket.lastName',
                verificationStatus: '$status',
                reason: '$reason',
                date: '$date',
                eventId: '$eventId'
            }
        });

        const searchModel = {};
        searchModel['eventId'] = request.eventId;
        searchModel['$or'] = [];

        const textSearchFilter= {};

        if(request.textSearch && request.textSearch.trim() != "") {
            let regexp = new RegExp(request.textSearch);

            textSearchFilter['$or'] = [
                {ticketId: {'$regex': regexp, '$options': 'i'}},
                {firstName: {'$regex': regexp, '$options': 'i'}},
                {lastName: {'$regex': regexp, '$options': 'i'}},
                {reason: {'$regex': regexp, '$options': 'i'}},
                {verificationStatus: {'$regex': regexp, '$options': 'i'}}

            ];
        }

        if (Object.keys(textSearchFilter).length != 0) {
            searchModel['$or'].push(textSearchFilter);
        }

        const ticketStatusFilter = {};
        if(request.ticketStatus && request.ticketStatus.length != 0) {
            ticketStatusFilter['ticketStatus'] = { '$in': request.ticketStatus };
        }

        if(request.noStatus) {
            searchModel['$or'].push({ticketId: {$exists: false}});
        }
        if (Object.keys(ticketStatusFilter).length != 0) {
            searchModel['$or'].push(ticketStatusFilter);
        }

        if (Object.keys(searchModel).length != 0) {
            pipeline.push({
                '$match': searchModel
            });
        }

        let sortField = 'date';
        let sortOrder = SortOrder.DESCEND;

        let results: JSON[] = await model.aggregate(pipeline)
        .sort({ [sortField]: sortOrder })
        .skip((request.page - 1) * request.limit)
        .limit(request.limit)
        .exec();

        const response: SearchCheckInListRepoResponse = new SearchCheckInListRepoResponse();
        response.checkIns = results;

        pipeline.push({
            '$count': 'totalCheckins'
        });

        const count = await model.aggregate(pipeline).exec();
        const totalRecords = count[0] ? count[0]['totalCheckins'] : 0;
        response.totalPages = Math.ceil(totalRecords / request.limit);
        response.totalRecords = totalRecords;

        return response;
    }

    public async getCheckInById(id: string): Promise<ICheckInValue> {
        let query = {
            '_id': id,
        }

        const results: JSON[] = await this.getModel().find(query);

        if (results && results.length > 0) {

            return (results[0] as unknown) as ICheckInValue;
        }

        return null;
    }
}