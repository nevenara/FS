import * as chaiAsPromised from "chai-as-promised";
import { expect, use } from "chai";
const express = require('express');
import * as sinon from "sinon";
const request = require("supertest");
import { IUserContext, UserContext } from "../../common/user-context";
import { Bootstrapper } from "../../bootstrapper";
import { getFansafeTestServer } from "../../test/fansafe-test-server";
import { ExpressAppWrapper } from "../../http/express-app-wrapper";
import { RegistrationRouter } from "../registration-router";
import { RegisterRequest } from "../models/register-request";
import { CompleteRegistrationRequest } from "../models/complete-registration-request";

describe("registration router @integration", () => {
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

  describe("register", () => {

    it("shall register with valid data", async () => {
      console.log("shall register with valid data");
      debugger;
      const registerRequest = new RegisterRequest();
      registerRequest.email = "test7@test.com";
      registerRequest.password1 = "superStrongP@ss1";
      registerRequest.password2 = "superStrongP@ss1";
 
      const res = await request(app)
        .post(`${ExpressAppWrapper.urlPrefix}${RegistrationRouter.REGISTERURL}`)
        .send(registerRequest)
        .expect('Content-Type', /json/)
        .expect(200);
        
        expect(res.status).to.equal(200);

      // await request(expressApp)
      // .post('dsadsa')
      // .send(registerRequest)
      // .expect(200);

      //  request(app)
      //     .post("/fansafe/user")
      //     .set('Accept', 'application/json')
      //     .send(registerRequest)
      //     .end(function (err, res) {
      //       if (err) {
      //         done(err);
      //       }

      //       debugger;
      //       console.log(res);
      //       done()
      //     });
    })

    it("shall verify email with valid data", async () => {
      console.log("shall verify email with valid data");
      debugger;
     
      const res = await request(app)
        .post(`${ExpressAppWrapper.urlPrefix}${RegistrationRouter.VERIFYEMAILURL}`)
        .query({ emailVerificationGuid: '17e165e0-f647-11ea-8d2e-bfa23a3f7290' })
        .expect('Content-Type', /json/)
        .expect(200);
        
        expect(res.status).to.equal(200);
      
    });

    it("shall authenticated user complete registration with valid data", async () => {
      console.log("shall authenticated user complete registration with valid data");
      context.isAuthenticated = true;
      context.userId = "5f5ef8bb312f5d294cd19259";
      const completeRegistrationrequest = new CompleteRegistrationRequest();

      completeRegistrationrequest.username = "test7@test.com";
      completeRegistrationrequest.gender = 1;
      completeRegistrationrequest.firstname = "Test";
      completeRegistrationrequest.lastname = "Test";
      completeRegistrationrequest.birthDate = new Date("2000-01-01");
      completeRegistrationrequest.address = "Address";
      completeRegistrationrequest.postCode = "CODE";
      completeRegistrationrequest.city = "City";
      completeRegistrationrequest.country = "Country";
      completeRegistrationrequest.otherEmails = ["test-other@test,com", "test-other1@test.com"];

      const res = await request(app)
        .post(`${ExpressAppWrapper.urlPrefix}${RegistrationRouter.COMPLETEREGISTRATIONURL}`)
        .send(completeRegistrationrequest)
        .expect('Content-Type', /json/)
        .expect(200);
        
        expect(res.status).to.equal(200);
    });

    it("shall not unauthenticated user complete registration", async () => {
      console.log("shall not unauthenticated user complete registration");
      context.isAuthenticated = false;
      context.userId = "5f5ef8bb312f5d294cd19259";
      const completeRegistrationrequest = new CompleteRegistrationRequest();

      completeRegistrationrequest.username = "test7@test.com";
      completeRegistrationrequest.gender = 1;
      completeRegistrationrequest.firstname = "Test";
      completeRegistrationrequest.lastname = "Test";
      completeRegistrationrequest.birthDate = new Date("2000-01-01");
      completeRegistrationrequest.address = "Address";
      completeRegistrationrequest.postCode = "CODE";
      completeRegistrationrequest.city = "City";
      completeRegistrationrequest.country = "Country";
      completeRegistrationrequest.otherEmails = ["test-other@test,com", "test-other1@test.com"];

      const res = await request(app)
        .post(`${ExpressAppWrapper.urlPrefix}${RegistrationRouter.COMPLETEREGISTRATIONURL}`)
        .send(completeRegistrationrequest)
        //.expect('Content-Type', /json/)
        .expect(403);
        
        expect(res.status).to.equal(403);
    });

  });


})