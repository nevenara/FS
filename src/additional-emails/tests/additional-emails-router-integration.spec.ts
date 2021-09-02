import * as chaiAsPromised from "chai-as-promised";
import { expect, use } from "chai";
const express = require('express');
import { readFileSync } from "fs";
import { join as joinPath } from "path";
import * as sinon from "sinon";
const request = require("supertest");
import { IUserContext, UserContext } from "../../common/user-context";
import { Bootstrapper } from "../../bootstrapper";
import { getFansafeTestServer } from "../../test/fansafe-test-server";
import { ExpressAppWrapper } from "../../http/express-app-wrapper";
import { AddAdditionalEmailRequest } from "../models/add-additional-email-request";
import { VerifyAdditionalEmailRequest } from "../models/verify-additional-email-request";
import { UseAsStandardEmailRequest } from "../models/use-as-standard-email-request";
import { AdditionalEmailsRouter } from "../additional-emails-router";
import { DeleteAdditionalEmailRequest } from "../models/delete-additional-email-request";

describe("additional emails router @integration", () => {
  let context: IUserContext;
  let sinonSandbox: sinon.SinonSandbox;
  let app: any;

  before("register routes", async () => {
    use(chaiAsPromised);

    context = new UserContext();
    //context.userId ??
    await Bootstrapper.init();
    app = express();   
    const testServer = getFansafeTestServer(app, context);
    await testServer.start();

    context.isAuthenticated = true;
    context.userId = "5f58e419a0d1b335a47d280f";
  });

  beforeEach(async () => {
    sinonSandbox = sinon.createSandbox();
  });

  afterEach(async () => {
    sinonSandbox.restore();
  })

  describe("additional emails", () => {

    it("shall add valid additional email", async () => {
        const additionalEmailRequest = new AddAdditionalEmailRequest();
        additionalEmailRequest.email = 'test2@test.com';
    
        const res = await request(app)
            .post(`${ExpressAppWrapper.urlPrefix}${AdditionalEmailsRouter.ADD_ADDITIONAL_EMAIL_URL}`)
            .send(additionalEmailRequest)
            .expect('Content-Type', /json/)
            .expect(200);
            
            expect(res.status).to.equal(200);
    });

    it("shall not add additional email - not unique", async () => {
        const additionalEmailRequest = new AddAdditionalEmailRequest();
        additionalEmailRequest.email = 'test2@test.com';
    
        const res = await request(app)
            .post(`${ExpressAppWrapper.urlPrefix}${AdditionalEmailsRouter.ADD_ADDITIONAL_EMAIL_URL}`)
            .send(additionalEmailRequest)
            .expect(400);
            
            expect(res.status).to.equal(400);
    });

    it("shall verify additional email", async () => {
        const additionalEmailRequest = new VerifyAdditionalEmailRequest();
    
        const res = await request(app)
            .get(`${ExpressAppWrapper.urlPrefix}${AdditionalEmailsRouter.VERIFY_ADDITIONAL_EMAIL_URL}`)
            .query({ uuid: '157884e0-f747-11ea-ab58-bbb83d2c3ff2' })
            .expect('Content-Type', /json/)
            .expect(200);
            
            expect(res.status).to.equal(200);
    });

    it("shall use additional email as standard", async () => {
        const additionalEmailRequest = new UseAsStandardEmailRequest();
        additionalEmailRequest.email = 'test@test.com';
        additionalEmailRequest.password = 'Test123';
    
        const res = await request(app)
            .post(`${ExpressAppWrapper.urlPrefix}${AdditionalEmailsRouter.USE_AS_STANDARD_EMAIL_URL}`)
            .send(additionalEmailRequest)
            .expect('Content-Type', /json/)
            .expect(200);
            
            expect(res.status).to.equal(200);
    });

    it("shall not use additional email as standard - wrong password", async () => {
        const additionalEmailRequest = new UseAsStandardEmailRequest();
        additionalEmailRequest.email = 'test@test.com';
        additionalEmailRequest.password = 'Test1234';
    
        const res = await request(app)
            .post(`${ExpressAppWrapper.urlPrefix}${AdditionalEmailsRouter.USE_AS_STANDARD_EMAIL_URL}`)
            .send(additionalEmailRequest)
            .expect(400);
            
            expect(res.status).to.equal(400);
    });

    it("shall not use additional email as standard - not verifed email", async () => {
        const additionalEmailRequest = new UseAsStandardEmailRequest();
        additionalEmailRequest.email = 'test2@test.com';
        additionalEmailRequest.password = 'Test123';
    
        const res = await request(app)
            .post(`${ExpressAppWrapper.urlPrefix}${AdditionalEmailsRouter.USE_AS_STANDARD_EMAIL_URL}`)
            .send(additionalEmailRequest)
            .expect(400);
            
            expect(res.status).to.equal(400);
    });

    it("shall delete additional email as standard", async () => {
        const additionalEmailRequest = new DeleteAdditionalEmailRequest();
        additionalEmailRequest.email = 'test2@test.com';
    
        const res = await request(app)
            .delete(`${ExpressAppWrapper.urlPrefix}${AdditionalEmailsRouter.DELETE_ADDITIONAL_EMAIL_URL}`)
            .send(additionalEmailRequest)
            .expect('Content-Type', /json/)
            .expect(200);
            
            expect(res.status).to.equal(200);
    });
  });
})