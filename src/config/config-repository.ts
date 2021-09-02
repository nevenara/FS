import { EntityType } from "../db/entity-type";
import { IMongoRepository, MongoRepository } from "../db/mongo-repository";
import { QueryObject } from "../db/query/query-object";
import { ConfigDbObject } from "./config-db-object";
import { IConfigValue } from "./config-value";

export interface IConfigRepository extends IMongoRepository<ConfigDbObject> {
    getConfigs(): Promise<IConfigValue>;
}

export class ConfigRepository extends MongoRepository<ConfigDbObject> implements IConfigRepository {
    constructor() {
        super(EntityType.Config);
    }

    public async getConfigs(): Promise<IConfigValue> {
        const query = new QueryObject(new ConfigDbObject());
        
        const configs: JSON[] = await this.find(query);

        if (configs && configs.length > 0) {
            return (configs[0] as unknown) as IConfigValue;
        }

        return null;
    }
}