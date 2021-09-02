import { MongoRepository, IMongoRepository } from "../db/mongo-repository";
import { UserDbObject } from "./user-db-object";
import { EntityType } from "../db/entity-type";
import { QueryObject } from "../db/query/query-object";
import { IUserValue } from "./user-value";
import { Model } from "mongoose";
import { getObjectIdFromString } from "../db/schema-util";
import { UserStatus } from "../models/user-status";
import { SearchUsersAdminPanelRepoRequest as SearchUsersAdminPanelRepoRequest } from "../user-profile/models/search-users-admin-panel-repo-request";
import { SearchUsersAdminPanelRepoResponse } from "../user-profile/models/search-users-admin-panel-repo-response";
import { SearchAdminPanelUsersStatus } from "../user-profile/models/search-admin-panel-users-status";
import { UserActivityType } from "../models/user-activity-type";
import { SortOrder } from "../db/query/sort-option";
import { UserType } from "../models/user-type";
import { SearchUserManagementRequest } from "../admin/user-management/models/search-user-management-request";
import { SearchUserManagementResponse } from "../admin/user-management/models/search-user-management-response";
import { use } from "chai";
import { PossibleTicketHolder } from "../tickets/model/get-non-personalized-tickets-by-event-response";
import { SearchUsersRepoRequest } from "../user-profile/models/search-users-repo-request";
import { SearchUsersRepoResponse } from "../user-profile/models/search-users-repo-response";
import { text } from "express";

export interface IUserRepository extends IMongoRepository<UserDbObject> {
    searchByFirstnameAndLastname(firstname: string, lastname: string, notId: string): Promise<PossibleTicketHolder[]>;
    getUserByFirstAndLastName(firstName: string, lastName: string): Promise<IUserValue[]>;
    searchUserManagement(request: SearchUserManagementRequest): Promise<SearchUserManagementResponse>;
    getUserByOrganizerId(id: string): Promise<IUserValue>;
    getTotalUsersVerifiedInclBankAccount(): Promise<number>;
    getByStripeAccountId(stripeAccountId: string): Promise<IUserValue>;
    getUserByUserNameOrEmail(username: string): Promise<IUserValue>;
    getUserByEmailVerificationGuid(guid: string): Promise<IUserValue>;
    getUserById(id: string): Promise<IUserValue>;
    getUserByField(field: string, value: any): Promise<IUserValue>;
    getLinkedAccounts(id: string): Promise<Array<IUserValue>>;
    getUserAndLinkedAccountsUsernames(id: string): Promise<IUserValue[]>;
    searchUsers(usernameOrEmail: string): Promise<IUserValue[]>;
    getTotalUsersRegistered(): Promise<number>;
    getTotalUsersVerified(): Promise<number>;
    getTotalLinkedAccountsUsers(): Promise<number>;
    getTotalMainAccountsWithLinkedAccounts(): Promise<number>;
    getTotalLinkedAccountsWithPassword(): Promise<number>;
    searchAdminPanel(request: SearchUsersAdminPanelRepoRequest): Promise<SearchUsersAdminPanelRepoResponse>;
    search(request: SearchUsersRepoRequest): Promise<SearchUsersRepoResponse>;
}

export class UserRepository extends MongoRepository<UserDbObject> implements IUserRepository {
    constructor() {
        super(EntityType.User);
    }  

    public async search(request: SearchUsersRepoRequest): Promise<SearchUsersRepoResponse> {
        const model: Model<UserDbObject> = this.getModel();
        const searchModel = {};

        if(request.accountType) {
            searchModel["usertype"] = { '$in': request.accountType };
        }

        if(request.usernameOrEmail && request.usernameOrEmail.trim() != "") {
            let regexp = new RegExp(request.usernameOrEmail);

            searchModel['$or'] =  [
                {email: {'$regex': regexp, '$options': 'i'}},
                {username: {'$regex': regexp, '$options': 'i'}},
            ];
        }

        const results = await model.find(searchModel);
        const response = new SearchUsersRepoResponse();
        response.users = results || [];
      

        return response;
    }
    
