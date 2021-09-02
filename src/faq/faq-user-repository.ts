import { EntityType } from "../db/entity-type";
import { IMongoRepository, MongoRepository } from "../db/mongo-repository";
import { QueryObject } from "../db/query/query-object";
import { FAQUserDbObject } from "./faq-user-db-object";
import { IFAQUserValue } from "./faq-user-value";

export interface IFAQUserRepository extends IMongoRepository<FAQUserDbObject> {
    getUserActionByFAQIdAndUserId(userId: string, faqId: string): Promise<IFAQUserValue>;
}

export class FAQUSerRepository extends MongoRepository<FAQUserDbObject> implements IFAQUserRepository {
    constructor(){
        super(EntityType.FAQUser);
    }


    public async getUserActionByFAQIdAndUserId(userId: string, faqId: string): Promise<IFAQUserValue> {
        let query = {
            'userId': userId,
            'faqId': faqId
        }

        const results: JSON[] = await this.getModel().find(query);

        if (results && results.length > 0) {

            return (results[0] as unknown) as IFAQUserValue;
        }

        return null;   
    }
}