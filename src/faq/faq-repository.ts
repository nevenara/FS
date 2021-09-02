import { EntityType } from "../db/entity-type";
import { IMongoRepository, MongoRepository } from "../db/mongo-repository";
import { QueryObject } from "../db/query/query-object";
import { FAQDbObject } from "./faq-db-object";
import { IFAQValue } from "./faq-value";

export interface IFAQRepository extends IMongoRepository<FAQDbObject> {
    getFAQsByCategory(): Promise<any>;
    getFAQById(id: string): Promise<IFAQValue>;
}

export class FAQRepository extends MongoRepository<FAQDbObject> implements IFAQRepository {
    constructor(){
        super(EntityType.FAQ);
    }

    public async getFAQsByCategory(): Promise<any> {
        let model = this.getModel();

        let results: JSON[] = await model.aggregate(
            [

                {
                    '$group': {
                        _id: {category: '$category'},
                        FAQsByCategory: {
                          $push: {
                              'id':'$_id',
                              'question':'$question',
                              'answer':'$answer',
                              'likes': '$likes',
                              'dislikes': '$dislikes',
                              'lastUpdate': '$lastUpdate'
                          }
                        }
                      }
                },
                {
                    '$sort': {
                        '_id.category': -1
                    }
                }

            ]
        );

        if(results && results.length > 0){
            return results;
        }

        return null;
    }

    public async getFAQById(id: string): Promise<IFAQValue> {
        const query = new QueryObject(new FAQDbObject());
        query.addSelectOption({field: FAQDbObject.FAQIdFieldName, value: id });

        const result: JSON = await this.findById(id);

        if (result) {
            return (result as unknown) as IFAQValue;
        }

        return null;    
    }
}