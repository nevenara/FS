import moment = require("moment-timezone");
import path = require("path");
import { promises as fs } from 'fs';
import { AuthenticationService } from "../basic-auth/authentication-service";
import { CheckInDbObject } from "../check-in-list/check-in-db-object";
import { ICheckInRepository } from "../check-in-list/check-in-repository";
import { ICheckInValue } from "../check-in-list/check-in-value";
import { ConfigService } from "../common/config-service";
import { ValidationError } from "../common/errors/validation-error";
import { IScannerContext } from "../common/scanner-context";
import { Environment } from "../environment";
import { IEventRepository } from "../events/event-repository";
import { ISessionStore } from "../http/session/session-store";
import { LocalisationKey } from "../localisation/localisation-key";
import { LocalisationProvider } from "../localisation/localisation-provider";
import { CheckInFailureReasonType } from "../models/check-in-failure-reason-type";
import { CheckInTicketStatus } from "../models/check-in-ticket-status";
import { UserStatus } from "../models/user-status";
import { UserType } from "../models/user-type";
import { VerificationStatusType } from "../models/verification-status-type";
import { ISelfieImageRepository } from "../selfie-image/selfie-image-repository";
import { ISelfieImageValue } from "../selfie-image/selfie-image-value";
import { SessionLogDbObject } from "../session-log/session-log-db-object";
import { ISessionLogRepository } from "../session-log/session-log-repository";
import { InputDateParameterParseUtil } from "../tickets/model/input-date-parameter-parse";
import { ITicketValue } from "../tickets/model/ticket";
import { TicketDbObject } from "../tickets/model/ticket-db-object";
import { TicketStatus } from "../tickets/model/ticket-status";
import { ITicketRepository } from "../tickets/ticket-repository";
import { UserDbObject } from "../user/user-db-object";
import { IUserRepository } from "../user/user-repository";
import { IUserValue } from "../user/user-value";
import { GetEventDetailsResponse } from "./models/get-event-details-response";
import { LoginRequest } from "./models/login-request";
import { LoginResponse } from "./models/login-response";
import { NoFacematchRequest } from "./models/no-facematch-request";
import { ScanCodeRequest } from "./models/scan-code-request";
import { ScanCodeResponse } from "./models/scan-code-response";
import { SearchCheckInListRepoRequest } from "./models/search-check-in-list-repo-request";
import { SearchCheckInListRequest } from "./models/search-check-in-list-request";
import { CheckInResponse, SearchCheckInListResponse } from "./models/search-check-in-list-response";

export interface IScannerController {
    getSelfieImage(ticketId: string): Promise<ISelfieImageValue>;
    search(request: SearchCheckInListRequest): Promise<SearchCheckInListResponse>;
    scanCode(request: ScanCodeRequest): Promise<ScanCodeResponse>;
    login(request: LoginRequest, userAgent: string): Promise<LoginResponse>;
    logout();
    getEventDetails(): Promise<GetEventDetailsResponse>;
    noFacematch(request: NoFacematchRequest);
    qrInvalid();
    getEventImage(): Promise<any>;
    getDefaultEventImage(): Promise<any>;
    getDefaultSelfieImage(header: boolean): Promise<any>;
}

export class ScannerController implements IScannerController {
    public lang: string = 'en';
    public static ALLOWED_USER_TYPES = [UserType.SuperAdmin, UserType.SupportLevel1];

    constructor(
        private context: IScannerContext, 
        private userRepository: IUserRepository,
        private localisationProvider: LocalisationProvider,
        private authenticationService: AuthenticationService,
        private sessionLogRepository: ISessionLogRepository,
        private sessionStore: ISessionStore,
        private eventRepository: IEventRepository,
        private ticketRepository: ITicketRepository,
        private configService: ConfigService,
        private checkInRepository: ICheckInRepository,
        private selfieImageRepository: ISelfieImageRepository
    ) { }
   
    public async getSelfieImage(ticketId: string): Promise<ISelfieImageValue> {
        this.context.validateIfAuthenticated();

        const ticket = await this.ticketRepository.getTicketById(ticketId);
        if (!ticket || ticket.eventId != this.context.eventId){
            throw new ValidationError(LocalisationKey.TicketDoesNotExist);
        }

        const selfieImage = await this.selfieImageRepository.getSelfieImageByUserId(ticket.userId);
        return selfieImage;
    }
    
