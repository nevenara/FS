import { NotAuthenticatedError } from "./errors/not-authenticated-error";

export interface IScannerContext {
    isAuthenticated: boolean;
    sessionId: string;
    userId: string;
    eventId: string;
    validateIfAuthenticated();
}

export class ScannerContext implements IScannerContext {
    isAuthenticated: boolean;
    sessionId: string;
    userId: string;
    eventId: string;

    public validateIfAuthenticated(): void {
        if (!this.isAuthenticated) {
            throw new NotAuthenticatedError("Authenticated user is required.");
        }
    }
}