export class InternalError extends Error {
    public guid: string;
    public message: string;
    public internalErrorDescription: string;
    public innerError: Error;
    public stack: string;
    public clientmessage: string;

    constructor(error: Error, internalErrorDescription: string, clientMessage?: string) {
        super(`${internalErrorDescription.toString()}`);
        Error.captureStackTrace(this, InternalError);
        this.innerError = error;
        this.internalErrorDescription = internalErrorDescription;
        this.clientmessage = clientMessage;
    }
}