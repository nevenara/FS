import { EntityType } from "../db/entity-type";
import { IMongoRepository, MongoRepository } from "../db/mongo-repository";
import { GetTicketsCountForCustomTimePeriodRepoRequest } from "./models/get-tickets-count-for-custom-time-period-repo-request";
import { TicketTransactionDbObject } from "./ticket-transaction-db-object";
import { Model } from "mongoose";
import moment = require("moment");
import { TicketTransactionType } from "../models/ticket-transaction-type";
import { ReportResultMatchType } from "../admin/dashboard/models/report-result-match-type";
import { GetChangeHistoryRequest } from "../tickets/model/get-change-history-request";
import { SortOrder } from "../db/query/sort-option";
import { GetChangeHistoryResponse } from "../tickets/model/get-change-history-response";
import * as mongoose from "mongoose";
import { GetChangeHistoryRepoResponse } from "../tickets/model/get-change-history-repo-response";

export interface ITicketTransactionRepository extends IMongoRepository<TicketTransactionDbObject> {
    getChangeHistory(request: GetChangeHistoryRequest): Promise<GetChangeHistoryResponse>;
    getTicketsCountForCustomTimePeriod(request: GetTicketsCountForCustomTimePeriodRepoRequest): Promise<number>;
    getIncomingTicektsVsPersonalizedTicketsGroupedPerYear(current: ReportResultMatchType, organizerId: string): Promise<any>;
    getIncomingTicketsGroupedPerMonthAndOrganizer(current: ReportResultMatchType): Promise<any>;
}

export class TicketTransactionRepository extends MongoRepository<TicketTransactionDbObject> implements ITicketTransactionRepository {
    constructor(){
        super(EntityType.TicketTransaction);
    }
    public async getChangeHistory(request: GetChangeHistoryRequest): Promise<GetChangeHistoryResponse> {
        const model: Model<TicketTransactionDbObject> = this.getModel();
        const pipeline = [];

        //transactions for ticketid
        pipeline.push({
            '$match': {
                ticketId: new mongoose.Types.ObjectId(request.ticketId)
            }
        });

        //original value
        pipeline.push({
            '$lookup': {
                from: 'users',
                localField: 'previousOwner',
                foreignField: '_id',
                as: 'originalValue'
            }
        });

        //new value
        pipeline.push({
            '$lookup': {
                from: 'users',
                localField: 'newOwner',
                foreignField: '_id',
                as: 'newValue'
            }
        });

        //editor 
        pipeline.push({
            '$lookup': {
                from: 'users',
                localField: 'createdBy',
                foreignField: '_id',
                as: 'editor'
            }
        });


        pipeline.push({
            '$unwind': {
                path: '$originalValue',
                preserveNullAndEmptyArrays: true
            }
        });

        pipeline.push({
            '$unwind': {
                path: '$newValue',
                preserveNullAndEmptyArrays: true
            }
        });

        pipeline.push({
            '$unwind': {
                path: '$editor',
                preserveNullAndEmptyArrays: true
            }
        });

         //Getting all necessary fields
         pipeline.push({
            '$project': {
                editor: '$editor',
                date: '$createdOn',
                nochange: { '$eq': ['$previousOwner', '$newOwner'] },
                originalValue: { $concat: ['$originalValue.firstname', ' ', '$originalValue.lastname'] },
                newValue: { $concat: ['$newValue.firstname', ' ', '$newValue.lastname'] }
            }
        });

        pipeline.push({
            '$match': {
                nochange: false,
            }
        });

        let sortField = '_id';
        let sortOrder = SortOrder.DESCEND;

        let results: JSON[] = await model.aggregate(pipeline)
            //custom sort
            .sort({ [sortField]: sortOrder })
            .skip((request.page - 1) * request.limit)
            .limit(request.limit)
            .exec();

            const response: GetChangeHistoryRepoResponse = new GetChangeHistoryRepoResponse();
            response.data = results;
    
            pipeline.push({
                '$count': 'totalTransactions'
            });
    
            const count = await model.aggregate(pipeline).exec();
            const totalRecords = count[0] ? count[0]['totalTransactions'] : 0;
            response.totalPages = Math.ceil(totalRecords / request.limit);
            response.totalRecords = totalRecords;
    
            return response;


    }

    public async getTicketsCountForCustomTimePeriod(request: GetTicketsCountForCustomTimePeriodRepoRequest): Promise<number> {
        const model: Model<TicketTransactionDbObject> = this.getModel();

        let condition = {};
        let createdOnCondition = {};
        let transactionTypeCondition = {};

        createdOnCondition['$lte'] = request.toDate;
        createdOnCondition['$gte'] = request.fromDate;

        transactionTypeCondition['$in'] = request.transactionType;
        
        condition['createdOn'] = createdOnCondition;
        condition['transactionType'] = transactionTypeCondition;
        condition['organizerId'] = request.organizerId;
    
        const count = await model.countDocuments(condition);
        return count;
    }