    public async searchByFirstnameAndLastname(firstname: string, lastname: string, notId: string): Promise<PossibleTicketHolder[]> {
        const model: Model<UserDbObject> = this.getModel();
        const searchModel = {};
        
        
        searchModel['firstname'] = firstname;
        searchModel['lastname'] = lastname;

       /*  if(notId) {
            searchModel['_id'] = { '$ne': notId };
        } */
    
        const users = await model.find(searchModel);

        const usernamesAndEmails: PossibleTicketHolder[] = [];

        users.forEach(u => {
            const user = new PossibleTicketHolder();
            user.userId = u._id;
            user.usernameAndEmail = u.email && u.username ? u.username + ' (' + u.email + ')' :
                                    !u.email ? u.username : null;
            if(user.usernameAndEmail)
                usernamesAndEmails.push(user);
        });
        
        return usernamesAndEmails;
    }
    
    public async getUserByFirstAndLastName(firstName: string, lastName: string): Promise<IUserValue[]> {
        const model: Model<UserDbObject> = this.getModel();

        const user = await model.find({'firstname': firstName, 'lastname': lastName});

        return user;
    }

    public async searchUserManagement(request: SearchUserManagementRequest): Promise<SearchUserManagementResponse> {
        const model: Model<UserDbObject> = this.getModel();
        const pipeline = [];

        //last login from sessionlogs
        pipeline.push({
            '$lookup': {
                from: 'sessionlogs',
                localField: '_id',
                foreignField: 'userId',
                as: 'logs'
            }
        });

        //only admins
        pipeline.push({
            '$match': {
                usertype: { '$in': [UserType.SuperAdmin, UserType.Admin, UserType.SupportLevel1, UserType.SupportLevel2, UserType.EventManager] },
                status: { '$not': {'$in': [UserStatus.Deleted]}} 
            }
        });

        //fields of interest
        pipeline.push({
            '$project': {
                firstname: '$firstname',
                lastname: '$lastname',
                name:{ $concat:['$firstname', ' ', '$lastname']},
                email: '$email',
                permissions: '$usertype',
                lastLogin: {
                        $filter: {
                           input: "$logs",
                           cond: { $eq: ["$$this.startDate", { $max: "$logs.startDate" }] }
                        }
                     }
            }
        });

        pipeline.push({
            '$unwind': {
                path: '$lastLogin',
                preserveNullAndEmptyArrays: true
            }
        });

         //Filters
         const searchModel = {};
         
         if(request.textSearch && request.textSearch.trim() != "") {
            let regexp = new RegExp(request.textSearch);

            searchModel['$or'] =  [
                {email: {'$regex': regexp, '$options': 'i'}},
                {name: {'$regex': regexp, '$options': 'i'}},
            ];
        }

        if(request.permissions && request.permissions.length>0){
            searchModel['permissions'] = { '$in': request.permissions };

        }

        if (request.lastLoginFrom || request.lastLoginTo) {
            const dateFillter = {};

            if (request.lastLoginFrom) {
                dateFillter['$gte'] = new Date(request.lastLoginFrom);
            }

            if (request.lastLoginTo) {
                request.lastLoginTo = new Date(request.lastLoginTo);
                request.lastLoginTo.setHours(request.lastLoginTo.getHours() + 24);
                dateFillter['$lte'] = new Date(request.lastLoginTo);
            }

            searchModel['lastLogin.startDate'] = dateFillter;
        }

         //Filters are set
         if(Object.keys(searchModel).length != 0) {
            pipeline.push({
                '$match': searchModel
            });
        }

        pipeline.push({
            '$project': {
                _id: false,
                userId: '$_id',
                name: '$name',
                firstname: '$firstname',
                lastname: '$lastname',
                email: '$email',
                permissions: '$permissions',
                lastLogin: '$lastLogin.startDate'
            }
        });

        console.log(searchModel)
         //Sort
         let sortField = '_id';
         if(request.sortField){
             sortField = request.sortField;
         }
 
         let sortOrder = SortOrder.DESCEND;
         if(request.sortOrder){
             sortOrder = request.sortOrder;
         }
 
         let results: JSON[] = await model.aggregate(pipeline)
                                          //custom sort
                                          .sort({ [sortField]: sortOrder})
                                          .skip((request.page - 1) * request.limit)
                                          .limit(request.limit)
                                          .exec();
 
 
         const response: SearchUserManagementResponse = new SearchUserManagementResponse();
         response.users = results;
         pipeline.push({
             '$count' : 'totalUsers'
         });
 
         const count = await model.aggregate(pipeline).exec();
         const totalRecords = count[0] ? count[0]['totalUsers'] : 0;
         response.totalPages = Math.ceil( totalRecords / request.limit);
         response.totalRecords = totalRecords;
         return response;

    }

