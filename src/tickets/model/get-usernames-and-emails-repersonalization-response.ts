export class GetUsernamesAndEmailsResponse {
    users: Array<UsernameAndEmail> = [];
}

export class UsernameAndEmail {
    userId: string;
    usernameAndEmail: string;
}