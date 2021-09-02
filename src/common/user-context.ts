import { UserType } from "../models/user-type";
import { NotAuthenticatedError } from "./errors/not-authenticated-error";
import { NotAuthorizedError } from "./errors/not-authorized-error";
import { ValidationError } from "./errors/validation-error";

export interface IUserContext {
    isOrganizer(): boolean;
    lang: string;
    sessionId: string;
    userId: string;
    isAuthenticated: boolean;
    validateIfAuthenticated(): void;
    userType: UserType;
    email: string;
    firstname: string;
    lastname: string;
    country: string;
    proxyUserId: string;
    proxyUserType: UserType;
    organizerId: string;
    validateAuthorization(userTypes: Array<UserType>): void;
    validateIfAdmin();
    validateIfOrganizer();
}

export class UserContext implements IUserContext {

    public lang: string;
    public sessionId: string;
    public userId: string;
    public isAuthenticated: boolean;
    public userType: UserType;
    public email: string;
    public firstname: string;
    public lastname: string;
    public country: string;
    public proxyUserId: string;
    public proxyUserType: UserType;
    public organizerId: string;

    isOrganizer(): boolean {
        return this.userType === UserType.Organizer || this.proxyUserType === UserType.Organizer;
    }

    public validateIfAuthenticated(): void {
        if (!this.isAuthenticated) {
            throw new NotAuthenticatedError("Authenticated user is required.");
        }
    }

    public validateAuthorization(authorizedUserTypes: Array<UserType>): void {
        if (!authorizedUserTypes.includes(this.userType)) {
            throw new NotAuthorizedError("User is not authorized.");
        }
    }

    validateIfAdmin() {
        if (this.userType !== UserType.Admin) {
            throw new ValidationError("User is not an Admin.");
        }
    }

    validateIfOrganizer() {
        if (!this.isOrganizer()) {
            throw new NotAuthorizedError("User is not authorized.");
        }
    }
}