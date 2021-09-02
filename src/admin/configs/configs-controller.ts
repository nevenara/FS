import { ConfigService } from "../../common/config-service";
import { IUserContext } from "../../common/user-context";
import { UserType } from "../../models/user-type";
import { GetConfigsResponse } from "./models/get-configs-response";
import { UpdateConfigsRequest } from "./models/update-configs-request";
import { UpdateConfigsResponse } from "./models/update-configs-response";

export interface IConfigsController {
    getConfigs(): Promise<GetConfigsResponse>;
    updateConfigs(request: UpdateConfigsRequest): Promise<UpdateConfigsResponse>;
}

export class ConfigsCountroller implements IConfigsController {
    constructor(
        private context: IUserContext,
        private configService: ConfigService
    ){}

    public async getConfigs(): Promise<GetConfigsResponse> {
        this.context.validateIfAuthenticated();
        this.context.validateAuthorization([UserType.Admin, UserType.SuperAdmin]);

        let configs = await this.configService.getConfigs();

        let response = new GetConfigsResponse();
        response.configs = configs;

        return response;
    }

    public async updateConfigs(request: UpdateConfigsRequest): Promise<UpdateConfigsResponse> {
        this.context.validateIfAuthenticated();
        this.context.validateAuthorization([UserType.Admin, UserType.SuperAdmin]);

        request.validate(this.context.lang);

        await this.configService.updateConfigs(request.configs);

        return new UpdateConfigsResponse();
    }
}