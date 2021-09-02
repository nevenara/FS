import { ConfigService } from "../../common/config-service";
import { ICountryIsoCodeProvider } from "../../common/country-iso-code-provider";
import { IEmailSender } from "../../common/email-service/email-sender";
import { ValidationError } from "../../common/errors/validation-error";
import { Hashing } from "../../common/hashing";
import { IImageCompressor } from "../../common/image-helper";
import { IUserContext } from "../../common/user-context";
import { Environment } from "../../environment";
import { LocalisationKey } from "../../localisation/localisation-key";
import { UserStatus } from "../../models/user-status";
import { UserType } from "../../models/user-type";
import { OrganizerPlaceholderImageDbObject } from "../../organizer-placeholder-image/organizer-placeholder-image-db-object";
import { IOrganizerPlaceholderImageRepository } from "../../organizer-placeholder-image/organizer-placeholder-image-repository";
import { IOrganizerPlaceholderImageValue } from "../../organizer-placeholder-image/organizer-placeholder-image-value";
import { OrganizerDbObject } from "../../organizer/organizer-db-object";
import { IOrganizerRepository } from "../../organizer/organizer-repository";
import { IOrganizerValue } from "../../organizer/organizer-value";
import { PasswordRecoveryInitRequest } from "../../password-recovery/models/password-recovery-init-request";
import { IPasswordRecoveryController } from "../../password-recovery/password-recovery-controller";
import { SearchAdminPanelTicketsRepoRequest } from "../../tickets/model/search-admin-panel-tickets-repo-request";
import { SearchTicketsResponse } from "../../tickets/model/search-ticket-response";
import { TicketStatus } from "../../tickets/model/ticket-status";
import { TicketStatusAdminPanel } from "../../tickets/model/ticket-status-admin-panel";
import { ITicketRepository } from "../../tickets/ticket-repository";
import { DeleteUserResponse } from "../../user-profile/models/delete-user-response";
import { IUserProfileValidator } from "../../user-profile/user-profile-validator";
import { UserDbObject } from "../../user/user-db-object";
import { IUserRepository } from "../../user/user-repository";
import { IUserValue } from "../../user/user-value";
import { AddOrganizerRequest } from "./models/add-organizer-request";
import { AddOrganizerResponse } from "./models/add-organizer-response";
import { DeleteOrganizerImageRequest } from "./models/delete-organizer-image-request";
import { DeleteOrganizerImageResponse } from "./models/delete-organizer-image-response";
import { DeleteOrganizerResponse } from "./models/delete-organizer-response";
import { DeleteOrganizerRequest } from "./models/delete-organizer-reuqest";
import { GetOrganizersAccountSettingRequest } from "./models/get-organizer-account-settings-request";
import { GetOrganizerAccountSettingsResponse } from "./models/get-organizer-account-settings-response";
import { GetOrganizersMainDataRequest } from "./models/get-organizers-main-data-request";
import { Country, GetOrganizersMainDataResponse } from "./models/get-organizers-main-data-response";
import { GetTotalIncomingTicketsPerEventResponse, TotalIncomingTicketsPerEventResponse } from "./models/get-total-incoming-tickets-per-event-response";
import { GetTotalPersonalizedTicketsPerEventResponse, TotalPersonalizedTicketsPerEventResponse } from "./models/get-total-personalized-tickets-response";
import { SearchOrganizersTicketsRequest } from "./models/search-organizers-ticket-list-request";
import { UpdateOrganizerRequest } from "./models/update-organizer-request";
import { UpdateOrganizerResponse } from "./models/update-organizer-response";
import { UploadOrganizerPlaceholderImageRequest } from "./models/upload-organizer-placeholder-image-request";
import { UploadOrganizerPlaceholderImageResponse } from "./models/upload-organizer-placeholder-image-response";
import { IOrganizerValidator } from "./organizers-validator";
import { promises as fs } from 'fs';
import moment = require("moment");
import { ITranslationDataProvider } from "../../localisation/translation-data-provider";
import { ILocalisationProvider } from "../../localisation/localisation-provider";

const path = require('path');