    public async getUserByOrganizerId(id: string): Promise<IUserValue> {
        const model: Model<UserDbObject> = this.getModel();

        const res = await model.find({ organizerId: id });

        if (res && res.length > 0) {
            return (res[0] as unknown) as IUserValue;
        }
        return null;
    }

    public async getByStripeAccountId(stripeAccountId: string): Promise<IUserValue> {
        const model: Model<UserDbObject> = this.getModel();

        const res = await model.find({ stripeAccountId: stripeAccountId });

        if (res && res.length > 0) {
            return (res[0] as unknown) as IUserValue;
        }
        return null;
    }

    public async getUserByUserNameOrEmail(usernameOrEmail: string): Promise<IUserValue> {
        let model = this.getModel();
        let regexp = new RegExp(usernameOrEmail);

        let results: JSON[] = await model.find({
            $or:
                [
                    {
                        'username': usernameOrEmail
                    },
                    {
                        'email': {'$regex': regexp, '$options': 'i'}
                    }
                ]
        }).lean();

        if (results && results.length > 0) {
            const user = (results[0] as unknown) as IUserValue
            return user;
        }

        return null;
    }

    public async getUserByEmailVerificationGuid(guid: string): Promise<IUserValue> {

        const query = new QueryObject(new UserDbObject());
        query.addSelectOption({ field: UserDbObject.EmailVerificationGuidFieldName, value: guid });

        const results: JSON[] = await this.find(query);

        if (results && results.length > 0) {
            const user = (results[0] as unknown) as IUserValue
            return user;
        }

        return null;
    }

    public async getUserById(id: string): Promise<IUserValue> {
        const query = new QueryObject(new UserDbObject());
        query.addSelectOption({ field: UserDbObject.UserIdFieldName, value: id });

        const result: JSON = await this.findById(id);

        if (result) {
            return (result as unknown) as IUserValue;
        }

        return null;
    }

    public async getUserByField(field: string, value: any): Promise<IUserValue> {

        const query = new QueryObject(new UserDbObject());
        query.addSelectOption({ field: field, value: value });

        const results: JSON[] = await this.find(query);

        if (results && results.length > 0) {
            const user = (results[0] as unknown) as IUserValue
            return user;
        }

        return null;
    }

    public async getLinkedAccounts(id: string): Promise<Array<IUserValue>> {
        const query = new QueryObject(new UserDbObject());
        query.addSelectOption({ field: UserDbObject.MainAccountIdFieldName, value: id });

        const results: JSON[] = await this.find(query);

        if (results && results.length > 0) {
            const linkedAccounts = [];

            results.forEach(result => {
                linkedAccounts.push((result as unknown) as IUserValue);
            });

            return linkedAccounts;
        }

        return [];
    }

    public async getUserAndLinkedAccountsUsernames(id: string): Promise<IUserValue[]> {
        const query = new QueryObject(new UserDbObject());
        query.addSelectOption({ field: UserDbObject.MainAccountIdFieldName, value: id });

        const results: JSON[] = await this.find(query);

        const users = [];
        let mainUser = await this.getUserById(id);
        users.push(mainUser);
        
        if (results && results.length > 0) {
           

            results.forEach(result => {
                users.push((result as unknown) as IUserValue);
            });
        }

        return users;
    }

    public async searchUsers(usernameOrEmail: string): Promise<IUserValue[]> {
        let model = this.getModel();
        let regexp = new RegExp(usernameOrEmail);

        let results: JSON[] = await model.find({
            $or:
                [
                    {
                        'username': regexp
                    },
                    {
                        'email': {'$regex': regexp, '$options': 'i'}
                    }
                ],
            status: { '$not': {'$in': [UserStatus.Deleted]}} 
        }).lean();

        if (results && results.length > 0) {
            const users = [];

            results.forEach(result => {
                users.push((result as unknown) as IUserValue);
            });

            return users;
        }

        return null;

    }

    public async getTotalUsersRegistered(): Promise<number> {
        const model: Model<UserDbObject> = this.getModel();

        const count = await model.countDocuments({ 'status': UserStatus.RegistrationCompleted });

        return count;
    }

