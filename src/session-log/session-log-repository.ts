import { EntityType } from "../db/entity-type";
import { IMongoRepository, MongoRepository } from "../db/mongo-repository";
import { QueryObject } from "../db/query/query-object";
import { UserDbObject } from "../user/user-db-object";
import { SessionLogDbObject } from "./session-log-db-object";
import { ISessionLogValue } from "./session-log-value";

export interface ISessionLogRepository extends IMongoRepository<SessionLogDbObject> {
    getSessionBySessionId(sessionId: string): Promise<ISessionLogValue>;
}

export class SessionLogRepository extends MongoRepository<SessionLogDbObject> implements ISessionLogRepository {
    constructor() {
        super(EntityType.SessionLog);
    }

    public async getSessionBySessionId(sessionId: string): Promise<ISessionLogValue> {
        const query = new QueryObject(new SessionLogDbObject());
        query.addSelectOption({ field: SessionLogDbObject.SessionIdFieldName, value: sessionId });

        const result: JSON[] = await this.find(query);

        if (result && result.length) {
            return (result[0] as unknown) as ISessionLogValue;
        }

        return null;
    }
}