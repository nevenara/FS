import { EntityType } from "../db/entity-type";
import { IMongoRepository, MongoRepository } from "../db/mongo-repository";
import { ShoppingCartDbModel } from "./model/shopping-cart-db-model";
import { IShoppingCartValue } from "./model/shopping-cart-value";

export interface IShoppingCartRepository extends IMongoRepository<ShoppingCartDbModel> {
    getById(id: string): Promise<IShoppingCartValue>;
    getByPaymentIntentId(paymentIntentId: string): Promise<IShoppingCartValue>;
}

export class ShoppingCartRepository extends MongoRepository<ShoppingCartDbModel> implements IShoppingCartRepository {
    constructor() {
        super(EntityType.ShoppingCart);
    }

    public async getByPaymentIntentId(paymentIntentId: string): Promise<IShoppingCartValue> {
        
        let result = await this.getModel().find({ paymentIntentId: paymentIntentId }).lean();

        if(result && result.length){
            return result[0] as IShoppingCartValue;
        }

        return null;
    }

    public async getById(id: string): Promise<IShoppingCartValue> {
        let result = await this.getModel().findById(id).lean();

        return result as IShoppingCartValue;
    }
}