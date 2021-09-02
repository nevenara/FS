import * as chaiAsPromised from "chai-as-promised";
import { expect, use } from "chai";
const express = require('express');
import * as sinon from "sinon";
const request = require("supertest");
import { IUserContext, UserContext } from "../../common/user-context";
import { Bootstrapper } from "../../bootstrapper";
import { getFansafeTestServer } from "../../test/fansafe-test-server";
import { ExpressAppWrapper } from "../../http/express-app-wrapper";
import { LinkedAccountsRouter } from "../linked-accounts-router";
import { ConnectNewAccountRequest } from "../models/connect-new-account-request";
import { link } from "fs";
import { Gender } from "../../models/gender";
import { IdCheckLinkedAccountRequest } from "../models/id-check-linked-account-request";

describe("linked accounts router @integration", () => {
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
  
    describe("linked accounts", () => {
  
        it("shall connect new linked account < 16 years old", async () => {
            const linkedAccountRequest: ConnectNewAccountRequest = new ConnectNewAccountRequest();

            linkedAccountRequest.address = "address";
            linkedAccountRequest.birthDate = new Date('2009-05-28');
            linkedAccountRequest.city = "city";
            linkedAccountRequest.country = "country";
            linkedAccountRequest.firstname = "Firstname";
            linkedAccountRequest.gender = Gender.Female;
            linkedAccountRequest.lastname = "Lastname";
            linkedAccountRequest.postCode = "2124";
            linkedAccountRequest.relationToMainAccount = "child";
            linkedAccountRequest.username = "linkedAccount1";

            const res = await request(app)
                .post(`${ExpressAppWrapper.urlPrefix}${LinkedAccountsRouter.CONNECT_NEW_ACCOUNT_URL}`)
                .send(linkedAccountRequest)
                .expect('Content-Type', /json/)
                .expect(200);
              
            expect(res.status).to.equal(200);
        });

        it("shall connect new linked account >= 16 years old", async () => {
            const linkedAccountRequest: ConnectNewAccountRequest = new ConnectNewAccountRequest();

            linkedAccountRequest.address = "address";
            linkedAccountRequest.birthDate = new Date('1996-05-28');
            linkedAccountRequest.city = "city";
            linkedAccountRequest.country = "country";
            linkedAccountRequest.firstname = "Firstname";
            linkedAccountRequest.gender = Gender.Female;
            linkedAccountRequest.lastname = "Lastname";
            linkedAccountRequest.postCode = "2124";
            linkedAccountRequest.relationToMainAccount = "child";
            linkedAccountRequest.username = "linkedAccount2";

            const res = await request(app)
                .post(`${ExpressAppWrapper.urlPrefix}${LinkedAccountsRouter.CONNECT_NEW_ACCOUNT_URL}`)
                .send(linkedAccountRequest)
                .expect('Content-Type', /json/)
                .expect(200);
              
            expect(res.status).to.equal(200);
        });

        it("shall ID check linked account", async () => {
            const linkedAccountRequest: IdCheckLinkedAccountRequest = new IdCheckLinkedAccountRequest();

            linkedAccountRequest.linkedAccountId = "5f61e4c1b92588010850c341";

            const res = await request(app)
                .post(`${ExpressAppWrapper.urlPrefix}${LinkedAccountsRouter.ID_CHECK_LINKED_ACCOUNT_URL}`)
                .send(linkedAccountRequest)
                .expect('Content-Type', /json/)
                .expect(200);
              
            expect(res.status).to.equal(200);
        });
    });
});