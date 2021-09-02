import * as uuid from "uuid";

export function getUUID(): string {
    return getUUID1();
}

export function getUUID1(): string {
    return uuid.v1();
}

export function getBufferFromUUID1(uuidStr?: string): Buffer {
    uuidStr = uuidStr || getUUID1();
    return Buffer.from(uuidStr);
}

export function getUUIDFromBuffer(buffer: Buffer): string {
    return buffer.toString();
}

export function getUUID4(): string {
    return uuid.v4();
}