export interface IOrganizersController {
    getDefaultOrganizerImage(): Promise<any>;
    searchTickets(request: SearchOrganizersTicketsRequest): Promise<SearchTicketsResponse>;
    getTotalPersonalizedTicketsPerEvent(): Promise<GetTotalPersonalizedTicketsPerEventResponse>;
    getTotalIncomingTicketsPerEvent(): Promise<GetTotalIncomingTicketsPerEventResponse>;
    getAccountSettings(request: GetOrganizersAccountSettingRequest): Promise<GetOrganizerAccountSettingsResponse>;
    deleteOrganizerImage(request: DeleteOrganizerImageRequest): Promise<DeleteOrganizerImageResponse>;
    deleteOrganizer(request: DeleteOrganizerRequest): Promise<DeleteOrganizerResponse>;
    getImage(organizerId: any): Promise<IOrganizerPlaceholderImageValue>;
    updateOrganizer(request: UpdateOrganizerRequest): Promise<UpdateOrganizerResponse>;
    getMainData(request: GetOrganizersMainDataRequest): Promise<GetOrganizersMainDataResponse>;
    uploadImage(request: UploadOrganizerPlaceholderImageRequest): Promise<UploadOrganizerPlaceholderImageResponse>;
    addOrganizer(request: AddOrganizerRequest): Promise<AddOrganizerResponse>;
}

export class OrganizersController implements IOrganizersController {
    constructor(
        private context: IUserContext,
        private organizerRepository: IOrganizerRepository,
        private organizerPlaceholderImageRepository: IOrganizerPlaceholderImageRepository,
        private organizerValidator: IOrganizerValidator,
        private userValidator: IUserProfileValidator,
        private userRepository: IUserRepository,
        private ticketsRepository: ITicketRepository,
        private passwordRecoveryController: IPasswordRecoveryController,
        private imageCompressor: IImageCompressor,
        private configService: ConfigService,
        private isoCodeProvider: ICountryIsoCodeProvider,
        private localisationProvider: ILocalisationProvider
    ) { }
    
    public async getDefaultOrganizerImage(): Promise<any> {
        try{
            let imagePath = Environment.isInsideDocker()
            ? path.join('out', 'src', 'images', 'default-organizer-image.png')
            : path.join('src', 'images', 'default-organizer-image.png');

           
            const image = await fs.readFile(imagePath);
            return image;
        }
        catch(error){
            console.log('Default event image not found.');
            throw error;
        }
    }

    public async searchTickets(request: SearchOrganizersTicketsRequest): Promise<SearchTicketsResponse> {
        this.context.validateIfAuthenticated();
        this.context.validateIfOrganizer();

        if (request.limit && request.limit > 50) {
            throw new ValidationError(this.localisationProvider.translate(LocalisationKey.LimitPerPageIs50));
        }

        const LIMIT = request.limit || await this.configService.getConfig('pageLimit', 10);

        const response = new SearchTicketsResponse();

        const repoRequest = new SearchAdminPanelTicketsRepoRequest();

        repoRequest.page = request.page || 1;
        repoRequest.limit = LIMIT;

        repoRequest.eventName = request.eventName;
        repoRequest.eventLocation = request.eventLocation;
        repoRequest.fromDate = request.fromDate;
        repoRequest.toDate = request.toDate;
        repoRequest.ticketId = request.ticketId;
        repoRequest.ticketBuyer = request.ticketBuyer;
        repoRequest.ticketHolder = request.ticketHolder;
        repoRequest.bookingId = request.bookingId;
        repoRequest.sortField = request.sortField;
        repoRequest.sortOrder = request.sortOrder;

        const user = await this.userRepository.getUserById(this.context.proxyUserId || this.context.userId);
        const organizer = await this.organizerRepository.getOrganizerById(user.organizerId);

        repoRequest.organizer = organizer.companyName;
        repoRequest.organizerAdminPanel = true;

        if (request.status && request.status.length != 0) {
            repoRequest.status = [];

            if (request.status.includes(TicketStatusAdminPanel.Personalized)) {
                repoRequest.status.push(TicketStatus.Personalized);
                repoRequest.status.push(TicketStatus.ForSale);
                repoRequest.status.push(TicketStatus.RePersonalisationWaiting);
                repoRequest.status.push(TicketStatus.WaitingForPaymentStatus);
            }

            if (request.status.includes(TicketStatusAdminPanel.PersonalizationPending)) {
                repoRequest.status.push(TicketStatus.NonPersonalized);
                repoRequest.personalizationPending = true;
            }

            if (request.status.includes(TicketStatusAdminPanel.BlockedForPickup)) {
                repoRequest.status.push(TicketStatus.NonPersonalized);
                repoRequest.blocked = true;
            }

            if(request.status.includes(TicketStatusAdminPanel.CheckedIn)) {
                repoRequest.status.push(TicketStatus.CheckedIn);
            }

            if(request.status.includes(TicketStatusAdminPanel.PersonalizationFailed)) {
                repoRequest.status.push(TicketStatus.NonPersonalized);
                repoRequest.personalizationFailed = true;
            }
        }

        const res = await this.ticketsRepository.searchAdminPanelTickets(repoRequest);

        response.tickets = res.tickets;
        for (let i = 0; i < response.tickets.length; i++) {
            const t = response.tickets[i];
            let status = null;

            const user = t.userId ? await this.userRepository.getUserById(t.userId) : null;


            if(t.status == TicketStatus.ForSale || t.status == TicketStatus.Personalized || 
                t.status == TicketStatus.RePersonalisationWaiting || t.status == TicketStatus.WaitingForPaymentStatus) {
               status = TicketStatusAdminPanel.Personalized;
            }
            else if(t.status == TicketStatus.CheckedIn) {
                status = TicketStatusAdminPanel.CheckedIn;
            }
            else if (t.status == TicketStatus.NonPersonalized){
                if(user && user.stripeErrors && user.stripeErrors.length ) {
                    status = TicketStatusAdminPanel.PersonalizationFailed;
                }
                else if(t.pendingUsername){
                    status = TicketStatusAdminPanel.PersonalizationPending;
                }
                else if(this.isBlocked(t.syncDate)) {
                    status = TicketStatusAdminPanel.BlockedForPickup;
                }
                else {
                    console.log(t.syncDate)
                    status = TicketStatusAdminPanel.PersonalizationPending;
                }
    
                
            }
            t.status = status;

        }

        response.totalPages = res.totalPages;
        response.totalRecords = res.totalRecords;

        return response;
    }

