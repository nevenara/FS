import { Schema, Document } from "mongoose";
import { getBufferFromUUID1 } from "./uuid";
 
// import { adminDataSchema } from "./admin-data";
import {
    getStringFromBuffer,
    getIdBufferFromString,
    getObjectIdFromString,
    getStringFromObjectId,
} from "./schema-util";

export interface IBaseModel extends Document {
    _cacheKey: number;
    toObject(): Promise<JSON>;
}

export const baseSchema: Schema = new Schema(
    {
        _id: {
            type: Buffer, // mongoose converts Buffer to BinData internally
            required: true,
            default: getBufferFromUUID1,
            get: getStringFromBuffer,
            set: getIdBufferFromString,
        },
        createdOn: {
            type: String,
            required: true,
        },
        createdBy: {
            type: String,
            required: true,
        },
        updatedOn: {
            type: String,
            required: false,
        },
        updatedBy: {
            type: String,
            required: false,
        },
        isDeleted: {
            type: Boolean,
            required: false,
        },
        deletedBy: {
            type: String,
            required: false,
        },
        deletedOn: {
            type: String,
            required: false,
        },
        ownerId: {
            type: String,
            required: false,
        },
        fileModifiedOn: {
            type: String,
            required: false,
        } 
    },
    {
        versionKey: "_cacheKey",
        toObject: {
            virtuals: true,
            getters: true,
        },
        toJSON: {
            virtuals: true,
            getters: true,
        },
    },
);

baseSchema.index({ _id: 1 });

/**
 * update _cacheKey when update is called
 */

baseSchema.pre("findOneAndUpdate", function (): void {
    const update: any = this.getUpdate();
    if (update._cacheKey != null) {
        delete update._cacheKey;
    }
    const keys: string[] = ["$set", "$setOnInsert"];
    for (const key of keys) {
        if (update[key] != null && update[key]._cacheKey != null) {
            delete update[key]._cacheKey;
            // when tenantId is required update[key] should always has tenantId as property
            // if (Object.keys(update[key]).length === 0) {
            //     delete update[key];
            // }
        }
    }
    update.$inc = update.$inc || {};
    update.$inc._cacheKey = 1;
});

export function extendSchema(childSchema: Schema): Schema {
    const newSchema: Schema = baseSchema.clone();
    newSchema.add(childSchema);
    return newSchema;
}
