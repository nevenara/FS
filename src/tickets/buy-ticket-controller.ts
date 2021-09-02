import { IUserContext } from "../common/user-context";
import { ITicketRepository } from "./ticket-repository";
import { IUserRepository } from "../user/user-repository";
import { ReserveTicketsRequest } from "./model/reserve-tickets-request";
import { ReserveTicketsResponse, BestCloseTicket } from "./model/reserve-tickets-response";
import { CancelTicketReservationRequest } from "./model/cancel-ticket-reservation-request";
import { CancelTicketReservationResponse } from "./model/cancel-ticket-reservation-response";
import { PayTicketsRequest, TicketBuy } from "./model/pay-tickets-request";
import { PayTicketsResponse } from "./model/pay-tickets-response";
import { ITicketValue } from "./model/ticket";
import moment = require("moment");
import { TicketDbObject } from "./model/ticket-db-object";
import { SearchTicketRepoRequest } from "./model/search-ticket-repo-request";
import { ValidationError } from "../common/errors/validation-error";
import { LocalisationKey } from "../localisation/localisation-key";
import { TicketStatus } from "./model/ticket-status";
import { IUserValue } from "../user/user-value";
import { UserType } from "../models/user-type";
import { UserStatus } from "../models/user-status";
import { ITicketValidator } from "./ticket-validator";
import { ITicketService } from "./ticket-service";
import { TicketTransactionType } from "../models/ticket-transaction-type";
import { IBuyTicketFlow } from "../payment/buy-ticket-flow";
import { IOrganizerRepository } from "../organizer/organizer-repository";
import { ConfigService } from "../common/config-service";
import { ShoppingCart } from "../payment/model/shopping-cart";
import { DoorsOpenTimeFormat } from "./model/doors-open-time-format";
import { CheckBoughtTicketsStatusRequest } from "./model/check-bought-tickets-status-request";
import { IShoppingCartRepository } from "../payment/shopping-cart-repository";
import { Guard } from "../common/errors/guard";
import { ICountryIsoCodeProvider } from "../common/country-iso-code-provider";
import { InputDateParameterParseUtil } from "./model/input-date-parameter-parse";

export interface IBuyTicketController {
    reserveTickets(request: ReserveTicketsRequest): Promise<ReserveTicketsResponse>;
    cancelReservation(request: CancelTicketReservationRequest): Promise<CancelTicketReservationResponse>;
    startBuyTicketFlow(request: PayTicketsRequest): Promise<PayTicketsResponse>;
}

export class BuyTicketController implements IBuyTicketController {

    constructor(
        private context: IUserContext,
        private ticketRepository: ITicketRepository,
        private ticketService: ITicketService,
        private userRepository: IUserRepository,
        private organizerRepository: IOrganizerRepository,
        private ticketValidator: ITicketValidator,
        private buyTicketFlow: IBuyTicketFlow,
        private configService: ConfigService,
        private isoCodeProvider: ICountryIsoCodeProvider) {
    }

    public async reserveTickets(request: ReserveTicketsRequest): Promise<ReserveTicketsResponse> {
        this.context.validateIfAuthenticated();
        request.validate(this.context.lang);
        const EXPIRATION_TIME = await this.configService.getConfig('reservationExpirationTime', 10);
        const timeZone = await this.configService.getConfig('timeZone', 'Europe/Vienna');
        let ticket: ITicketValue = await this.ticketRepository.getTicketById(request.ticketId);

        this.ticketValidator.validateTicketReservation(ticket, this.context.userId);

        const linkedAccounts = await this.userRepository.getLinkedAccounts(this.context.userId);
        let bestCloseTickets: Array<ITicketValue> = [];

        if (linkedAccounts) {
            bestCloseTickets = await this.getBestCloseTickets(ticket, linkedAccounts.length);
        }

        let expirationDate: Date = moment().add(EXPIRATION_TIME, 'minutes').toDate();

        ticket.reservationExpirationDate = expirationDate;
        ticket.reservedOn = this.context.userId;

        await this.ticketRepository.updateObjectById(ticket._id, new TicketDbObject(ticket));

        for (let i = 0; i < bestCloseTickets.length; i++) {
            bestCloseTickets[i].reservationExpirationDate = expirationDate;
            bestCloseTickets[i].reservedOn = this.context.userId;

            await this.ticketRepository.updateObjectById(bestCloseTickets[i]._id, new TicketDbObject(bestCloseTickets[i]));
        }

        let response = new ReserveTicketsResponse();

        response.id = ticket._id;
        response.beginTime = InputDateParameterParseUtil.getDateInTimeZone(ticket.beginTime, timeZone);
        response.bookingId = ticket.bookingId;
        response.date = InputDateParameterParseUtil.getDateInTimeZone(ticket.date, timeZone);
        response.doorsOpen = DoorsOpenTimeFormat.format(ticket.doorsOpen);
        response.eventName = ticket.eventName;
        response.locationName = ticket.locationName;
        response.locationAddress = ticket.locationAddress;
        response.priceForSale = ticket.priceForSale;
        response.priceCurrency = ticket.priceCurrency;
        response.seat = ticket.seat;
        response.ticketId = ticket.ticketId;
        response.eventId = ticket.eventId;
        
        const organizer = await this.organizerRepository.getOrganizerById(ticket.organizerId);
        response.organizerName = organizer.companyName;
        response.reservationTime = EXPIRATION_TIME;
        response.tickets = [];

        bestCloseTickets.forEach(t => {
            let bestCloseTicket: BestCloseTicket = new BestCloseTicket();
            bestCloseTicket.id = t._id;
            bestCloseTicket.priceForSale = t.priceForSale;
            bestCloseTicket.seat = t.seat;
            bestCloseTicket.ticketId = t.ticketId;
            response.tickets.push(bestCloseTicket);
        });

        return response;
    }

