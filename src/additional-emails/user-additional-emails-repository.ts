import { IMongoRepository, MongoRepository } from "../db/mongo-repository";
import { UserAdditionalEmailsDbObject } from "./user-additional-emails-db-object";
import { IUserAdditionalEmailsValue } from "./user-additional-emails-value";
import { EntityType } from "../db/entity-type";
import { QueryObject } from "../db/query/query-object";

export interface IUserAdditionalEmailsRepository extends IMongoRepository<UserAdditionalEmailsDbObject>{
    getAdditionalEmailsByUserId(userId:string):Promise<IUserAdditionalEmailsValue[]>;
    getAdditionalEmailByUuid(guid: string): Promise<IUserAdditionalEmailsValue>;
    getAdditionalEmailByUserIdAndEmail(userId: string, email: string): Promise<IUserAdditionalEmailsValue>;
    getAdditionalEmailByEmail(email: string): Promise<IUserAdditionalEmailsValue>;
}

export class UserAdditionalEmailsRepository extends MongoRepository<UserAdditionalEmailsDbObject> implements IUserAdditionalEmailsRepository{
    constructor(){
        super(EntityType.UserAdditionalEmails);
    }

    public async getAdditionalEmailsByUserId(userId: string): Promise<IUserAdditionalEmailsValue[]> {
        const query = new QueryObject(new UserAdditionalEmailsDbObject());
        query.addSelectOption({field: UserAdditionalEmailsDbObject.UserIdFieldName, value: userId });

        const results: JSON[] = await this.find(query);

        if(results && results.length > 0){
            const userEmails = [];

            results.forEach(result => {
                userEmails.push((result as unknown) as IUserAdditionalEmailsValue);
            });

            return userEmails;
        }

        return null;
    }

    public async getAdditionalEmailByUuid(guid: string): Promise<IUserAdditionalEmailsValue> {
        const query = new QueryObject(new UserAdditionalEmailsDbObject());
        query.addSelectOption({field: UserAdditionalEmailsDbObject.UuidFieldName, value: guid });

        const results: JSON[] = await this.find(query);

        if(results && results.length > 0){
            const userAdditionalEmail = (results[0] as unknown) as IUserAdditionalEmailsValue
            return userAdditionalEmail;
        }

        return null;
    }

    public async getAdditionalEmailByUserIdAndEmail(userId: string, email: string): Promise<IUserAdditionalEmailsValue> {
        const query = new QueryObject(new UserAdditionalEmailsDbObject());
        query.addSelectOption({field: UserAdditionalEmailsDbObject.UserIdFieldName, value: userId });
        query.addSelectOption({field: UserAdditionalEmailsDbObject.EmailFieldName, value: email });

        const results: JSON[] = await this.find(query);

        if(results && results.length > 0){
            const userAdditionalEmail = (results[0] as unknown) as IUserAdditionalEmailsValue
            return userAdditionalEmail;
        }

        return null;
    }

    public async getAdditionalEmailByEmail(email: string): Promise<IUserAdditionalEmailsValue> {
        const query = new QueryObject(new UserAdditionalEmailsDbObject());
        query.addSelectOption({field: UserAdditionalEmailsDbObject.EmailFieldName, value: email });

        const results: JSON[] = await this.find(query);

        if(results && results.length > 0){
            const userAdditionalEmail = (results[0] as unknown) as IUserAdditionalEmailsValue
            return userAdditionalEmail;
        }

        return null;
    }
}