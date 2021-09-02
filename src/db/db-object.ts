import { IDbData } from "./idb-data";

export abstract class DbObject {
    protected data: IDbData = {
        _id: null,
    };

    constructor(dbData?: IDbData) {
        if (dbData) {
            this.data = dbData;
        }
    }

    get dbdata(): IDbData {
        return this.data;
    }

    get id(): string {
        return this.data._id;
    }
    set id(value: string) {
        this.data._id = value;
    }      
 

    // get createdBy(): string | undefined {
    //     return this.data.createdBy;
    // }
    // set createdBy(value: string | undefined) {
    //     this.data.createdBy = value;
    // }

    // get createdOn(): string | undefined {
    //     return this.data.createdOn;
    // }
    // set createdOn(value: string | undefined) {
    //     this.data.createdOn = value;
    // }

    // get updatedBy(): string | undefined {
    //     return this.data.updatedBy;
    // }
    // set updatedBy(value: string | undefined) {
    //     this.data.updatedBy = value;
    // }

    // get updatedOn(): string | undefined {
    //     return this.data.updatedOn;
    // }
    // set updatedOn(value: string | undefined) {
    //     this.data.updatedOn = value;
    // }

    // get isDeleted(): boolean {
    //     return !!this.data.isDeleted;
    // }
    // set isDeleted(value: boolean) {
    //     this.data.isDeleted = value;
    // }

    // get deletedBy(): string | undefined {
    //     return this.data.deletedBy;
    // }
    // set deletedBy(value: string | undefined) {
    //     this.data.deletedBy = value;
    // }

    // get deletedOn(): string | undefined {
    //     return this.data.deletedOn;
    // }
    // set deletedOn(value: string | undefined) {
    //     this.data.deletedOn = value;
    // }     

    public existsDBField(field: string): boolean {
        let propDesc: PropertyDescriptor | undefined;
        let obj: any = this;
        do {
            propDesc = Object.getOwnPropertyDescriptor(obj, field);

            obj = Object.getPrototypeOf(obj);
        } while (!propDesc && obj);

        return !!(propDesc && propDesc.get);
    }

    public getJSONDB(): JSON {
        return this.dbdata as any;
    }

    public getJSONExternal(): JSON {
        const externalValue: any = {};
        Object.keys(this.dbdata).forEach((key) => {
            if (key === "_id") {
                externalValue.id = this.id;
            } else {
                externalValue[key] = this[key];
            }
        });

        return externalValue;
    }
}
