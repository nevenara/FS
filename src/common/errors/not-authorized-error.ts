export class NotAuthorizedError extends Error {
    public stack: string;
    public clientmessage: string;
    public guid: string;
    public statusCode: number;

    constructor(msg: string) {
        super(`Not authorized. ${msg}`);
        Error.captureStackTrace(this, NotAuthorizedError);
        this.clientmessage = "Not authorized.";
        this.statusCode = 403;
    }
}