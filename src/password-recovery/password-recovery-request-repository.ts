import { EntityType } from "../db/entity-type";
import { IMongoRepository, MongoRepository } from "../db/mongo-repository";
import { QueryObject } from "../db/query/query-object";
import { PasswordRecoveryRequestDbObject } from "./password-recovery-request-db-object";
import { IPasswordRecoveryRequestValue } from "./password-recovery-request-value";

export interface IPasswordRecoveryRequestRepository extends IMongoRepository<PasswordRecoveryRequestDbObject>{
    getPasswordRecoveryRequestByUuid(uuid: string): Promise<IPasswordRecoveryRequestValue>;

}

export class PasswordRecoveryRequestRepository extends MongoRepository<PasswordRecoveryRequestDbObject> implements IPasswordRecoveryRequestRepository{
    constructor(){
        super(EntityType.PasswordRecoveryRequests);
    }

    public async getPasswordRecoveryRequestByUuid(uuid: string): Promise<IPasswordRecoveryRequestValue> {
        const query = new QueryObject(new PasswordRecoveryRequestDbObject());
        query.addSelectOption({field: PasswordRecoveryRequestDbObject.Uuid, value: uuid });

        const results: JSON[] = await this.find(query);

        if(results && results.length > 0){
            const passwordRecoveryRequest = (results[0] as unknown) as IPasswordRecoveryRequestValue
            return passwordRecoveryRequest;
        }

        return null;
    }
}