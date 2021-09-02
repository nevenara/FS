import { EntityType } from "../db/entity-type";
import { IMongoRepository, MongoRepository } from "../db/mongo-repository";
import { QueryObject } from "../db/query/query-object";
import { SelfieImageDbObject } from "./selfie-image-db-object";
import { ISelfieImageValue } from "./selfie-image-value";

export interface ISelfieImageRepository extends IMongoRepository<SelfieImageDbObject> {
    getSelfieImageByUserId(userId: string): Promise<ISelfieImageValue>;
}

export class SelfieImageRepository extends MongoRepository<SelfieImageDbObject> implements ISelfieImageRepository {
    constructor() {
        super(EntityType.SelfieImage);
    }

    public async getSelfieImageByUserId(userId: string): Promise<ISelfieImageValue> {
        const query = new QueryObject(new SelfieImageDbObject());
        query.addSelectOption({ field: "userId", value: userId });

        const results: JSON[] = await this.find(query);

        if (results && results.length > 0) {
            const profileImage = (results[0] as unknown) as ISelfieImageValue
            return profileImage;
        }

        return null;
    }
}