    public async getTotalPersonalizedTicketsPerEvent(): Promise<GetTotalPersonalizedTicketsPerEventResponse> {
        this.context.validateIfAuthenticated();
        this.context.validateIfOrganizer();

        const user = await this.userRepository.getUserById(this.context.proxyUserId || this.context.userId);

        const groupedTickets: any = await this.ticketsRepository.getTotalTicketsPerEventByOrganizer(user.organizerId, [TicketStatus.Personalized, TicketStatus.ForSale]);

        const response = new GetTotalPersonalizedTicketsPerEventResponse();
        response.data = [];
        for (let i = 0; i < groupedTickets.length; i++) {
            const group = groupedTickets[i];
            const res = new TotalPersonalizedTicketsPerEventResponse();
            res.eventName = group._id.event;
            res.totalPersonalizedTickets = group.amountOfTickets;

            response.data.push(res);
        }
        return response;
    }

    public async getTotalIncomingTicketsPerEvent(): Promise<GetTotalIncomingTicketsPerEventResponse> {
        this.context.validateIfAuthenticated();
        this.context.validateIfOrganizer();

        const user = await this.userRepository.getUserById(this.context.proxyUserId || this.context.userId);

        const groupedTickets: any = await this.ticketsRepository.getTotalTicketsPerEventByOrganizer(user.organizerId, null);

        const response = new GetTotalIncomingTicketsPerEventResponse();
        response.data = [];
        for (let i = 0; i < groupedTickets.length; i++) {
            const group = groupedTickets[i];
            const res = new TotalIncomingTicketsPerEventResponse();
            res.eventName = group._id.event;
            res.totalIncomingTickets = group.amountOfTickets;

            response.data.push(res);
        }
        return response;
    }

    public async getAccountSettings(request: GetOrganizersAccountSettingRequest): Promise<GetOrganizerAccountSettingsResponse> {
        this.context.validateIfAuthenticated();
        this.context.validateAuthorization([UserType.Admin, UserType.SuperAdmin, UserType.SupportLevel1, UserType.SupportLevel2, UserType.EventManager]);

        request.validate(this.context.lang);

        const organizer = await this.organizerRepository.getOrganizerById(request.organizerId);
        const response: GetOrganizerAccountSettingsResponse = new GetOrganizerAccountSettingsResponse();

        response.companyName = organizer.companyName;
        response.email = organizer.email;

        return response;
    }

