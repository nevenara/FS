import { ResolvedTypeReferenceDirectiveWithFailedLookupLocations } from "typescript";
import { EntityType } from "../db/entity-type";
import { IMongoRepository, MongoRepository } from "../db/mongo-repository";
import { QueryObject } from "../db/query/query-object";
import { GetTicketPlaceholderImagesResponse } from "../tickets/model/get-ticket-placeholder-images-response";
import { TicketPlaceholderImageDbObject } from "./ticket-placeholder-image-db-object";
import { ITicketPlaceholderImageValue } from "./ticket-placeholder-image-value";

export interface ITicketPlaceholderImageRepository extends IMongoRepository<TicketPlaceholderImageDbObject>{
    getImageByTicketId(_id: string): Promise<ITicketPlaceholderImageValue>;
    getImagesByTicketId(ticketId: string): Promise<Array<ITicketPlaceholderImageValue>>;

}

export class TicketPlaceholderImageRepository extends MongoRepository<TicketPlaceholderImageDbObject> implements ITicketPlaceholderImageRepository{
    constructor(){
        super(EntityType.TicketPlaceholderImage);
    }
    public async getImageByTicketId(_id: string): Promise<ITicketPlaceholderImageValue> {
        const images = await this.getImagesByTicketId(_id);
        return images[0];
    }

    public async getImagesByTicketId(ticketId: string): Promise<ITicketPlaceholderImageValue[]> {
        let placeholders = [];
        const query = new QueryObject(new TicketPlaceholderImageDbObject());
        query.addSelectOption({field: TicketPlaceholderImageDbObject.TicketIdFieldName, value: ticketId });

        const results: JSON[] = await this.find(query);

        if(results && results.length > 0){
            results.forEach(r => {
                placeholders.push((r as unknown) as ITicketPlaceholderImageValue);
            });
        }

        return placeholders;
    }


}