import { MongoRepository, IMongoRepository } from "../db/mongo-repository";
import { EntityType } from "../db/entity-type";
import { QueryObject } from "../db/query/query-object";
import { OrganizerPlaceholderImageDbObject } from "./organizer-placeholder-image-db-object";
import { IOrganizerPlaceholderImageValue } from "./organizer-placeholder-image-value";

export interface IOrganizerPlaceholderImageRepository extends IMongoRepository<OrganizerPlaceholderImageDbObject>{
    getDefaultProfileImage(): Promise<IOrganizerPlaceholderImageValue>;
    getImageByOrganizerId(organizerId:string):Promise<IOrganizerPlaceholderImageValue>;
}

export class OrganizerPlaceholderImageRepository extends MongoRepository<OrganizerPlaceholderImageDbObject> implements IOrganizerPlaceholderImageRepository{
    constructor(){
        super(EntityType.OrganizerPlaceholderImage);
    }
    
    public async getDefaultProfileImage(): Promise<IOrganizerPlaceholderImageValue> {
        const query = new QueryObject(new OrganizerPlaceholderImageDbObject());
        query.addSelectOption({field: OrganizerPlaceholderImageDbObject.IsDefaultImageFieldName, value: 'true' });

        const results: JSON[] = await this.find(query);

        if(results && results.length == 1){
            const image = (results[0] as unknown) as IOrganizerPlaceholderImageValue;
  
            if (!image.organizerId) {
                return image;
            }
        }

        return null;
    }

    public async getImageByOrganizerId(organizerId: string): Promise<IOrganizerPlaceholderImageValue> {
        const query = new QueryObject(new OrganizerPlaceholderImageDbObject());
        query.addSelectOption({field: OrganizerPlaceholderImageDbObject.OrganizerIdFieldName, value: organizerId });

        const results: JSON[] = await this.find(query);

        if(results && results.length > 0){
            const profileImage = (results[0] as unknown) as IOrganizerPlaceholderImageValue
            return profileImage;
        }

        return null;
    }

    
}
