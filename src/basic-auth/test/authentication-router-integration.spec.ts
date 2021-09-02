import { expect, use } from "chai";
import chaiAsPromised = require("chai-as-promised");
import sinon = require("sinon");
import { Bootstrapper } from "../../bootstrapper";
import { IUserContext, UserContext } from "../../common/user-context";
import { ExpressAppWrapper } from "../../http/express-app-wrapper";
import { getFansafeTestServer } from "../../test/fansafe-test-server";
import { AuthenticationRouter } from "../authentication-router";
import { LoginRequest } from "../models/login-request";

const express = require('express');
const request = require("supertest");

describe("authentication router @integration", () => {
  let context: IUserContext;
  let sinonSandbox: sinon.SinonSandbox;
  let app: any;

  before("register routes", async () => {
    use(chaiAsPromised);

    context = new UserContext();
    //context.userId ??
    debugger;
    await Bootstrapper.init();
    app = express();   
    const testServer = getFansafeTestServer(app, context);
    await testServer.start();
  });

  beforeEach(async () => {
    sinonSandbox = sinon.createSandbox();
  });

  afterEach(async () => {
    sinonSandbox.restore();
  })

  describe("authenticate", () => {

    it("shall log in with valid data", async () => {
      console.log("shall log in with valid data");
      debugger;
      const loginRequest = new LoginRequest();
      loginRequest.username = "test7@test.com";
      loginRequest.password = "superStrongP@ss1";
 
      const res = await request(app)
        .post(`${ExpressAppWrapper.urlPrefix}${AuthenticationRouter.LOGINURL}`)
        .send(loginRequest)
        .expect('Content-Type', /json/)
        .expect(200);
        
        expect(res.status).to.equal(200);
    });

    
    it("shall not log in with invalid data", async () => {
        console.log("shall not log in with invalid data");
        debugger;
        const loginRequest = new LoginRequest();
        loginRequest.username = "test7@test.com";
        loginRequest.password = "";
   
        const res = await request(app)
          .post(`${ExpressAppWrapper.urlPrefix}${AuthenticationRouter.LOGINURL}`)
          .send(loginRequest)
          //.expect('Content-Type', /json/)
          .expect(400);
          
          expect(res.status).to.equal(400);
  
      });

    

  });


})