    public async getTotalUsersVerified(): Promise<number> {
        const model: Model<UserDbObject> = this.getModel();

        const count = await model.countDocuments({ 'status': UserStatus.IdVerified });

        return count;
    }

    public async getTotalUsersVerifiedInclBankAccount(): Promise<number> {
        const model: Model<UserDbObject> = this.getModel();

        const count = await model.countDocuments({ 'status': UserStatus.IdVerified, 'bankAccountId' : { $exists: true, $ne: null } });

        return count;
    }

    public async getTotalLinkedAccountsUsers(): Promise<number> {
        const model: Model<UserDbObject> = this.getModel();

        const count = await model.countDocuments({ mainAccountId: { $ne: null } });
        return count;
    }

    public async getTotalMainAccountsWithLinkedAccounts(): Promise<number> {
        const model: Model<UserDbObject> = this.getModel();

        const linkedAccounts = await model.find({ mainAccountId: { $ne: null } });
        let mainAccounts = [];
        for (let i = 0; i < linkedAccounts.length; i++) {
            const t = linkedAccounts[i] as IUserValue;

            if (mainAccounts.indexOf(t.mainAccountId) === -1) {
                mainAccounts.push(t.mainAccountId);
            }
        }

        return mainAccounts.length;
    }

    public async getTotalLinkedAccountsWithPassword(): Promise<number> {
        const model: Model<UserDbObject> = this.getModel();

        const count = await model.countDocuments({ mainAccountId: { $ne: null }, password: { $ne: null } });
        return count;
    }

