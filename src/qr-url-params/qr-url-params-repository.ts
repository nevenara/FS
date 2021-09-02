import { EntityType } from "../db/entity-type";
import { IMongoRepository, MongoRepository } from "../db/mongo-repository";
import { QueryObject } from "../db/query/query-object";
import { QRUrlParamsDbObject } from "./qr-url-params-db-object";
import { IQRUrlParamsValue } from "./qr-url-params-value";

export interface IQRUrlParamsRepository extends IMongoRepository<QRUrlParamsDbObject> {
    getUrlParamsById(id: string): Promise<IQRUrlParamsValue>;
}

export class QRUrlParamsRepository extends MongoRepository<QRUrlParamsDbObject> implements IQRUrlParamsRepository {
    constructor(){
        super(EntityType.QRUrlParams);
    }


    public async getUrlParamsById(id: string): Promise<IQRUrlParamsValue> {

        const result: JSON = await this.findById(id);

        if (result) {
            return (result as unknown) as IQRUrlParamsValue;
        }

        return null;   
    }
}