import moment = require("moment");
import { IUserContext } from "../../common/user-context";
import { TicketTransactionType } from "../../models/ticket-transaction-type";
import { UserActivityType } from "../../models/user-activity-type";
import { UserType } from "../../models/user-type";
import { IOrganizerRepository } from "../../organizer/organizer-repository";
import { IIncomingTicketsVsPersonalizedTicketsPerYearReportResultRepository } from "../../report-results/incoming-tickets-vs-personalized-tickets-per-year/incoming-tickets-vs-personalized-tickets-per-year-report-result-repository";
import { IncomingTicketsVsPersonalizedTicketsPerYearReportResultDbObject } from "../../report-results/incoming-tickets-vs-personalized-tickets-per-year/incoming-tickets-vs-personalized-tickets-per-year-report-result-db-object";
import { UsersRegisteredVsUsersVerifiedPerYearReportResultDbObject } from "../../report-results/users-registered-vs-users-verified-per-year/users-registered-vs-users-verified-per-year-report-result-db-object";
import { IUsersRegisteredVsUsersVerifiedPerYearReportResultRepository } from "../../report-results/users-registered-vs-users-verified-per-year/users-registered-vs-users-verified-per-year-report-result-repository";
import { GetTicketsCountForCustomTimePeriodRepoRequest } from "../../ticket-transactions/models/get-tickets-count-for-custom-time-period-repo-request";
import { ITicketTransactionRepository } from "../../ticket-transactions/ticket-transaction-repository";
import { ITicketRepository } from "../../tickets/ticket-repository";
import { GetUsersCountForCustomTimePeriodRepoRequest } from "../../user-activity-log/models/get-users-count-for-custom-time-period-repo-request";
import { IUserActivityLogRepository } from "../../user-activity-log/user-activity-log-repository";
import { IUserRepository } from "../../user/user-repository";
import { GetIncomingTicketsPerOrganizerPerMonthResponse, GetIncomingTicketsPerOrganizerResponse } from "./models/get-incoming-tickets-per-organizer-response";
import { GetIncomingTicketsVsPersonalizedTicketsPerYearResponse, GetIncomingTicketsVsPersonalizedTicketsResponse } from "./models/get-incoming-tickets-vs-personalized-tickets-response";
import { GetIncomingTicketsVsPersonalizedTicketsRequest } from "./models/get-incoming-tickets-vs-personlized-tickets-request";
import { GetTotalResponse } from "./models/get-total-reponse";
import { GetUsersRegisteredVsUsersVerifiedRequest } from "./models/get-users-registered-vs-users-verified-request";
import { GetUsersRegisteredVsUsersVerifiedPerYearResponse, GetUsersRegisteredVsUsersVerifiedResponse } from "./models/get-users-registred-vs-users-verified-response";
import { ReportResultMatchType } from "./models/report-result-match-type";
import { IIncomingTicketsPerOrganizerReportResultRepository } from "../../report-results/incoming-tickets-per-organizer/incoming-tickets-per-organizer-report-result-repository";
import { IncomingTicketsPerOrganizerReportResultDbObject } from "../../report-results/incoming-tickets-per-organizer/incoming-tickets-per-organizer-report-result-db-object";

export interface IDashboardController {
    getTotalUsersRegistered(): Promise<GetTotalResponse>;
    getTotalUsersVerified(): Promise<GetTotalResponse>;
    getTotalUsersVerifiedInclBankAccount(): Promise<GetTotalResponse>;
    getTotalMainAccountsWithLinkedAccounts(): Promise<GetTotalResponse>;
    getTotalLinkedAccountsUsers(): Promise<GetTotalResponse>;
    getTotalLinkedAccountsWithPassword(): Promise<GetTotalResponse>;
    getTotalIncomingTickets(): Promise<GetTotalResponse>;
    getTotalPersonalizedTickets(): Promise<GetTotalResponse>;
    getTotalActiveOrganizers(): Promise<GetTotalResponse>;

    getUsersRegisteredVsUsersVerified(request: GetUsersRegisteredVsUsersVerifiedRequest): Promise<GetUsersRegisteredVsUsersVerifiedResponse>;

    getIncomingTicketsVsPersonalizedTickets(request: GetIncomingTicketsVsPersonalizedTicketsRequest): Promise<GetIncomingTicketsVsPersonalizedTicketsResponse>;

    getIncomingTicketsPerOrganizer(): Promise<GetIncomingTicketsPerOrganizerResponse>;
}

