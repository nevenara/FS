import { Guard } from "../common/errors/guard";
import { ValidationError } from "../common/errors/validation-error";
import { IUserContext } from "../common/user-context";
import { LocalisationKey } from "../localisation/localisation-key";
import { ILocalisationProvider } from "../localisation/localisation-provider";
import { TicketStatus } from "../tickets/model/ticket-status";
import { ITicketRepository } from "../tickets/ticket-repository";
import { RepersonalizationFeeDetailsResponse } from "./model/repersonalisation-fee-details-response";
import { TicketPriceDetailsResponse } from "./model/ticket-price-details";
import { ITicketPriceCalculator } from "./ticket-price-calculator";

export class TicketPriceController {
    constructor(
        private ticketRepository: ITicketRepository,
        private calculator: ITicketPriceCalculator,
        private context: IUserContext,
        private localisationProvider: ILocalisationProvider) {

    }

    public async getTicketPricingDetails(ticketId: string): Promise<TicketPriceDetailsResponse> {
        const ticket = await this.ticketRepository.getTicketById(ticketId);

        Guard.isTruthy(ticket, `ticketId ${ticketId} is invalid.`);

        if (ticket.status !== TicketStatus.ForSale) {
            throw new ValidationError(this.localisationProvider.translate(LocalisationKey.TicketNotForSale));
        }

        const response = new TicketPriceDetailsResponse();

        response.total = this.calculator.calculateAdditionalFee(ticket.priceForSale, this.context.country);

        response.percentage = this.calculator.getPercentage(this.context.country);

        return response;
    }

    public async getRepersonalizationFeeDetails(): Promise<RepersonalizationFeeDetailsResponse>{
        const response =  new RepersonalizationFeeDetailsResponse();

        response.fixedFee = this.calculator.getRepersonalizationFeeConstant();

        response.percentage = this.calculator.getPercentage(this.context.country);

        return response;
    }
}