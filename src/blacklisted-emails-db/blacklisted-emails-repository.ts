import { IMongoRepository, MongoRepository } from "../db/mongo-repository";
import { BlacklistedEmailsDbObject } from "./blacklisted-emails-db-object";
import { EntityType } from "../db/entity-type";
import { IBlacklistedEmailsValue } from "./blacklisted-emails-value";
import { QueryObject } from "../db/query/query-object";

export interface IBlacklistedEmailsRepository extends IMongoRepository<BlacklistedEmailsDbObject> {
    getAll(): Promise<Array<IBlacklistedEmailsValue>>;
    getBlacklistedEmailByDomain(domain: string): Promise<IBlacklistedEmailsValue>;
}

export class BlacklistedEmailsRepository extends MongoRepository<BlacklistedEmailsDbObject>  implements IBlacklistedEmailsRepository {
    constructor() {
        super(EntityType.BlacklistedEmails);
    }

    public async getAll(): Promise<Array<IBlacklistedEmailsValue>> {
        const query = new QueryObject(new BlacklistedEmailsDbObject());
        
        const emails: JSON[] = await this.find(query);

        let response = [];

        emails.forEach(email => {
            let result = (email as unknown) as IBlacklistedEmailsValue;
            response.push(result);
        });

        return response;
    }

    public async getBlacklistedEmailByDomain(domain: string): Promise<IBlacklistedEmailsValue> {
        const query = new QueryObject(new BlacklistedEmailsDbObject());
        query.addSelectOption({field: BlacklistedEmailsDbObject.DomainFieldName, value: domain });

        const results: JSON[] = await this.find(query);

        if(results && results.length > 0){
            const user = (results[0] as unknown) as IBlacklistedEmailsValue
            return user;
        }

        return null;
    }
}