export class DashboardController implements IDashboardController {
    constructor(
        private context: IUserContext,
        private userRepository: IUserRepository,
        private ticketRepository: ITicketRepository,
        private organizerRepository: IOrganizerRepository,
        private userActivityLogRepository: IUserActivityLogRepository,
        private ticketTransactionRepository: ITicketTransactionRepository,
        private usersRegisteredVsUsersVerifiedRepository: IUsersRegisteredVsUsersVerifiedPerYearReportResultRepository,
        private incomingTicketsVsPersonalizedTicketRepository: IIncomingTicketsVsPersonalizedTicketsPerYearReportResultRepository,
        private incomingTicketsPerOrganizerRepository: IIncomingTicketsPerOrganizerReportResultRepository
    ) { }

    public async getTotalUsersRegistered(): Promise<GetTotalResponse> {
        this.context.validateIfAuthenticated();
        this.context.validateAuthorization([UserType.Admin, UserType.SuperAdmin, UserType.SupportLevel1, UserType.SupportLevel2, UserType.EventManager]);

        const response: GetTotalResponse = new GetTotalResponse();
        response.total = await this.userRepository.getTotalUsersRegistered();

        return response;
    }

    public async getTotalUsersVerified(): Promise<GetTotalResponse> {
        this.context.validateIfAuthenticated();
        this.context.validateAuthorization([UserType.Admin, UserType.SuperAdmin, UserType.SupportLevel1, UserType.SupportLevel2, UserType.EventManager]);

        const response: GetTotalResponse = new GetTotalResponse();
        response.total = await this.userRepository.getTotalUsersVerified();

        return response;
    }

    public async getTotalUsersVerifiedInclBankAccount(): Promise<GetTotalResponse> {
        this.context.validateIfAuthenticated();
        this.context.validateAuthorization([UserType.Admin, UserType.SuperAdmin, UserType.SupportLevel1, UserType.SupportLevel2, UserType.EventManager]);

        const response: GetTotalResponse = new GetTotalResponse();
        response.total = await this.userRepository.getTotalUsersVerifiedInclBankAccount();

        return response;
    }

    public async getTotalMainAccountsWithLinkedAccounts(): Promise<GetTotalResponse> {
        this.context.validateIfAuthenticated();
        this.context.validateAuthorization([UserType.Admin, UserType.SuperAdmin, UserType.SupportLevel1, UserType.SupportLevel2, UserType.EventManager]);

        const response: GetTotalResponse = new GetTotalResponse();
        response.total = await this.userRepository.getTotalMainAccountsWithLinkedAccounts();

        return response;
    }

    public async getTotalLinkedAccountsUsers(): Promise<GetTotalResponse> {
        this.context.validateIfAuthenticated();
        this.context.validateAuthorization([UserType.Admin, UserType.SuperAdmin, UserType.SupportLevel1, UserType.SupportLevel2, UserType.EventManager]);

        const response: GetTotalResponse = new GetTotalResponse();
        response.total = await this.userRepository.getTotalLinkedAccountsUsers();

        return response;
    }

    public async getTotalLinkedAccountsWithPassword(): Promise<GetTotalResponse> {
        this.context.validateIfAuthenticated();
        this.context.validateAuthorization([UserType.Admin, UserType.SuperAdmin, UserType.SupportLevel1, UserType.SupportLevel2, UserType.EventManager]);

        const response: GetTotalResponse = new GetTotalResponse();
        response.total = await this.userRepository.getTotalLinkedAccountsWithPassword();

        return response;
    }

    public async getTotalIncomingTickets(): Promise<GetTotalResponse> {
        this.context.validateIfAuthenticated();
        this.context.validateAuthorization([UserType.Admin, UserType.SuperAdmin, 
            UserType.SupportLevel1, UserType.SupportLevel2,
            UserType.Organizer, UserType.EventManager
        ]);

        const organizerId = this.context.organizerId || null;
    
        const response: GetTotalResponse = new GetTotalResponse();
        response.total = await this.ticketRepository.getTotalIncomingTickets(organizerId);

        return response;
    }

    public async getTotalPersonalizedTickets(): Promise<GetTotalResponse> {
        this.context.validateIfAuthenticated();
        this.context.validateAuthorization([UserType.Admin, UserType.SuperAdmin, 
            UserType.SupportLevel1, UserType.SupportLevel2,
            UserType.Organizer, UserType.EventManager
        ]);

        const response: GetTotalResponse = new GetTotalResponse();

        const organizerId = this.context.organizerId || null;

        response.total = await this.ticketRepository.getTotalPersonalizedTickets(organizerId);

        return response;
    }