    public async searchAdminPanel(request: SearchUsersAdminPanelRepoRequest): Promise<SearchUsersAdminPanelRepoResponse> {
        const model: Model<UserDbObject> = this.getModel();
        const pipeline = [];

        /** For fields:
         * Reason For Inactivity (details in our collection)
         * Verification date From - To
         * SignUp date From - To
         * 
         * We have to $lookup in user activity logs
         */

        pipeline.push({
            '$lookup': {
                from: 'useractivitylogs',
                localField: '_id',
                foreignField: 'userId',
                as: 'logs'
            }
        });

        //Only main and linked accounts
        pipeline.push({
            '$match': {
                usertype: { '$in': [UserType.MainAccount, UserType.LinkedAccount] },
                status: { '$not': {'$in': [UserStatus.Deleted]}} 
            }
        });

        //Getting all necessary fields
        pipeline.push({
            '$project': {
                username: '$username',
                email: '$email',
                firstname: '$firstname',
                lastname: '$lastname',
                usertype: '$usertype',
                status: '$status',
                bankAccountId: '$bankAccountId',
                
                 signUpPerformed: {
                      $filter: {input: '$logs', as: 'log', cond: {$eq: ['$$log.activityType', UserActivityType.RegistrationCompleted]}}
                },
                
                verificationPerformed: {
                      $filter: {input: '$logs', as: 'log', cond: {$eq: ['$$log.activityType', UserActivityType.IdVerified]}}
                },
                
                blockingPerformed: {
                     $filter: {input: '$logs', as: 'log', cond: { $and: [{$eq: ['$$log.activityType', UserActivityType.Blocked]}, 
                     { $eq: ["$$log.date", { $max: "$logs.date" }] }]}}
                }
              
              }
        });

        //Transform array fields to objects
        pipeline.push({
            '$unwind': {
                path: '$signUpPerformed',
                preserveNullAndEmptyArrays: true
            }
        });

        pipeline.push({
            '$unwind': {
                path: '$verificationPerformed',
                preserveNullAndEmptyArrays: true
            }
        });

        pipeline.push({
            '$unwind': {
                path: '$blockingPerformed',
                preserveNullAndEmptyArrays: true
            }
        });

        //Filters
        const searchModel = {};
        const textSearchFilter= {};
        if(request.textSearch && request.textSearch.trim() != "") {
            let regexp = new RegExp(request.textSearch);

            textSearchFilter['$or'] = [
                {username: {'$regex': regexp, '$options': 'i'}},
                {email: {'$regex': regexp, '$options': 'i'}},
                {firstname: {'$regex': regexp, '$options': 'i'}},
                {lastname: {'$regex': regexp, '$options': 'i'}}
            ];
        }

        const verifiedInclBankAccountFilter = {};
        if(request.verifiedInclBankAccount) {
            verifiedInclBankAccountFilter['$and'] =  [ {bankAccountId: {$exists: true}}, {bankAccountId: {$ne: null}} ];
         }

        const verifiedFilter = {};
        if(request.verified){
            verifiedFilter['$or'] = [{bankAccountId: {$exists: false}}, {bankAccountId: {$eq: null}}];
        }

        searchModel['$and'] = [];

        const verifiedBothFilter = {};
        verifiedBothFilter['$or'] = [];

        if (Object.keys(verifiedInclBankAccountFilter).length != 0) {
            verifiedBothFilter['$or'].push(verifiedInclBankAccountFilter);
        }

        if (Object.keys(verifiedFilter).length != 0) {
            verifiedBothFilter['$or'].push(verifiedFilter);
        }

        if (Object.keys(textSearchFilter).length != 0) {
            searchModel['$and'].push(textSearchFilter);
        }

        if (verifiedBothFilter['$or'].length != 0) {
            searchModel['$and'].push(verifiedBothFilter);
        }

        if(searchModel['$and'].length == 0) {
            delete searchModel['$and'];
        }

        if(request.status && request.status.length != 0) {
            searchModel['status'] = { '$in': request.status };
        }

        if(request.accountType && request.accountType.length != 0) {
            searchModel['usertype'] = { '$in': request.accountType };
        }

        if (request.verificationDateFrom || request.verificationDateTo) {
            const dateFillter = {};

            if (request.verificationDateFrom) {
                dateFillter['$gte'] = request.verificationDateFrom;
            }

            if (request.verificationDateTo) {
                request.verificationDateTo = new Date(request.verificationDateTo);
                request.verificationDateTo.setHours(request.verificationDateTo.getHours() + 24);
               
                dateFillter['$lte'] = request.verificationDateTo;
            }

            searchModel['verificationPerformed.date'] = dateFillter;
        }

        if (request.signUpDateFrom || request.signUpDateTo) {
            const dateFillter = {};

            if (request.signUpDateFrom) {
                dateFillter['$gte'] = request.signUpDateFrom;
            }

            if (request.signUpDateTo) {
                request.signUpDateTo = new Date(request.signUpDateTo);
                request.signUpDateTo.setHours(request.signUpDateTo.getHours() + 24);
               
                dateFillter['$lte'] = request.signUpDateTo;
            }

            searchModel['signUpPerformed.date'] = dateFillter;
        }

        if(request.reasonForInactivity && request.reasonForInactivity.length != 0) {
            searchModel['blockingPerformed.details'] = { '$in': request.reasonForInactivity };
        }
        
        //Filters are set
        if(Object.keys(searchModel).length != 0) {
            pipeline.push({
                '$match': searchModel
            });
        }

        //another project to get fields same as needed for sort
        pipeline.push({
            '$project': {
                username: '$username',
                email: '$email',
                firstname: '$firstname',
                lastname: '$lastname',
                mainAccount: {
                    $cond: [{$eq:["$usertype", UserType.MainAccount]}, 'Yes', 'No']
                },
                status: '$status',
                verificationDate: '$verificationPerformed.date',
                signUpDate: '$signUpPerformed.date',
                reasonForInactivity:'$blockingPerformed.details',
                bankAccountId: '$bankAccountId'
            }
        });

        //Sort
        let sortField = '_id';
        if(request.sortField){
            sortField = request.sortField;
        }

        let sortOrder = SortOrder.DESCEND;
        if(request.sortOrder){
            sortOrder = request.sortOrder;
        }

        let results: JSON[] = await model.aggregate(pipeline)
                                         //custom sort
                                         .sort({ [sortField]: sortOrder})
                                         .skip((request.page - 1) * request.limit)
                                         .limit(request.limit)
                                         .exec();


        const response: SearchUsersAdminPanelRepoResponse = new SearchUsersAdminPanelRepoResponse();
        response.users = results;

        pipeline.push({
            '$count' : 'totalUsers'
        });

        const count = await model.aggregate(pipeline).exec();
        const totalRecords = count[0] ? count[0]['totalUsers'] : 0;
        response.totalPages = Math.ceil( totalRecords / request.limit);
        response.totalRecords = totalRecords;
        return response;
    }


}