    public async search(request: SearchCheckInListRequest): Promise<SearchCheckInListResponse> {
        this.context.validateIfAuthenticated();

        const timeZone = await this.configService.getConfig("timeZone", "Europe/Vienna");

        
        const LIMIT = request.limit || await this.configService.getConfig('pageLimit', 10);
        const response = new SearchCheckInListResponse();
        response.checkIns = [];

        request.limit = request.limit || LIMIT;
        request.page = request.page || 1;

        const repoRequest = new SearchCheckInListRepoRequest(request);

        repoRequest.ticketStatus = [];
        repoRequest.eventId = this.context.eventId;

        if(request.textSearch && request.textSearch.trim() != ""){
            const regex = new RegExp(request.textSearch, "i");
            if(CheckInTicketStatus.Personalized.match(regex)){
                repoRequest.ticketStatus.push(TicketStatus.Personalized);
            }

            if(CheckInTicketStatus.CheckedIn.match(regex)) {
                repoRequest.ticketStatus.push(TicketStatus.CheckedIn);
            }

        }
        else{
            repoRequest.noStatus = true;
            repoRequest.ticketStatus =  [TicketStatus.Personalized, TicketStatus.CheckedIn];            
        }

        const res = await this.checkInRepository.search(repoRequest);
        for (let i = 0; i < res.checkIns.length; i++) {
            const checkIn = res.checkIns[i];
            
            const checkInRes = new CheckInResponse();
            checkInRes.id = checkIn.id;
            checkInRes.ticketId = checkIn.ticketId;
            checkInRes.ticketStatus = checkIn.ticketStatus;
            checkInRes.verificationStatus = checkIn.verificationStatus;
            checkInRes.firstName = checkIn.firstName;
            checkInRes.lastName = checkIn.lastName;
            checkInRes.reason = checkIn.reason;
            checkInRes.date = InputDateParameterParseUtil.getDateInTimeZone(checkIn.date, timeZone);

            response.checkIns.push(checkInRes);
        }

        response.totalPages = res.totalPages;
        response.totalRecords = res.totalRecords;

        return response;
    }

    public async scanCode(request: ScanCodeRequest): Promise<ScanCodeResponse> {
        this.context.validateIfAuthenticated();
        request.validate(this.lang);

        const ticket: ITicketValue = await this.ticketRepository.getTicketByQRUuid(request.qrUuid);
        const response = new ScanCodeResponse();

        const checkIn = new CheckInDbObject();

        if(!ticket){
            checkIn.status = VerificationStatusType.Invalid;
            checkIn.reason = CheckInFailureReasonType.NoMatch;
        }
        else {
            if(ticket.eventId != this.context.eventId) {
                throw new ValidationError(LocalisationKey.TicketDoesNotExist);
            }
            response.id = ticket._id;
            response.ticketId = ticket.ticketId;
            response.firstName = ticket.firstName;
            response.lastName = ticket.lastName;
            checkIn.ticketId = ticket._id;

            if(ticket.status == TicketStatus.CheckedIn) {
                checkIn.status = VerificationStatusType.Invalid;
                checkIn.reason = CheckInFailureReasonType.QrAlreadyScanned;
                checkIn.ticketId = ticket._id;
            }
            else {
                if(ticket.status != TicketStatus.Personalized){
                    throw new ValidationError(LocalisationKey.TicketNotPersonalized);
                }
                checkIn.status = VerificationStatusType.Valid;

                ticket.status = TicketStatus.CheckedIn;
                await this.ticketRepository.updateObjectById(ticket._id, new TicketDbObject(ticket));
        
                
            }
        }
       

        checkIn.date = new Date();
        checkIn.eventId = this.context.eventId;

        await this.checkInRepository.create(checkIn);

        response.verificationStatus = checkIn.status;
        response.reason = checkIn.status == VerificationStatusType.Invalid ? checkIn.reason : '';
        response.checkInId = checkIn.id;
        return response;
    }

    public async login(request: LoginRequest, userAgent: string): Promise<LoginResponse> {
        request.validate();

        const user: IUserValue = await this.userRepository.getUserByField(UserDbObject.EmailFieldName, request.email);

        if (!user) {
            throw new ValidationError(this.localisationProvider.translate(LocalisationKey.LoginFailed, this.lang));
        }

        if (user.status == UserStatus.Deleted || user.status == UserStatus.Blocked) {
            throw new ValidationError(this.localisationProvider.translate(LocalisationKey.LoginFailed, this.lang));     
        }

        if (!ScannerController.ALLOWED_USER_TYPES.includes(user.usertype)) {
            throw new ValidationError(this.localisationProvider.translate(LocalisationKey.ActionNotAllowed, this.lang));
        }

        const event = await this.eventRepository.getById(request.eventId);

        if (!event) {
            throw new ValidationError(this.localisationProvider.translate(LocalisationKey.EventDoesNotExist, this.lang));
        }

        const loginResponse = new LoginResponse();

        let authResponse = await this.authenticationService.authenticate(user, userAgent, this.lang, request.eventId);
        loginResponse.sessionId = authResponse.sessionId;

        return loginResponse;
    }