    public async getTotalActiveOrganizers(): Promise<GetTotalResponse> {
        this.context.validateIfAuthenticated();
        this.context.validateAuthorization([UserType.Admin, UserType.SuperAdmin, UserType.SupportLevel1, UserType.SupportLevel2, UserType.EventManager]);

        const response: GetTotalResponse = new GetTotalResponse();
        response.total = await this.organizerRepository.getTotalActiveOrganizers();

        return response;
    }

    public async getUsersRegisteredVsUsersVerified(request: GetUsersRegisteredVsUsersVerifiedRequest): Promise<GetUsersRegisteredVsUsersVerifiedResponse> {
        this.context.validateIfAuthenticated();
        this.context.validateAuthorization([UserType.Admin, UserType.SuperAdmin, UserType.SupportLevel1, UserType.SupportLevel2, UserType.EventManager]);

        const response: GetUsersRegisteredVsUsersVerifiedResponse = new GetUsersRegisteredVsUsersVerifiedResponse();
        response.data = [];
        let data = null;

        if (request && request.fromDate && request.toDate) {
            const repoRequest: GetUsersCountForCustomTimePeriodRepoRequest = new GetUsersCountForCustomTimePeriodRepoRequest();
            repoRequest.fromDate = request.fromDate;
            repoRequest.toDate = request.toDate;
            repoRequest.activityType = UserActivityType.EmailVerified;

            response.data[0] = new GetUsersRegisteredVsUsersVerifiedPerYearResponse();
            response.data[0].usersRegisteredCount = await this.userActivityLogRepository.getUsersCountForCustomTimePeriod(repoRequest);

            repoRequest.activityType = UserActivityType.IdVerified;

            response.data[0].usersVerifiedCount = await this.userActivityLogRepository.getUsersCountForCustomTimePeriod(repoRequest);

            return response;

        }
        else {
            data = await this.usersRegisteredVsUsersVerifiedRepository.getAll();

            if (!data) {

                //for previous years
                const groupedUsersPerYear =
                    await this.userActivityLogRepository.getUsersRegisteredVsUsersVerifiedGroupedPerYear(ReportResultMatchType.PreviousYears);

                for (let i = 0; i < groupedUsersPerYear.length; i++) {
                    const group = groupedUsersPerYear[i];

                    const reportResult = new UsersRegisteredVsUsersVerifiedPerYearReportResultDbObject();
                    reportResult.usersRegisteredCount = group['userRegisteredCount'];
                    reportResult.usersVerifiedCount = group['userVerifiedCount'];
                    reportResult.year = group['_id'];

                    await this.usersRegisteredVsUsersVerifiedRepository.create(reportResult);
                }

                data = await this.usersRegisteredVsUsersVerifiedRepository.getAll();

            }
            else {
                const years = data.map(g => { return g.year });

                //for previous year; first request in new year
                const prev = moment().year() - 1;
                const maxPrevYear = Math.max.apply(Math, years);

                if (maxPrevYear != prev) {
                    const group = await this.userActivityLogRepository.getUsersRegisteredVsUsersVerifiedGroupedPerYear(ReportResultMatchType.PreviousYear);

                    if (group && group.length > 0) {
                        const reportResult = new UsersRegisteredVsUsersVerifiedPerYearReportResultDbObject();
                        reportResult.usersRegisteredCount = group[0]['userRegisteredCount'];
                        reportResult.usersVerifiedCount = group[0]['userVerifiedCount'];
                        reportResult.year = group[0]['_id'];

                        await this.usersRegisteredVsUsersVerifiedRepository.create(reportResult);
                        data = await this.usersRegisteredVsUsersVerifiedRepository.getAll();
                    }

                }
            }
        }

        for (let i = 0; i < data.length; i++) {
            const reportResult = data[i];
            const datumResponse = new GetUsersRegisteredVsUsersVerifiedPerYearResponse();
            datumResponse.year = reportResult.year;
            datumResponse.usersVerifiedCount = reportResult.usersVerifiedCount;
            datumResponse.usersRegisteredCount = reportResult.usersRegisteredCount;

            response.data.push(datumResponse);
        }

        //for current year
        const reportResult = await this.userActivityLogRepository.getUsersRegisteredVsUsersVerifiedGroupedPerYear(ReportResultMatchType.CurrentYear);

        if(reportResult && reportResult.length > 0) {
            const datumResponse = new GetUsersRegisteredVsUsersVerifiedPerYearResponse();
            datumResponse.year = reportResult[0]['_id'];
            datumResponse.usersVerifiedCount = reportResult[0]['userVerifiedCount'];
            datumResponse.usersRegisteredCount = reportResult[0]['userRegisteredCount'];
    
            response.data.push(datumResponse);
        }
       
        return response;
    }

