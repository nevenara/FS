import { ISessionStore } from "../http/session/session-store";
import { ScannerContext } from "./scanner-context";

export class ScannerContextFactory {
    constructor(private sessionStore: ISessionStore) {
    }

    public async getScannerContext(sessionId: string): Promise<ScannerContext> {
        const scannerContext = new ScannerContext();
        scannerContext.isAuthenticated = false;
        scannerContext.sessionId = sessionId;

        if (sessionId) {
            const sessionData = await this.sessionStore.getSession(sessionId);

            if (sessionData && sessionData.eventId) {
                scannerContext.userId = sessionData.userId;
                scannerContext.isAuthenticated = true;
                scannerContext.eventId = sessionData.eventId;
            }
        }

        return scannerContext;
    }
}