    public async cancelReservation(request: CancelTicketReservationRequest): Promise<CancelTicketReservationResponse> {
        this.context.validateIfAuthenticated();
        request.validate(this.context.lang);

        await this.cancelTicketsReservation(request.tickets);

        return new CancelTicketReservationResponse();
    }

    public async checkBoughtTicketsStatus(request: CheckBoughtTicketsStatusRequest){
        // const shoppingCart = await this.shoppingCartRepository.getById(request.shoppingCartId);-

        // Guard.isTruthy(shoppingCart, `Shopping cart was not found for id: ${request.shoppingCartId}.`);

        //FOR NOW THIS METHOD WILL NOT BE USED, INSTEAD WE WILL USE:
        // confirmPaymentIntent FROM PaymentController    

    }


    public async startBuyTicketFlow(request: PayTicketsRequest): Promise<PayTicketsResponse> {
        this.context.validateIfAuthenticated();

        let shoppingCart: ShoppingCart = await this.buyTicketFlow.startFlow(request);

        if (request.ticketsToCancel) {
            await this.cancelTicketsReservation(request.ticketsToCancel);
        }
        
        let response: PayTicketsResponse = new PayTicketsResponse();
        response.paymentIntentId = shoppingCart ? shoppingCart.paymentIntentId : null;
        response.paymentIntentClientSecret  = shoppingCart ? shoppingCart.paymentIntentClientSecret : null;
        response.shoppingCartId = shoppingCart ? shoppingCart._id.toString() : null;
        response.country =  this.isoCodeProvider.getIsoCode(this.context.country);

        return response;
    }

    private async cancelTicketsReservation(tickets: Array<string>): Promise<void> {
        for (let i = 0; i < tickets.length; i++) {
            const ticketId = tickets[i];

            let ticket: ITicketValue = await this.ticketRepository.getTicketById(ticketId);

            if (ticket && ticket.status == TicketStatus.ForSale && ticket.reservedOn && ticket.reservedOn == this.context.userId) {
                ticket.reservedOn = null;
                ticket.reservationExpirationDate = null;

                await this.ticketRepository.updateObjectById(ticketId, new TicketDbObject(ticket));
            }
        }
    }

    private async getBestCloseTickets(ticket: ITicketValue, n: number): Promise<Array<ITicketValue>> {
        let searchRequest: SearchTicketRepoRequest = new SearchTicketRepoRequest();
        searchRequest.eventName = ticket.eventName;
        searchRequest.date = ticket.date;
        searchRequest.beginTime = ticket.beginTime;
        searchRequest.categories = [ticket.category.toString()];
        searchRequest.status = new Array<TicketStatus>();
        searchRequest.status.push(TicketStatus.ForSale);
        searchRequest.marketplace = true;
        searchRequest.userId = this.context.userId;
        searchRequest.notInTicketIds = [ticket._id];

        // TODO add area criteria

        let searchTicketsResponse = await this.ticketRepository.search(searchRequest);
        let tickets = searchTicketsResponse.tickets;

        let bestCloseTickets: Array<ITicketValue> = [];

        if (tickets && tickets.length > 1) {
            let mainTicketSeatInfo = ticket.seat.split(',');

            if (mainTicketSeatInfo.length == 2 && !isNaN(parseInt(mainTicketSeatInfo[0])) && !isNaN(parseInt(mainTicketSeatInfo[1]))) {
                let mainTicketSeat = mainTicketSeatInfo[0];
                let mainTicketRow = mainTicketSeatInfo[1];
                
                tickets = tickets.filter(this.checkSeatAndRow(mainTicketSeat, mainTicketRow));
                tickets = tickets.sort(this.compareEuclideanDistance(mainTicketSeat, mainTicketRow));
            }

            bestCloseTickets = tickets.slice(0, n);
        }

        return bestCloseTickets;
    }

    private checkSeatAndRow(mainTicketSeat: any, mainTicketRow: any) {
        return async function(ticket: ITicketValue) {
            const MAX_SEAT_DISTANCE = await this.configService.getConfig('maxSeatDistance', 10);
            const MAX_ROW_DISTANCE = await this.configService.getConfig('maxRowDistance', 2);
            let seatInfo = ticket.seat.split(',');
            let seat = seatInfo[0] as any;
            let row = seatInfo[1] as any;

            return (
                Math.abs(mainTicketSeat-seat) <= MAX_SEAT_DISTANCE 
                && Math.abs(mainTicketRow-row) <= MAX_ROW_DISTANCE
            );
        }
    }

    private compareEuclideanDistance(mainTicketSeat: any, mainTicketRow: any) {
        return function(t1: ITicketValue, t2: ITicketValue) {
            let seatInfo1 = t1.seat.split(',');
            let seat1 = seatInfo1[0] as any;
            let row1 = seatInfo1[1] as any;

            let seatInfo2 = t2.seat.split(',');
            let seat2 = seatInfo2[0] as any;
            let row2 = seatInfo2[1] as any;

            return Math.sqrt(Math.pow(mainTicketSeat - seat1, 2) + Math.pow(mainTicketRow - row1, 2)) 
            - Math.sqrt(Math.pow(mainTicketSeat - seat2, 2) + Math.pow(mainTicketRow - row2, 2));
        }
    }
}