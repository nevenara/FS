import { IUserContext } from "../../common/user-context";
import { UserType } from "../../models/user-type";
import { IOrganizerRepository } from "../../organizer/organizer-repository";
import { IUserRepository } from "../../user/user-repository";
import { GetOrganizerResponse } from "./models/get-organizer-response";

export interface IOrganizerAdminPanelController {
    getOrganizer(): Promise<GetOrganizerResponse>;
}

export class OrganizerAdminPanelController implements IOrganizerAdminPanelController {
    constructor(
        private context: IUserContext,
        private organizerRepository: IOrganizerRepository,
        private userRepository: IUserRepository
    ) { }

    public async getOrganizer(): Promise<GetOrganizerResponse> {
        this.context.validateIfAuthenticated();
        this.context.validateIfOrganizer();

        const user = await this.userRepository.getUserById(this.context.proxyUserId || this.context.userId);
        const organizer = await this.organizerRepository.getOrganizerById(user.organizerId);

        const response: GetOrganizerResponse = new GetOrganizerResponse();
        response.organizerId = organizer._id;
        response.companyName = organizer.companyName;

        return response;
    }

}