    public async logout() {
        this.context.validateIfAuthenticated();

        const session = await this.sessionLogRepository.getSessionBySessionId(this.context.sessionId);

        session.logOutDate = new Date();

        this.sessionLogRepository.updateObjectById(session._id, new SessionLogDbObject(session));

        await this.sessionStore.removeSession(this.context.sessionId);
    }

    public async getEventDetails(): Promise<GetEventDetailsResponse> {
        this.context.validateIfAuthenticated();
        
        let event = await this.eventRepository.getById(this.context.eventId);

        if (!event) {
            throw new ValidationError(this.localisationProvider.translate(LocalisationKey.EventDoesNotExist, this.lang));
        }

        const timeZone = await this.configService.getConfig("timeZone", "Europe/Vienna");

        let response: GetEventDetailsResponse = new GetEventDetailsResponse();

        response.eventName = event.eventName;
        response.eventId = event._id;
        response.date = InputDateParameterParseUtil.getDateInTimeZone(event.date, timeZone);
        response.beginTime = InputDateParameterParseUtil.getDateInTimeZone(event.beginTime, timeZone);
        response.doorsOpen = moment.tz(event.doorsOpen, timeZone).format('HH:mm');
        response.locationName = event.locationName;
        response.locationAddress = event.locationAddress;

        return response;
    }

    public async noFacematch(request: NoFacematchRequest) {
        this.context.validateIfAuthenticated();

        request.validate();

        let checkInLog: ICheckInValue = await this.checkInRepository.getCheckInById(request.checkInId);

        if (!checkInLog) {
            throw new ValidationError(LocalisationKey.checkInDoesNotExist);
        }

        checkInLog.date = new Date();
        checkInLog.status = VerificationStatusType.Invalid;
        checkInLog.reason = CheckInFailureReasonType.NoFacematch;

        await this.checkInRepository.updateObjectById(checkInLog._id, new CheckInDbObject(checkInLog));

        if (checkInLog.ticketId) {
            const ticket = await this.ticketRepository.getTicketById(checkInLog.ticketId);
            if (!ticket){
                throw new ValidationError(LocalisationKey.TicketDoesNotExist);
            }
            ticket.status = TicketStatus.Personalized;
            await this.ticketRepository.updateObjectById(ticket._id, new TicketDbObject(ticket));
        }
    }

    public async qrInvalid() {
        this.context.validateIfAuthenticated();
        
        let checkInLog: CheckInDbObject = new CheckInDbObject();
        
        checkInLog.date = new Date();
        checkInLog.status = VerificationStatusType.Invalid;
        checkInLog.reason = CheckInFailureReasonType.QrInvalid;
        checkInLog.eventId = this.context.eventId;

        await this.checkInRepository.create(checkInLog);
    }

    public async getEventImage(): Promise<any> {
        this.context.validateIfAuthenticated();

        let event = await this.eventRepository.getById(this.context.eventId);

        if (event && event.image) {
            return event.image;
        }
    }

    public async getDefaultEventImage(): Promise<any> {
        this.context.validateIfAuthenticated();

        try {
            let imagePath = Environment.isInsideDocker()
            ? path.join('out', 'src', 'images', 'default-event-image.jpg')
            : path.join('src', 'images', 'default-event-image.jpg');
           
            const image = await fs.readFile(imagePath);
            return image;
        } catch(error) {
            console.log('Default event image not found.');
            throw error;
        }
    }

    public async getDefaultSelfieImage(header: boolean): Promise<any> {
        this.context.validateIfAuthenticated();

        try {
            let imagePath = Environment.isInsideDocker()
            ? path.join('out', 'src', 'images', 'default-profile-image.png')
            : path.join('src', 'images', 'default-profile-image.png');

            if (header) {
                imagePath = Environment.isInsideDocker()
                ? path.join('out', 'src', 'images', 'default-user-header.png')
                : path.join('src', 'images', 'default-user-header.png');
            }
           
            const image = await fs.readFile(imagePath);
            return image;
        } catch(error) {
            console.log('Default profile image not found.');
            throw error;
        }
    }
}