import { UserType } from "../../models/user-type";

export class SearchUsersRepoRequest {
    public accountType: UserType[];
    public usernameOrEmail: string;
}