import { EntityType } from "../db/entity-type";
import { IMongoRepository, MongoRepository } from "../db/mongo-repository";
import { QueryObject } from "../db/query/query-object";
import { OrganizerDbObject } from "./organizer-db-object";
import { IOrganizerValue } from "./organizer-value";
import { Model } from 'mongoose';
import { OrganizerStatus } from "./models/organizer-status";
import { SearchOrganizersRequest } from "../admin/organizers/models/search-organizers-request";
import { SearchOrganizersRepoResponse } from "../admin/organizers/models/search-organizers-repo-response";
import { SortOrder } from "../db/query/sort-option";
import { UserStatus } from "../models/user-status";
import { SearchOrganizerSupportRequest } from "../admin/organizers/models/search-organizer-support-request";
import { SearchOrganizerSupportRepoResponse } from "../admin/organizers/models/search-organizer-support-repo-response";

export interface IOrganizerRepository extends IMongoRepository<OrganizerDbObject> {
    searchOrganizerSupport(request: SearchOrganizerSupportRequest): Promise<SearchOrganizerSupportRepoResponse>;
    getOrganizerByCompanyName(companyName: string): Promise<IOrganizerValue>;
    search(request: SearchOrganizersRequest): Promise<SearchOrganizersRepoResponse>;
    getOrganizerById(id: string): Promise<IOrganizerValue>;
    getTotalActiveOrganizers(): Promise<number>;
}

export class OrganizerRepository extends MongoRepository<OrganizerDbObject> implements IOrganizerRepository {
    constructor(){
        super(EntityType.Organizer);
    }
    
    public async searchOrganizerSupport(request: SearchOrganizerSupportRequest): Promise<SearchOrganizerSupportRepoResponse> {
        const model: Model<OrganizerDbObject> = this.getModel();
        const pipeline = [];

        pipeline.push({
            '$lookup': {
                from: 'users',
                localField: '_id',
                foreignField: 'organizerId',
                as: 'user'
            }
        });

        pipeline.push({
            '$unwind': {
                path: '$user',
                preserveNullAndEmptyArrays: true
            }
        });

        const searchModel = {};

        searchModel['user.status'] = { '$not': {'$in': [UserStatus.Deleted]}};

        if(request.companyName && request.companyName.trim() != "") {
            let regexp = new RegExp(request.companyName);
            searchModel['companyName'] = { '$regex': regexp, '$options': 'i' };
        }

        if(request.status && request.status.length != 0) {
            searchModel['status'] = { '$in': request.status };
        }

        if(request.createdFrom || request.createdTo) {
            const dateFillter = {};

            if (request.createdFrom) {
                dateFillter['$gte'] = new Date(request.createdFrom);
            }

            if (request.createdTo) {
                request.createdTo = new Date(request.createdTo);
                request.createdTo.setHours(request.createdTo.getHours() + 24);
               
                dateFillter['$lte'] = new Date(request.createdTo);
            }

            searchModel['created'] = dateFillter;
        }

        const response: SearchOrganizersRepoResponse = new SearchOrganizersRepoResponse();
      
        let sortField = '_id';
        if(request.sortField){
            sortField = request.sortField;
        }

        let sortOrder = SortOrder.DESCEND;
        if(request.sortOrder){
            sortOrder = request.sortOrder;
        }

        pipeline.push({
            '$match': searchModel
        });
        
        response.organizers = await model.aggregate(pipeline)
            .sort({ [sortField]: sortOrder})
            .skip((request.page - 1) * request.limit)
            .limit(request.limit)
            .exec();

        pipeline.push({
            '$count' : 'totalOrganizers'
        });

        const count = await model.aggregate(pipeline).exec();
        response.totalRecords = count[0] ? count[0]['totalOrganizers'] : 0;;
        response.totalPages = Math.ceil(response.totalRecords / request.limit);
       
        return response;
    }
    
    public async getOrganizerByCompanyName(companyName: string): Promise<IOrganizerValue> {
        const query = new QueryObject(new OrganizerDbObject());
        query.addSelectOption({ field: 'companyName', value: companyName });

        const results: JSON[] = await this.find(query);

        if (results && results.length > 0) {
            const organizer = (results[0] as unknown) as IOrganizerValue;
            return organizer;
        }

        return null;
    }
    
    public async search(request: SearchOrganizersRequest): Promise<SearchOrganizersRepoResponse> {
        const model: Model<OrganizerDbObject> = this.getModel();
        const pipeline = [];

        pipeline.push({
            '$lookup': {
                from: 'users',
                localField: '_id',
                foreignField: 'organizerId',
                as: 'user'
            }
        });

        pipeline.push({
            '$unwind': {
                path: '$user',
                preserveNullAndEmptyArrays: true
            }
        });

        const searchModel = {};

        searchModel['user.status'] = { '$not': {'$in': [UserStatus.Deleted]}};

        if(request.companyName && request.companyName.trim() != "") {
            let regexp = new RegExp(request.companyName);
            searchModel['companyName'] = { '$regex': regexp, '$options': 'i' };
        }

        if(request.contactPerson) {
            let regexp = new RegExp(request.contactPerson);
            searchModel['contactPerson'] = { '$regex': regexp, '$options': 'i' };
        }

        if(request.status && request.status.length != 0) {
            searchModel['status'] = { '$in': request.status };
        }

        const response: SearchOrganizersRepoResponse = new SearchOrganizersRepoResponse();
      
        let sortField = '_id';
        if(request.sortField){
            sortField = request.sortField;
        }

        let sortOrder = SortOrder.DESCEND;
        if(request.sortOrder){
            sortOrder = request.sortOrder;
        }

        pipeline.push({
            '$match': searchModel
        });
        
        response.organizers = await model.aggregate(pipeline)
            .sort({ [sortField]: sortOrder})
            .skip((request.page - 1) * request.limit)
            .limit(request.limit)
            .exec();

        pipeline.push({
            '$count' : 'totalOrganizers'
        });

        const count = await model.aggregate(pipeline).exec();
        response.totalRecords = count[0] ? count[0]['totalOrganizers'] : 0;;
        response.totalPages = Math.ceil(response.totalRecords / request.limit);
       
        return response;
    }

    public async getOrganizerById(id: string): Promise<IOrganizerValue> {
        const result: JSON = await this.findById(id);
        
        if (result) {
            return (result as unknown) as IOrganizerValue;
        }

        return null; 
    }

    public async getTotalActiveOrganizers(): Promise<number> {
        const model: Model<OrganizerDbObject> = this.getModel();

        const count = await model.countDocuments({status: OrganizerStatus.Active});
        return count;
    }

}
