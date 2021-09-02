import moment = require("moment-timezone");
import { ConfigService } from "../../common/config-service";
import { ValidationError } from "../../common/errors/validation-error";
import { IUserContext } from "../../common/user-context";
import { LocalisationKey } from "../../localisation/localisation-key";
import { ILocalisationProvider } from "../../localisation/localisation-provider";
import { UserStatus } from "../../models/user-status";
import { UserType } from "../../models/user-type";
import { ISessionLogRepository } from "../../session-log/session-log-repository";
import { InputDateParameterParseUtil } from "../../tickets/model/input-date-parameter-parse";
import { UserDbObject } from "../../user/user-db-object";
import { IUserRepository } from "../../user/user-repository";
import { AddUserManagementRequest } from "./models/add-user-management-request";
import { AddUserManagementResponse } from "./models/add-user-management-response";
import { DeleteUserManagementRequest } from "./models/delete-user-management-request";
import { DeleteUserManagementResponse } from "./models/delete-user-management-response";
import { EditUserManagementRequest } from "./models/edit-user-management-request";
import { EditUserManagementResponse } from "./models/edit-user-management-response";
import { SearchUserManagementRepoResponse } from "./models/search-user-management-repo-response";
import { SearchUserManagementRequest } from "./models/search-user-management-request";
import { SearchUserManagementResponse } from "./models/search-user-management-response";
import { IUserManagementValidator } from "./user-management-validator";

export interface IUserManagementController {
    add(request: AddUserManagementRequest): Promise<AddUserManagementResponse>;
    delete(request: DeleteUserManagementRequest): Promise<DeleteUserManagementResponse>;
    edit(request: EditUserManagementRequest): Promise<EditUserManagementResponse>;
    search(request: SearchUserManagementRequest): Promise<SearchUserManagementResponse>;
}

export class UserManagementController implements IUserManagementController {

    constructor(
        private context: IUserContext,
        private userRepository: IUserRepository,
        private validator: IUserManagementValidator,
        private configService: ConfigService,
        private localisationProvider: ILocalisationProvider
    ){}
    
    public async add(request: AddUserManagementRequest): Promise<AddUserManagementResponse> {
        this.context.validateIfAuthenticated();
        this.context.validateAuthorization([UserType.Admin, UserType.SuperAdmin]);

        request.validate(this.context.lang);

        if(this.context.userType == request.permissions ) {
            throw new ValidationError(this.localisationProvider.translate(LocalisationKey.ActionNotAllowed));
        }
        await this.validator.validateUserManagementEmail(request.email.toLowerCase());

        const user = new UserDbObject();

        user.email = request.email.toLowerCase();
        user.firstname = request.firstname.trim();
        user.lastname = request.lastname.trim();
        user.userType = request.permissions;
    
        await this.userRepository.create(user);

        const response: AddUserManagementResponse = new AddUserManagementResponse();
        return response;
    }
    
    public async delete(request: DeleteUserManagementRequest): Promise<DeleteUserManagementResponse> {
        this.context.validateIfAuthenticated();
        this.context.validateAuthorization([UserType.Admin, UserType.SuperAdmin, UserType.SupportLevel1, UserType.SupportLevel2]);

        request.validate(this.context.lang);

        const user = await this.userRepository.getUserById(request.userId);
        if(!user) {
            throw new ValidationError(this.localisationProvider.translate(LocalisationKey.UserNotFound));
        }
        
        user.status = UserStatus.Deleted;

        //TODO remove some fields
    
        await this.userRepository.updateObjectById(request.userId, new UserDbObject(user));

        const response: EditUserManagementResponse = new EditUserManagementResponse();
        return response;
    }
    
    public async edit(request: EditUserManagementRequest): Promise<EditUserManagementResponse> {
        this.context.validateIfAuthenticated();
        this.context.validateAuthorization([UserType.Admin, UserType.SuperAdmin, UserType.SupportLevel1, UserType.SupportLevel2]);

        request.validate(this.context.lang);

        const user = await this.userRepository.getUserById(request.userId);
        if(!user) {
            throw new ValidationError(this.localisationProvider.translate(LocalisationKey.UserNotFound));
        }

        if(user.email != request.email.toLowerCase()){
            await this.validator.validateUserManagementEmail(request.email.toLowerCase());
        }

        user.email = request.email.toLowerCase();
        user.firstname = request.firstname.trim();
        user.lastname = request.lastname.trim();
        user.usertype = request.permissions;
    
        await this.userRepository.updateObjectById(request.userId, new UserDbObject(user));

        const response: EditUserManagementResponse = new EditUserManagementResponse();
        return response;
    }

    public async search(request: SearchUserManagementRequest): Promise<SearchUserManagementResponse> {
        this.context.validateIfAuthenticated();
        this.context.validateAuthorization([UserType.Admin, UserType.SuperAdmin, UserType.SupportLevel1, UserType.SupportLevel2, UserType.EventManager]);

        if(request.permissions && request.permissions.length > 0) {
            if(!request.permissions.includes(UserType.SuperAdmin) &&
                !request.permissions.includes(UserType.Admin) &&
                !request.permissions.includes(UserType.SupportLevel1) &&
                !request.permissions.includes(UserType.SupportLevel2) &&
                !request.permissions.includes(UserType.EventManager)){
                    throw new ValidationError(this.localisationProvider.translate(LocalisationKey.InvalidPermissions));
                }
        }
        if (request.limit && request.limit > 50) {
            throw new ValidationError(this.localisationProvider.translate(LocalisationKey.LimitPerPageIs50));
        }

        request.limit = request.limit || await this.configService.getConfig('pageLimit', 10);
        request.page = request.page || 1;


        const response: SearchUserManagementResponse = new SearchUserManagementResponse();

        const repoResponse: SearchUserManagementRepoResponse = await this.userRepository.searchUserManagement(request);
        response.users = repoResponse.users;

        const timeZone = await this.configService.getConfig("timeZone", "Europe/Vienna");

        for (let i = 0; i < response.users.length; i++) {
            response.users[i].lastLogin = response.users[i].lastLogin ? InputDateParameterParseUtil.getDateInTimeZone(response.users[i].lastLogin, timeZone) : null;
            
        }

        response.totalRecords = repoResponse.totalRecords;
        response.totalPages = repoResponse.totalPages;
        return response;

    }
}