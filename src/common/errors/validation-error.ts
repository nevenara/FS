export class ValidationError extends Error {
    public stack: string;
    public clientmessage: string;
    public guid: string;
    public statusCode: number;

    constructor(msg: string) {
        super(`${msg}`);
        Error.captureStackTrace(this, ValidationError);
        this.clientmessage = msg;
        this.statusCode = 400;
    }
}