    public async deleteOrganizerImage(request: DeleteOrganizerImageRequest): Promise<DeleteOrganizerImageResponse> {
        this.context.validateIfAuthenticated();
        this.context.validateAuthorization([UserType.Admin, UserType.SuperAdmin, UserType.SupportLevel1, UserType.SupportLevel2]);

        request.validate(this.context.lang);

        const image: IOrganizerPlaceholderImageValue = await this.organizerPlaceholderImageRepository.getImageByOrganizerId(request.organizerId);

        await this.organizerPlaceholderImageRepository.deleteObjectById(image._id);

        const response: DeleteOrganizerImageResponse = new DeleteOrganizerImageResponse();
        return response;
    }

    public async deleteOrganizer(request: DeleteOrganizerRequest): Promise<DeleteOrganizerResponse> {
        this.context.validateIfAuthenticated();
        this.context.validateAuthorization([UserType.SuperAdmin]);

        request.validate(this.context.lang);

        const organizer = await this.organizerRepository.getOrganizerById(request.organizerId);
        //TODO set some fields to null

        const user = await this.userRepository.getUserByOrganizerId(request.organizerId);
        user.status = UserStatus.Deleted;
        await this.userRepository.updateObjectById(user._id, new UserDbObject(user));

        const response: DeleteUserResponse = new DeleteUserResponse();
        return response;
    }

    public async getImage(organizerId: any): Promise<IOrganizerPlaceholderImageValue> {
        this.context.validateIfAuthenticated();

        let image: IOrganizerPlaceholderImageValue = await this.organizerPlaceholderImageRepository.getImageByOrganizerId(organizerId);

        return image;
    }

    public async updateOrganizer(request: UpdateOrganizerRequest): Promise<UpdateOrganizerResponse> {
        this.context.validateIfAuthenticated();
        this.context.validateAuthorization([UserType.Admin, UserType.SuperAdmin, UserType.EventManager, UserType.SupportLevel2]);

        request.validate(this.context.lang);

        const organizer: IOrganizerValue = await this.organizerRepository.getOrganizerById(request.organizerId);
        if (request.email != organizer.email) {
            await this.userValidator.validateIsUnique('email', request.email.toLowerCase());

            //if email changed, update user
            const user: IUserValue = await this.userRepository.getUserByOrganizerId(request.organizerId);
            user.email = request.email.toLowerCase();
            await this.userRepository.updateObjectById(user._id, new UserDbObject(user));

        }

        organizer.ticketReturn = request.ticketReturn;
        organizer.fansafeSale = request.fansafeSale;
        organizer.linkLomnido = request.linkToLomnidoBridge;

        organizer.address = request.address;
        organizer.revenueSharing = request.revenueSharing;
       
        organizer.contactPerson = request.contactPerson;
        organizer.email = request.email.toLowerCase();
        organizer.url = request.url;
        organizer.postCode = request.postCode;

        organizer.city = request.city;
        organizer.country = request.country;
        organizer.phone = request.phone;

        if(organizer.status != request.status && this.context.userType != UserType.SuperAdmin) {
            throw new ValidationError(this.localisationProvider.translate(LocalisationKey.ActionNotAllowed));
        }
        else {
            organizer.status = request.status;
        }

        await this.organizerRepository.updateObjectById(organizer._id, new OrganizerDbObject(organizer));

        const response: UpdateOrganizerResponse = new UpdateOrganizerResponse();
        return response;
    }

    public async getMainData(request: GetOrganizersMainDataRequest): Promise<GetOrganizersMainDataResponse> {
        this.context.validateIfAuthenticated();
        this.context.validateAuthorization([UserType.Admin, UserType.SuperAdmin, UserType.SupportLevel1, UserType.SupportLevel2, UserType.EventManager]);

        request.validate(this.context.lang);
        const organizer = await this.organizerRepository.getOrganizerById(request.organizerId);
        const response: GetOrganizersMainDataResponse = new GetOrganizersMainDataResponse();

        response.companyName = organizer.companyName;
        response.ticketReturn = organizer.ticketReturn ? organizer.ticketReturn : false;
        response.fansafeSale = organizer.fansafeSale ? organizer.fansafeSale : false;
        response.linkToLomnidoBridge = organizer.linkLomnido;
        response.revenueSharing = organizer.revenueSharing;
        response.status = organizer.status;
        response.contactPerson = organizer.contactPerson;
        response.email = organizer.email;
        response.phone = organizer.phone;
        response.url = organizer.url;
        response.address = organizer.address;
        response.postCode = organizer.postCode;
        response.city = organizer.city;

        response.country = new Country();
        response.country.key = this.isoCodeProvider.getIsoCode(organizer.country || "AT");
        response.country.name = organizer.country || "Austria";


        return response;
    }