    public async getIncomingTicektsVsPersonalizedTicketsGroupedPerYear(current: ReportResultMatchType, organizerId: string): Promise<any> {
        let model = this.getModel();

        const pipeline = [];

        // If organizer logged in, take only tickets for that organizer
        if (organizerId) {
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
                '$match': {
                    'ticket.organizerId': new mongoose.Types.ObjectId(organizerId)
                }
            });

        }

        pipeline.push({
            '$project':{
                _id:0,
                year: {$year: "$createdOn"},
                incomingTicket: {
                    $cond: [
                        {
                            $eq: [ "$transactionType", TicketTransactionType.TicketCreatedFromExternalSystem ]}, 1, 0]
                        },
                personalizedTicket: {
                    $cond: [{$or: [
                        {
                            $eq: [ "$transactionType", TicketTransactionType.TicketPesonalized ]
                        },
                        {
                            $eq: [ "$transactionType", TicketTransactionType.TicketAssignedAndPersonalized ]
                        }
                    ]}, 1, 0]
                }
              }
        });

        if(current == ReportResultMatchType.PreviousYears) {
            //previous years
            pipeline.push({
                '$match':{
                    year: {$lt: moment().year()}
                  }
            });
        }
        else if(current == ReportResultMatchType.CurrentYear) {
            pipeline.push({
                '$match':{
                    year: {$eq: moment().year()}
                  }
            });
        }
        else if(current == ReportResultMatchType.PreviousYear){
            pipeline.push({
                '$match':{
                    year: {$eq: moment().year() - 1}
                  }
            });
        }


        pipeline.push({
            '$group': {
                _id: "$year",
                incomingTicketsCount: {
                    $sum: "$incomingTicket"
                },
                personalizedTicketsCount: {
                    $sum: "$personalizedTicket"
                }
              }
        });

        let results: JSON[] = await model.aggregate(pipeline);

        if(results && results.length > 0){
            return results;
        }

        return [];
    }

    public async getIncomingTicketsGroupedPerMonthAndOrganizer(current: ReportResultMatchType): Promise<any> {
        let model = this.getModel();
        
        const pipeline = [];

        //incoming tickets
        pipeline[0] = {
            '$match' : {
                transactionType: TicketTransactionType.TicketCreatedFromExternalSystem,
                
            }
        };

        //join tickets
        pipeline[1] = {
            '$lookup': {
                    from: 'tickets',
                    localField: 'ticketId',
                    foreignField: '_id',
                    as: 'ticket' //it'll be array
            }
            
        };

        //unwind ticket
        pipeline[2] = {
            '$unwind': {
                path: "$ticket"
            }
        };

        //join organizers
        pipeline[3] = {
            '$lookup': {
                from: 'organizers',
                localField: 'ticket.organizerId',
                foreignField: '_id',
                as: 'organizer'
            }
        };

        //organizer array to object
        pipeline[4] = {
            '$unwind': {
                path: "$organizer"
            }
        };

        //project
        pipeline[5] = {
            '$project': {
                year: {"$year": "$createdOn"},
                month: {"$month": "$createdOn"},
                organizerId: "$organizer._id",
                organizerName: "$organizer.companyName"
            }
        };
      
        if(current == ReportResultMatchType.CurrentMonth) {
            pipeline[6] = {
                '$match' : {
                    year: {$eq: moment().year()},
                    month: {$eq: moment().month() + 1}
                }
            };
        }
        else if(current == ReportResultMatchType.PreviousMonth){
            const prevMoment = moment().add(-1);
            pipeline[6] = {
                '$match' : {
                    year: {$eq: prevMoment.year()},
                    month: {$eq: prevMoment.month()}
                }
            };
        }
        else{
            pipeline[6] = {
                '$match' : {
                    $or: [
                        {year:{$ne: moment().year()}}, 
                        {month:{$ne: moment().month() + 1}}
                       ]
                }
            };
        }
        

         //and group
         pipeline[7] = {
            '$group': {
                _id: {
                    year:"$year",
                    month: "$month",
                    organizerId: "$organizerId",
                    organizerName: "$organizerName"
                },
                incomingTicketsCount: {
                    $sum: 1
                }
            }
        };

        let results: JSON[] = await model.aggregate(pipeline);

        if(results && results.length > 0){
            return results;
        }
        return [];
    }


}