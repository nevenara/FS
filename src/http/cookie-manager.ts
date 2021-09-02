import { Request, Response } from "express";
import { LoginResponse } from "../basic-auth/models/login-response";
import { CookieName } from "./cookie-name";
import { Guard } from "../common/errors/guard";
import { Environment } from "../environment";

const oldDate = "Mon, 22 Feb 2010 13:32:08 GMT";

export interface ICookieManager {
    setCookie(req: Request, res: Response, sessionId: string): void;
    getSessionIdFromRequest(req: Request): string;
    removeCookie(req: Request, res: Response): void;
}

export class CookieManager implements ICookieManager {
    public setCookie(req: Request, res: Response, sessionId: string): void {
        Guard.isTruthy(sessionId, "sessionId cannot be null.");
        Guard.isTruthy(req, "Request cannot be null.");
        Guard.isTruthy(res, "Response cannot be null.");

        const options = {
            maxAge: 86400000,
            // sameSite: "none",
            // secure: true
            // httpOnly: true, //TODO set to false for local development
        };

        if (Environment.isProductionMode()) {
            options['sameSite'] = "none";
            //For now secure will not be set to true because it requires https
            //in order to allow samesite to none we need to disable: chrome://flags/#same-site-by-default-cookies
            //disable "Cookies without SameSite must be secure"
            // options['secure'] = true;
        }

        res.cookie(CookieName.session, sessionId, options);
    }

    public getSessionIdFromRequest(req: Request): string {
        return req.cookies[CookieName.session];
    }

    public removeCookie(req: Request, res: Response) {
        Guard.isTruthy(req, "Request cannot be null.");
        Guard.isTruthy(res, "Response cannot be null.");

        res.clearCookie(CookieName.session, { path: "/", secure: true, httpOnly: true });
    }
}