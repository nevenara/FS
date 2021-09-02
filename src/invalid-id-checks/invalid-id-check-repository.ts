import { EntityType } from "../db/entity-type";
import { IMongoRepository, MongoRepository } from "../db/mongo-repository";
import { InvalidIdCheckDbObject } from "./invalid-id-check-db-object";

export interface IInvalidIdCheckRepository extends IMongoRepository<InvalidIdCheckDbObject> {
}

export class InvalidIdCheckRepository extends MongoRepository<InvalidIdCheckDbObject> implements IInvalidIdCheckRepository {
    constructor(){
        super(EntityType.InvalidIdCheck);
    }
}