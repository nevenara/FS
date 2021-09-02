import { ArgumentError } from "./argument-error";


export class Guard {
    public static isTruthy(value, msg) {
        if (!value) {
            throw new ArgumentError(msg);
        }
    }

    public static isFalsy(value, msg) {
        if (value) {
            throw new ArgumentError(msg);
        }
    }
}