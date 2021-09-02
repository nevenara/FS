import { UserType } from "../../models/user-type";

export enum ApplicationType {
    WEB = 0,
    ADMIN_PANEL = 1,
    ORGANIZER = 2
}

export const Roles = [
    [UserType.MainAccount, UserType.LinkedAccount],
    [UserType.SuperAdmin, UserType.Admin, UserType.SupportLevel2, UserType.SupportLevel1, UserType.EventManager],
    [UserType.Organizer]
]