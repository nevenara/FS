import { use } from "chai";
import { ConfigService } from "../common/config-service";
import { ValidationError } from "../common/errors/validation-error";
import { IUserContext } from "../common/user-context";
import { LocalisationKey } from "../localisation/localisation-key";
import { ILocalisationProvider } from "../localisation/localisation-provider";
import { UserStatus } from "../models/user-status";
import { UserType } from "../models/user-type";
import { IUserRepository } from "../user/user-repository";
import { GetUserAndLinkedAccountResponse, GetUserAndLinkedAccountsResponse } from "./models/get-user-and-linked-accounts-response";
import { GetUserProfileResponse } from "./models/get-user-profile-response";
import { SearchAdminPanelUsersAccountType } from "./models/search-admin-panel-users-account-type";
import { SearchAdminPanelUsersRequest } from "./models/search-admin-panel-users-request";
import { SearchAdminPanelUserResponse, SearchAdminPanelUsersResponse } from "./models/search-admin-panel-users-response";
import { SearchAdminPanelUsersStatus } from "./models/search-admin-panel-users-status";
import { SearchUsersAdminPanelRepoRequest } from "./models/search-users-admin-panel-repo-request";
import { SearchUsersRequest } from "./models/search-users-request";
import { SearchUsersResponse } from "./models/search-users-response";

export interface ISearchUserController {
    getUserAndLinkedAccounts(): Promise<GetUserAndLinkedAccountsResponse>;
    searchUsers(request: SearchUsersRequest): Promise<SearchUsersResponse>;
    searchAdminPanelUsers(request: SearchAdminPanelUsersRequest): Promise<SearchAdminPanelUsersResponse>;
}

export class SearchUserController implements ISearchUserController {
    constructor(
        private context: IUserContext,
        private userRepository: IUserRepository,
        private configService: ConfigService,
        private localisationProvider: ILocalisationProvider
    ){}

    public async getUserAndLinkedAccounts(): Promise<GetUserAndLinkedAccountsResponse> {
        this.context.validateIfAuthenticated();

        const users = await this.userRepository.getUserAndLinkedAccountsUsernames(this.context.userId);

        let response: GetUserAndLinkedAccountsResponse = new GetUserAndLinkedAccountsResponse();
        response.users = [];

        for (let i = 0; i < users.length; i++) {
            const user = users[i];
            const userResponse = new GetUserAndLinkedAccountResponse();
            userResponse.id = user._id;
            userResponse.username = user.username;
            
            response.users.push(userResponse);
        }

        return response;
    }

    public async searchUsers(request: SearchUsersRequest): Promise<SearchUsersResponse> {
        this.context.validateIfAuthenticated();

        const users = await this.userRepository.searchUsers(request.usernameOrEmail);
        let searchUserResponse: SearchUsersResponse = new SearchUsersResponse();
        searchUserResponse.users = [];

        if(users){
            users.forEach(user => {
                //TODO check which information is needed
                const response = new GetUserProfileResponse();
    
                response.email = user.email;
                response.username = user.username;
                response.firstName = user.firstname;
                response.lastName = user.lastname;
                response.gender = user.gender;
                response.birthDate = user.birthDate;
                response.address = user.address;
                response.postCode = user.postCode;
                response.city = user.city;
                response.country = user.country;
                response.phone = user.phone || '';
    
                searchUserResponse.users.push(response);
    
            });
            
        }
       
        return searchUserResponse;
    }

    public async searchAdminPanelUsers(request: SearchAdminPanelUsersRequest): Promise<SearchAdminPanelUsersResponse> {
        this.context.validateIfAuthenticated();
        this.context.validateAuthorization([UserType.Admin, UserType.SuperAdmin, UserType.SupportLevel1, UserType.SupportLevel2, UserType.EventManager]);

        if (request.limit && request.limit > 50) {
            throw new ValidationError(this.localisationProvider.translate(LocalisationKey.LimitPerPageIs50));
        }

        const LIMIT = request.limit || await this.configService.getConfig('pageLimit', 10);

        const response = new SearchAdminPanelUsersResponse();

        const repoRequest = new SearchUsersAdminPanelRepoRequest();

        repoRequest.page = request.page || 1;
        repoRequest.limit = LIMIT;
        repoRequest.textSearch = request.textSearch;

        if(request.status && request.status.length != 0) {
            repoRequest.status = [];

            if(request.status.includes(SearchAdminPanelUsersStatus.Registered)){
                repoRequest.status.push(UserStatus.EmailVerified);
                repoRequest.status.push(UserStatus.RegistrationCompleted);
            }

            if(request.status.includes(SearchAdminPanelUsersStatus.Verified)) {
                repoRequest.status.push(UserStatus.IdVerified);
                repoRequest.verified = true;
            }

            if(request.status.includes(SearchAdminPanelUsersStatus.VerifiedInclBankAccount)) {
                repoRequest.status.push(UserStatus.IdVerified);
                repoRequest.verifiedInclBankAccount = true;
            }

            if(request.status.includes(SearchAdminPanelUsersStatus.Inactive)) {
                repoRequest.status.push(UserStatus.Blocked);
            }
        }

        if(request.accountType && request.accountType.length != 0) {
            repoRequest.accountType = [];

            if(request.accountType.includes(SearchAdminPanelUsersAccountType.LinkedAccount)){
                repoRequest.accountType.push(UserType.LinkedAccount);
            }

            if(request.accountType.includes(SearchAdminPanelUsersAccountType.MainAccount)){
                repoRequest.accountType.push(UserType.MainAccount);
            }
        }
       
        repoRequest.verificationDateFrom = request.verificationDateFrom;
        repoRequest.verificationDateTo = request.verificationDateTo;
        repoRequest.signUpDateFrom = request.signUpDateFrom;
        repoRequest.signUpDateTo = request.signUpDateTo;

        repoRequest.reasonForInactivity = request.reasonForInactivity;
        
        repoRequest.sortField = request.sortField;
        repoRequest.sortOrder = request.sortOrder;
       
        const res = await this.userRepository.searchAdminPanel(repoRequest);
        response.users = [];

        for (let i = 0; i < res.users.length; i++) {
            const user = res.users[i];
            const userResponse: SearchAdminPanelUserResponse = new SearchAdminPanelUserResponse();

            userResponse.userId = user['_id'];
            userResponse.username = user['username'];
            userResponse.email = user['email'];
            userResponse.firstName = user['firstname'];
            userResponse.lastName = user['lastname'];
            userResponse.mainAccount = user['mainAccount'];
            userResponse.signUpDate = user['signUpDate'];
            userResponse.verificationDate = user['verificationDate'];

            let status = null;
            switch (user['status']) {
                case UserStatus.Blocked:
                    status = SearchAdminPanelUsersStatus.Inactive;
                    userResponse.reasonForInactivity = user['reasonForInactivity'];
                    break;
                case UserStatus.IdVerified:
                    if(user['bankAccountId']){
                        status = SearchAdminPanelUsersStatus.VerifiedInclBankAccount;
                    }
                    else{
                        status = SearchAdminPanelUsersStatus.Verified;
                    }
                    break;
                case UserStatus.EmailVerified:
                    status = SearchAdminPanelUsersStatus.Registered;
                    break;
                case UserStatus.RegistrationCompleted:
                    status = SearchAdminPanelUsersStatus.Registered;
                    break;
                default:
                    break;
            }
            userResponse.status = status;

            response.users.push(userResponse);
        }
        
        response.totalPages = res.totalPages;
        response.totalRecords = res.totalRecords;
        return response;
    }

}