    public async uploadImage(request: UploadOrganizerPlaceholderImageRequest): Promise<UploadOrganizerPlaceholderImageResponse> {
        this.context.validateIfAuthenticated();
        this.context.validateAuthorization([UserType.Admin, UserType.SuperAdmin, UserType.SupportLevel1, UserType.SupportLevel2]);
        request.validate(this.context.lang);

        this.organizerValidator.validateOrganizerPlaceholderImage(request);

        let image: IOrganizerPlaceholderImageValue = await this.organizerPlaceholderImageRepository.getImageByOrganizerId(request.organizerId);
        const smallImage = await this.imageCompressor.compressImage(request.image['buffer']);

        if (image) {

            image.image = smallImage || request.image['buffer'];
            image.originalname = request.image['originalname'];
            image.mimetype = request.image['mimetype'];
            image.size = request.image['size'];

            await this.organizerPlaceholderImageRepository.updateObjectById(image._id, new OrganizerPlaceholderImageDbObject(image));
        }
        else {
            const newOrganizerImage = new OrganizerPlaceholderImageDbObject();

            newOrganizerImage.organizerId = request.organizerId;
            newOrganizerImage.image = smallImage || request.image['buffer'];
            newOrganizerImage.originalname = request.image['originalname'];
            newOrganizerImage.mimetype = request.image['mimetype'];
            newOrganizerImage.size = request.image['size'];

            await this.organizerPlaceholderImageRepository.create(newOrganizerImage);
        }

        const response = new UploadOrganizerPlaceholderImageResponse();
        return response;

    }

    public async addOrganizer(request: AddOrganizerRequest): Promise<AddOrganizerResponse> {
        this.context.validateIfAuthenticated();
        this.context.validateAuthorization([UserType.Admin, UserType.SuperAdmin, UserType.EventManager]);

        request.validate(this.context.lang);

        await this.organizerValidator.isCompanyNameUnique(request.companyName);

        await this.userValidator.validateIsUnique('email', request.email.toLowerCase());

        let organizer: OrganizerDbObject = new OrganizerDbObject();
        organizer.email = request.email.toLowerCase();
        organizer.companyName = request.companyName;
        organizer.fansafeSale = request.fansafeSale;
        organizer.contactPerson = request.contactPerson;
        organizer.address = request.address;
        organizer.postCode = request.postCode;
        organizer.city = request.city;
        organizer.country = request.country;
        organizer.phone = request.phone;
        organizer.url = request.url;
        organizer.status = request.status;
        organizer.ticketReturn = request.ticketReturn;
        organizer.revenueSharing = request.revenueSharing;
        organizer.linkLomnido = request.linkLomnido;
        organizer.created = new Date();

        const createResponse = await this.organizerRepository.create(organizer);

        //insert into users collection
        let user: UserDbObject = new UserDbObject();
        user.userType = UserType.Organizer;
        user.email = request.email.toLowerCase();
        user.organizerId = organizer.id;

        await this.userRepository.create(user);

        //image
        if (request.image) {
            const image = new OrganizerPlaceholderImageDbObject();

            image.organizerId = createResponse['_id'];
            image.image = request.image['buffer'];
            image.originalname = request.image['originalname'];
            image.mimetype = request.image['mimetype'];
            image.size = request.image['size'];

            await this.organizerPlaceholderImageRepository.create(image);
        }


        const passResetReq = new PasswordRecoveryInitRequest();
        passResetReq.email = user.email;
        await this.passwordRecoveryController.resetPasswordGenerateLink(passResetReq);

        const response = new AddOrganizerResponse();
        return response;
    }

    private isBlocked(syncDate: Date): boolean {
        const diff = moment().diff(syncDate, 'hours');

        return diff > 48;
    }

}