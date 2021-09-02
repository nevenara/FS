import { FansafeServer } from "../http/fansafe-server";
import * as sinon from "sinon";
import * as express from "express";
import { IUserContext } from "../common/user-context";
import { ExpressAppWrapper } from "../http/express-app-wrapper";
import * as request from "supertest";

export class FansafeTestServer extends FansafeServer{
    private sinonSandbox: sinon.SinonSandbox;
    private context: IUserContext;

    constructor(
        readonly expressApp,
        context: IUserContext
    ) {
        super(expressApp);
        this.sinonSandbox = sinon.createSandbox();
        this.sinonSandbox.stub(this as any, "createServer").callsFake(() => {
            console.log('Called fake createServer.')
        });

        this.sinonSandbox.stub(this as any, "initUserContext").callsFake((req, res, next) => {
            console.log('Called fake initUserContext.');
            req.context = this.context;
            next();
        });

        this.context = context;
    }

    public restore(){
        this.sinonSandbox.restore();
    }
}

export function getFansafeTestServer(expressApp: express.Express, context: IUserContext){
    const serverTest = new FansafeTestServer(expressApp, context);
    return serverTest;
}