    public async getIncomingTicketsVsPersonalizedTickets(request: GetIncomingTicketsVsPersonalizedTicketsRequest): Promise<GetIncomingTicketsVsPersonalizedTicketsResponse> {
        this.context.validateIfAuthenticated();
        this.context.validateAuthorization([UserType.Admin, UserType.SuperAdmin, UserType.SupportLevel1, UserType.SupportLevel2, UserType.Organizer, UserType.EventManager]);

        const response: GetIncomingTicketsVsPersonalizedTicketsResponse = new GetIncomingTicketsVsPersonalizedTicketsResponse();
        response.data = [];
        let data = null;

        if (request && request.fromDate && request.toDate) {
            const repoRequest: GetTicketsCountForCustomTimePeriodRepoRequest = new GetTicketsCountForCustomTimePeriodRepoRequest();
            repoRequest.fromDate = request.fromDate;
            repoRequest.toDate = request.toDate;
            repoRequest.transactionType = [TicketTransactionType.TicketCreatedFromExternalSystem];

            if (this.context.isOrganizer()) {
                repoRequest.organizerId = this.context.organizerId;
            }

            response.data[0] = new GetIncomingTicketsVsPersonalizedTicketsPerYearResponse();

            response.data[0].incomingTicketsCount = await this.ticketTransactionRepository.getTicketsCountForCustomTimePeriod(repoRequest);

            repoRequest.transactionType = [TicketTransactionType.TicketPesonalized, TicketTransactionType.TicketAssignedAndPersonalized];

            response.data[0].personalizedTicketsCount = await this.ticketTransactionRepository.getTicketsCountForCustomTimePeriod(repoRequest);


            return response;
        }

        const organizerId = this.context.organizerId || null;

        data = await this.incomingTicketsVsPersonalizedTicketRepository.getAll(organizerId);

        if (data.length == 0) {

            //for previous years
            const groupedUsersPerYear =
                await this.ticketTransactionRepository.getIncomingTicektsVsPersonalizedTicketsGroupedPerYear(ReportResultMatchType.PreviousYears, organizerId);

            for (let i = 0; i < groupedUsersPerYear.length; i++) {
                const group = groupedUsersPerYear[i];

                const reportResult = new IncomingTicketsVsPersonalizedTicketsPerYearReportResultDbObject();
                reportResult.incomingTicketsCount = group['incomingTicketsCount'];
                reportResult.personalizedTicketsCount = group['personalizedTicketsCount'];
                reportResult.year = group['_id'];
                reportResult.organizerId = organizerId || null;

                await this.incomingTicketsVsPersonalizedTicketRepository.create(reportResult);
            }

            data = await this.incomingTicketsVsPersonalizedTicketRepository.getAll(organizerId);

        }
        else {
            const years = data.map(g => { return g.year });

            //for previous year; first request in new year
            const prev = moment().year() - 1;
            const maxPrevYear = Math.max.apply(Math, years);

            if (maxPrevYear != prev) {
                const group = await this.ticketTransactionRepository.getIncomingTicektsVsPersonalizedTicketsGroupedPerYear(ReportResultMatchType.PreviousYear, organizerId);

                if (group && group.length > 0) {
                    const reportResult = new IncomingTicketsVsPersonalizedTicketsPerYearReportResultDbObject();
                    reportResult.incomingTicketsCount = group[0]['incomingTicketsCount'];
                    reportResult.personalizedTicketsCount = group[0]['personalizedTicketsCount'];
                    reportResult.year = group[0]['_id'];
                    reportResult.organizerId = organizerId || null;

                    await this.incomingTicketsVsPersonalizedTicketRepository.create(reportResult);
                    data = await this.incomingTicketsVsPersonalizedTicketRepository.getAll(organizerId);
                }

            }
        }


        for (let i = 0; i < data.length; i++) {
            const reportResult = data[i];
            const datumResponse = new GetIncomingTicketsVsPersonalizedTicketsPerYearResponse();
            datumResponse.year = reportResult.year;
            datumResponse.incomingTicketsCount = reportResult.incomingTicketsCount;
            datumResponse.personalizedTicketsCount = reportResult.personalizedTicketsCount;

            response.data.push(datumResponse);
        }

        //for current year
        const reportResult = await this.ticketTransactionRepository.getIncomingTicektsVsPersonalizedTicketsGroupedPerYear(ReportResultMatchType.CurrentYear, organizerId);
 
        if (reportResult && reportResult.length) {
            const datumResponse = new GetIncomingTicketsVsPersonalizedTicketsPerYearResponse();
            datumResponse.year = reportResult[0]['_id'];
            datumResponse.incomingTicketsCount = reportResult[0]['incomingTicketsCount'];
            datumResponse.personalizedTicketsCount = reportResult[0]['personalizedTicketsCount'];

            response.data.push(datumResponse);
        }
 

        return response;
    }

