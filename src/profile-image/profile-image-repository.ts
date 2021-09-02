import { MongoRepository, IMongoRepository } from "../db/mongo-repository";
import { ProfileImageDbObject } from "./profile-image-db-object";
import { EntityType } from "../db/entity-type";
import { QueryObject } from "../db/query/query-object";
import { IProfileImageValue } from "./profile-image-value";

export interface IProfileImageRepository extends IMongoRepository<ProfileImageDbObject>{
    getProfileImageByUserId(userId:string):Promise<IProfileImageValue>;
    getDefaultProfileImage(): Promise<IProfileImageValue>;
}

export class ProfileImageRepository extends MongoRepository<ProfileImageDbObject> implements IProfileImageRepository{
    constructor(){
        super(EntityType.ProfileImage);
    }

    public async getProfileImageByUserId(userId: string): Promise<IProfileImageValue> {
        const query = new QueryObject(new ProfileImageDbObject());
        query.addSelectOption({field: ProfileImageDbObject.UserIdFieldName, value: userId });

        const results: JSON[] = await this.find(query);

        if(results && results.length > 0){
            const profileImage = (results[0] as unknown) as IProfileImageValue
            return profileImage;
        }

        return null;
    }

    public async getDefaultProfileImage(): Promise<IProfileImageValue> {
        const query = new QueryObject(new ProfileImageDbObject());
        query.addSelectOption({field: ProfileImageDbObject.IsDefaultImageFieldName, value: 'true' });

        const results: JSON[] = await this.find(query);

        if(results && results.length == 1){
            const profileImage = (results[0] as unknown) as IProfileImageValue;
  
            if (!profileImage.userId) {
                return profileImage;
            }
        }

        return null;
    }
}
