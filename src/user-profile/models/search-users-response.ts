import { IUserValue } from "../../user/user-value";
import { GetUserProfileResponse } from "./get-user-profile-response";

export class SearchUsersResponse {
    public users: GetUserProfileResponse[];
}