    public async getIncomingTicketsPerOrganizer(): Promise<GetIncomingTicketsPerOrganizerResponse> {
        this.context.validateIfAuthenticated();
        this.context.validateAuthorization([UserType.Admin, UserType.SuperAdmin, UserType.SupportLevel1, UserType.SupportLevel2, UserType.Organizer, UserType.EventManager]);

        let response: GetIncomingTicketsPerOrganizerResponse = new GetIncomingTicketsPerOrganizerResponse();
        response.incomingTicketsCountPerOrganizer = [];

        let data = await this.incomingTicketsPerOrganizerRepository.getAll();

        if (data.length == 0) {
            //for previous months
            const ticketsCountPerOrganizer = await this.ticketTransactionRepository.getIncomingTicketsGroupedPerMonthAndOrganizer(ReportResultMatchType.PreviousMonths);

            if (ticketsCountPerOrganizer) {
                for (let i = 0; i < ticketsCountPerOrganizer.length; i++) {
                    const count = ticketsCountPerOrganizer[i];

                    const res: IncomingTicketsPerOrganizerReportResultDbObject = new IncomingTicketsPerOrganizerReportResultDbObject();
                    res.year = count['_id']['year'];
                    res.month = count['_id']['month'];
                    res.organizerId = count['_id']['organizerId'];
                    res.incomingTicketsCount = count['incomingTicketsCount'];
                    await this.incomingTicketsPerOrganizerRepository.create(res);

                }
            }

            data = await this.incomingTicketsPerOrganizerRepository.getAll();

        }
        else {
            const years = data.map(g => { return g.year });
            const months = data.map(g => { return g.month });
            //for previous month; first request in new month
            const prevMoment = moment().add(-1);
            const prevYear = prevMoment.year();
            const maxPrevYear = Math.max.apply(Math, years);

            const prevMonth = prevMoment.month();
            const maxPrevMonth = Math.max.apply(Math, months);

            if (maxPrevYear != prevYear || maxPrevMonth != prevMonth) {
                const group = await this.ticketTransactionRepository.getIncomingTicketsGroupedPerMonthAndOrganizer(ReportResultMatchType.PreviousMonth);

                if (group && group.length) {
                    const reportResult = new IncomingTicketsPerOrganizerReportResultDbObject();
                    reportResult.incomingTicketsCount = group[0]['incomingTicketsCount'];
                    reportResult.year = group[0]['_id']['year'];
                    reportResult.month = group[0]['_id']['month'];
                    reportResult.organizerId = group[0]['_id']['organizerId'];

                    await this.incomingTicketsPerOrganizerRepository.create(reportResult);
                    data = await this.incomingTicketsPerOrganizerRepository.getAll();
                }

            }
        }

        if (data.length > 0) {

            if (this.context.isOrganizer()) {
                data = data.filter(n => n.organizerId === this.context.organizerId);
            }

            for (let i = 0; i < data.length; i++) {
                const reportResult = data[i];
                const datumResponse = new GetIncomingTicketsPerOrganizerPerMonthResponse();
                datumResponse.year = reportResult.year;
                datumResponse.month = reportResult.month;
                datumResponse.incomingTicketsCount = reportResult.incomingTicketsCount;
                datumResponse.organizerId = reportResult.organizerId;

                const organizer = await this.organizerRepository.getOrganizerById(reportResult.organizerId);

                if (organizer) {
                    datumResponse.organizer = organizer.companyName;
                    response.incomingTicketsCountPerOrganizer.push(datumResponse); 
                }
            }
        }


        //for current year
        let count = await this.ticketTransactionRepository.getIncomingTicketsGroupedPerMonthAndOrganizer(ReportResultMatchType.CurrentMonth);

        if (count) {
            if (this.context.isOrganizer()) {
                count = count.filter(n => n.organizerId === this.context.organizerId);
            }

            for (let i = 0; i < count.length; i++) {
                const res: GetIncomingTicketsPerOrganizerPerMonthResponse = new GetIncomingTicketsPerOrganizerPerMonthResponse();

                res.year = count[i]['_id']['year'];
                res.month = count[i]['_id']['month'];
                res.organizer = count[i]['_id']['organizerName'];
                res.organizerId = count[i]['_id']['organizerId'];
                res.incomingTicketsCount = count[i]['incomingTicketsCount'];

                response.incomingTicketsCountPerOrganizer.push(res);
            }
        }

        return response;
    }
}