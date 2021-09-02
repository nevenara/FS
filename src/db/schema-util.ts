import { ObjectId } from 'bson';
import { getUUIDFromBuffer, getBufferFromUUID1 } from './uuid';
 
export function getStringFromBuffer(buffer: Buffer): string {
    if (buffer && typeof buffer === 'string') {
        return buffer;
    }
    return buffer && getUUIDFromBuffer(buffer);
}

export function getBufferFromString(str: string): Buffer | '' {
    if (str && typeof str !== 'string') {
        return str;
    }
    return str && getBufferFromUUID1(str); // return buffer only if str is NOT empty
}
export function getIdBufferFromString(id?: string): Buffer {
    if (id && typeof id !== 'string') {
        return id;
    }
    return getBufferFromUUID1(id); // create id if str is empty since id is mandatory
}

export function getStringFromObjectId(objId: ObjectId): string {
    if (typeof objId === 'string') {
        return objId;
    }
    return objId.toHexString();
}

export function getObjectIdFromString(str?: string): ObjectId {
    if ((str as any) instanceof ObjectId) {
        return str as any;
    }
    str = str || '000000000000000000000000';
    return ObjectId.createFromHexString(str);
}