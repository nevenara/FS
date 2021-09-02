import * as chaiAsPromised from "chai-as-promised";
import { expect, use } from "chai";
const express = require('express');
import * as sinon from "sinon";
import { IUserContext, UserContext } from "../common/user-context";
import { Bootstrapper } from "../bootstrapper";
import { debug } from "console";
const request = require("supertest");
 

describe("ticketservice @integration", () => {
    let context: IUserContext;
    let sinonSandbox: sinon.SinonSandbox;
    let app: any;
  
    before("prepare", async () => {
      use(chaiAsPromised);
  
      context = new UserContext();
      //context.userId ??
      await Bootstrapper.init();
      context.isAuthenticated = true;
      context.userId = "5f58e419a0d1b335a47d280f";
    });
  
    beforeEach(async () => {
      sinonSandbox = sinon.createSandbox();
    });
  
    afterEach(async () => {
      sinonSandbox.restore();
    })
  
    describe("personalizeMainAccountTickets", () => {
  
        it("personalizeMainAccountTickets", async () => {
            debugger;
            const ticketService = Bootstrapper.getTicketService(context);

            const userRepository = Bootstrapper.getUserRepository();

            const user = await userRepository.getUserByUserNameOrEmail('milos.d.josic@gmail.com');

            const response = await ticketService.personalizeMainAccountTickets(user);


            // const res = await request(app)
            //     .post(`${ExpressAppWrapper.urlPrefix}${LinkedAccountsRouter.CONNECT_NEW_ACCOUNT_URL}`)
            //     .send(linkedAccountRequest)
            //     .expect('Content-Type', /json/)
            //     .expect(200);
              
            // expect(res.status).to.equal(200);
        });
 
 
    });
});