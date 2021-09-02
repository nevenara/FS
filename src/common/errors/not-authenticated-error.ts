export class NotAuthenticatedError extends Error {
    public stack: string;
    public clientmessage: string;
    public guid: string;
    public statusCode: number;

    constructor(msg: string) {
        super(`Not authenticated. ${msg}`);
        Error.captureStackTrace(this, NotAuthenticatedError);
        this.clientmessage = "Not authenticated.";
        this.statusCode = 403;
    }
}