import * as chaiAsPromised from "chai-as-promised";
import { expect, use } from "chai";
const express = require('express');
import * as sinon from "sinon";
import { IUserContext, UserContext } from "../common/user-context";
import { Bootstrapper } from "../bootstrapper";
import { ITicketPriceCalculator, TicketPriceCalculator } from "./ticket-price-calculator";


describe("TicketPriceCalculator @unit", () => {
    let context: IUserContext;
    let sinonSandbox: sinon.SinonSandbox;
    let calculator: ITicketPriceCalculator;

    before("prepare", async () => {
        use(chaiAsPromised);

        context = new UserContext();
    });

    beforeEach(async () => {
        sinonSandbox = sinon.createSandbox();
        calculator = Bootstrapper.getTicketPriceCalculator();
    });

    afterEach(async () => {
        sinonSandbox.restore();
    })

    describe("calculateAdditionalFee", () => {

        it.only("calculateAdditionalFee", async () => {

            debugger;

            const price = calculator.calculateAdditionalFee(50, 'AT');

            expect(price).to.be.equal(56.02);
        });
    });
});