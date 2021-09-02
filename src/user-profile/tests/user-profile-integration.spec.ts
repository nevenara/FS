import * as chaiAsPromised from "chai-as-promised";
import { expect, use } from "chai";
const express = require('express');
import * as sinon from "sinon";
const request = require("supertest");
import { IUserContext, UserContext } from "../../common/user-context";
import { Bootstrapper } from "../../bootstrapper";
import { getFansafeTestServer } from "../../test/fansafe-test-server";
import { ExpressAppWrapper } from "../../http/express-app-wrapper";
import { UserProfileRouter } from "../user-profile-router";
import { UpdateUserProfileRequest } from "../models/update-user-profile-request";
import { UpdateUserPasswordRequest } from "../models/update-user-password-request";

describe("user profile router @integration", () => {
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

  describe("user profile", () => {

    it("shall get user profile", async () => {
        const res = await request(app)
            .post(`${ExpressAppWrapper.urlPrefix}${UserProfileRouter.GET_USER_PROFILE_URL}`)
            .send()
            .expect('Content-Type', /json/)
            .expect(200);
            
            expect(res.status).to.equal(200);
    });

    it("shall update user address", async () => {
        const userProfileRequest = new UpdateUserProfileRequest();
        userProfileRequest.address = 'address2';

        const res = await request(app)
            .post(`${ExpressAppWrapper.urlPrefix}${UserProfileRouter.UPDATE_USER_PROFILE_URL}`)
            .send(userProfileRequest)
            .expect('Content-Type', /json/)
            .expect(200);
            
            expect(res.status).to.equal(200);
    });

    it("shall update user phone", async () => {
        const userProfileRequest = new UpdateUserProfileRequest();
        userProfileRequest.phone = '11-1245';

        const res = await request(app)
            .post(`${ExpressAppWrapper.urlPrefix}${UserProfileRouter.UPDATE_USER_PROFILE_URL}`)
            .send(userProfileRequest)
            .expect('Content-Type', /json/)
            .expect(200);
            
            expect(res.status).to.equal(200);
    });

    it("shall not update post code - wrong length", async () => {
        const userProfileRequest = new UpdateUserProfileRequest();
        userProfileRequest.postCode = '115484156878415418';

        const res = await request(app)
            .post(`${ExpressAppWrapper.urlPrefix}${UserProfileRouter.UPDATE_USER_PROFILE_URL}`)
            .send(userProfileRequest)
            .expect(400);
            
            expect(res.status).to.equal(400);
    });

    it("shall not update user phone - wrong format", async () => {
        const userProfileRequest = new UpdateUserProfileRequest();
        userProfileRequest.phone = '11-text?';

        const res = await request(app)
            .post(`${ExpressAppWrapper.urlPrefix}${UserProfileRouter.UPDATE_USER_PROFILE_URL}`)
            .send(userProfileRequest)
            .expect(400);
            
            expect(res.status).to.equal(400);
    });

    it("shall update user password", async () => {
      const userProfileRequest = new UpdateUserPasswordRequest();
      userProfileRequest.currentPassword = 'Test1234';
      userProfileRequest.newPassword = 'Test1234';
      userProfileRequest.confirmPassword = 'Test1234';

      const res = await request(app)
          .post(`${ExpressAppWrapper.urlPrefix}${UserProfileRouter.UPDATE_USER_PASSWORD_URL}`)
          .send(userProfileRequest)
          .expect('Content-Type', /json/)
          .expect(200);
          
          expect(res.status).to.equal(200);
    });

    it("shall not update user password - wrong current password", async () => {
      const userProfileRequest = new UpdateUserPasswordRequest();
      userProfileRequest.currentPassword = 'wrong';
      userProfileRequest.newPassword = 'Test1234';
      userProfileRequest.confirmPassword = 'Test1234';

      const res = await request(app)
          .post(`${ExpressAppWrapper.urlPrefix}${UserProfileRouter.UPDATE_USER_PASSWORD_URL}`)
          .send(userProfileRequest)
          .expect(400);
          
          expect(res.status).to.equal(400);
    });

    it("shall not update user password - new and confirm password don't match", async () => {
      const userProfileRequest = new UpdateUserPasswordRequest();
      userProfileRequest.currentPassword = 'Test1234';
      userProfileRequest.newPassword = 'Test12341111';
      userProfileRequest.confirmPassword = 'Test1234';

      const res = await request(app)
          .post(`${ExpressAppWrapper.urlPrefix}${UserProfileRouter.UPDATE_USER_PASSWORD_URL}`)
          .send(userProfileRequest)
          .expect(400);
          
          expect(res.status).to.equal(400);
    });

    it("shall not update user password - wrong new password format", async () => {
      const userProfileRequest = new UpdateUserPasswordRequest();
      userProfileRequest.currentPassword = 'Test1234';
      userProfileRequest.newPassword = '1';
      userProfileRequest.confirmPassword = '1';

      const res = await request(app)
          .post(`${ExpressAppWrapper.urlPrefix}${UserProfileRouter.UPDATE_USER_PASSWORD_URL}`)
          .send(userProfileRequest)
          .expect(400);
          
          expect(res.status).to.equal(400);
    });

    it("shall authenticated user upload profile image with valid image", async () => {
      const buffer = Buffer.from('C:\Users\s.vujicic\Pictures\passing.png');

      const res = await request(app)
        .post(`${ExpressAppWrapper.urlPrefix}${UserProfileRouter.UPLOAD_PROFILE_IMAGE_URL}`)
        .attach('profileImage', buffer, 'image.png')
        .expect('Content-Type', /json/)
        .expect(200);
        
        expect(res.status).to.equal(200);
    });
  });
})