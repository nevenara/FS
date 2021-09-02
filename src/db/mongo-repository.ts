import { DbObject } from "./db-object";
import { EntityType } from "./entity-type";
import {Model, Query} from "mongoose";
import { IBaseModel } from "./base-schema";
import { getModelFromFactory } from "./model-factory";
import { time } from "console";
import { QueryObject } from "./query/query-object";
const mongoose = require('mongoose');

export interface IMongoRepository<T extends DbObject>{
    create(item: DbObject): Promise<JSON>;
    updateObjectById(id: string, DbObject: Object): Promise<JSON>;
    deleteObjectById(id: string): Promise<JSON>;
}

export abstract class MongoRepository<T extends DbObject> implements IMongoRepository<T>{
    private Model: Model<IBaseModel>
   
    constructor(private entityType: EntityType){
        this.Model = getModelFromFactory(entityType);
    }

    public getModel(): Model<IBaseModel>{
        return this.Model;
    }

     /**
     * create new document and save to mongodb
     * @param item Mongoose Document
     * @param context
     * @returns document JSON format
     */
    public async create(item: DbObject): Promise<JSON> {
        this.setInsertContextData(item);

        const insertObj: any = item.getJSONDB();
        const result: IBaseModel = await this.Model.create([insertObj]);
        const resultJSON: any = result[0].toJSON();
        return resultJSON;
    }

    /**
     * update object by id
     * @param id _id(uuid string)
     * @param item set value of the object
     * @param context
     * @returns updated document in JSON format
     */
    public async updateObjectById(id: string, update: DbObject): Promise<JSON> {
        // this.setUpdateContextData(update);

        let result: any = await this.Model.findByIdAndUpdate(
            { _id: id },
            { $set: update.getJSONDB() },
            { new: true, upsert: true },
        ).lean();

        // result = this.(result);
        return result;
    }

    /**
     * delete object by id
     * @param id 
     * @returns delete status
     */
    public async deleteObjectById(id: string): Promise<JSON> {
        let result: any = await this.Model.deleteOne(
            { _id: id }
        ).lean();

        return result;
    }

    /**
     * Filter documents by matched condition
     * @param match mongoose document
     * @param context
     * @param queryParams
     * @returns documents in JSON format
     */
    public async filter(condition: QueryObject, queryParams: any): Promise<JSON[]> {
        const sortDocument: any = this.getSortDocument(queryParams);
        const locale = "en_US";
        const aPipeline: any = [{ $match: condition.getQueryObj4MongoDb() }];
        if (sortDocument) {
            aPipeline.push({ $sort: sortDocument });
        }

        if (queryParams) {
            aPipeline.push(
                { $skip: parseInt(queryParams.$skip || 0, 10) },
                { $limit: parseInt(queryParams.$top || 25, 10) },
            );
        }
        let result: any[] = await this.Model.aggregate(aPipeline)
            .collation({ locale, strength: 2 })
            .exec();
        result = this.fromLeanToJSON(result); // use toJSON to run getters and setters
        return result;
    }

    private fromLeanToJSON(result: any): any {
        if (result) {
            if (Array.isArray(result)) {
                result = result.map((r) => new this.Model(r).toJSON());
            } else {
                result = new this.Model(result).toJSON();
            }
        }
        return result;
    }

    /**
     * find documents by id
     * @param id 
     * @returns document in JSON format
     */
    public async findById(id: string): Promise<JSON> {
        let result = await this.Model.findById(id).lean();
        result = this.fromLeanToJSON(result);
        return result;
    }

    /**
     * find documents by condtion
     * @param condition Mongoose document
     * @param context
     * @param queryParams
     * @returns documents in JSON format
     */
    public async find(condition: QueryObject, queryParams?: any): Promise<JSON[]> {
        if (queryParams) {
            return this.filter(condition, queryParams);
        }
        let result: any[] = await this.Model.find(condition.getQueryObj4MongoDb())
            .lean();

        result = this.fromLeanToJSON(result); // use toJSON to run getters and setters
        return result;
    }

    /**
     * Sort documents
     * @param queryParams sorting parameters
     * */
    public getSortDocument(queryParams: any): any {
        let sortDocument: any;
        if (queryParams && queryParams.$orderby) {
            sortDocument = {};
            const aSortOptions: any = queryParams.$orderby.split(" ");
            const field: string = aSortOptions[0];
            const value: number = aSortOptions[1] === "asc" ? 1 : -1;
            sortDocument[field] = value;
        }
        return sortDocument;
    }

    private setInsertContextData(item: DbObject) {        
        item.id = new mongoose.Types.ObjectId();
    }
}