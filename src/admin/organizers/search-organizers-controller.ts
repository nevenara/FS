import { ConfigService } from "../../common/config-service";
import { ValidationError } from "../../common/errors/validation-error";
import { IUserContext } from "../../common/user-context";
import { LocalisationKey } from "../../localisation/localisation-key";
import { ILocalisationProvider } from "../../localisation/localisation-provider";
import { UserType } from "../../models/user-type";
import { IOrganizerRepository } from "../../organizer/organizer-repository";
import { SearchOrganizersRepoResponse } from "./models/search-organizers-repo-response";
import { SearchOrganizersRequest } from "./models/search-organizers-request";
import { SearchOrganizerResponse, SearchOrganizersResponse } from "./models/search-organizers-response";

export interface ISearchOrganizersController {
    search(request: SearchOrganizersRequest): Promise<SearchOrganizersResponse>;
}

export class SearchOrganizersController implements ISearchOrganizersController {
    constructor(
        private context: IUserContext,
        private organizerRepository: IOrganizerRepository,
        private configService: ConfigService,
        private localisationProvider: ILocalisationProvider
    ){}
    
    public async search(request: SearchOrganizersRequest): Promise<SearchOrganizersResponse> {
        this.context.validateIfAuthenticated();
        this.context.validateAuthorization([UserType.Admin, UserType.SuperAdmin, UserType.SupportLevel1, UserType.SupportLevel2, UserType.EventManager]);

        request.validate(this.context.lang);

        if (request.limit && request.limit > 50) {
            throw new ValidationError(this.localisationProvider.translate(LocalisationKey.LimitPerPageIs50));
        }

        request.limit = request.limit || await this.configService.getConfig('pageLimit', 10);
        request.page = request.page || 1;
        
        const res: SearchOrganizersRepoResponse = await this.organizerRepository.search(request);
        
        const response: SearchOrganizersResponse = new SearchOrganizersResponse();
        response.organizers = [];

        for (let i = 0; i < res.organizers.length; i++) {
            const o = res.organizers[i];

            const oRes = new SearchOrganizerResponse();
            oRes.id = o._id;
            oRes.companyName = o.companyName;
            oRes.contactPerson = o.contactPerson;
            oRes.email = o.email;
            oRes.phone = o.phone;
            oRes.status = o.status;

            response.organizers.push(oRes);
        }

        response.totalPages = res.totalPages;
        response.totalRecords = res.totalRecords;
        return response;

    }
}
