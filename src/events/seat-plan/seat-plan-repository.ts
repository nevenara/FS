import { EntityType } from "../../db/entity-type";
import { IMongoRepository, MongoRepository } from "../../db/mongo-repository";
import { QueryObject } from "../../db/query/query-object";
import { SeatPlanDbObject } from "./seat-plan-db-object";
import { ISeatPlanValue } from "./seat-plan-value";

export interface ISeatPlanRepository extends IMongoRepository<SeatPlanDbObject> {
    getSeatPlanByEventId(eventId: string): Promise<ISeatPlanValue>;

}


export class SeatPlanRepository extends MongoRepository<SeatPlanDbObject> implements ISeatPlanRepository {
    constructor() {
        super(EntityType.SeatPlan);
    }
    
    public async getSeatPlanByEventId(eventId: string): Promise<ISeatPlanValue> {
        const query = new QueryObject(new SeatPlanDbObject());
        query.addSelectOption({field: 'eventId', value: eventId });

        const results: JSON[] = await this.find(query);

        if(results && results.length > 0){
            const profileImage = (results[0] as unknown) as ISeatPlanValue
            return profileImage;
        }

        return null;
    }
}