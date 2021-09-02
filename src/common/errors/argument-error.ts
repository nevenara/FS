import { ValidationError } from "./validation-error";

export class ArgumentError extends ValidationError {
    public constructor(msg: string) {
        super(msg);
    }
}