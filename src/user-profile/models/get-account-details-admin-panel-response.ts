export class GetAccountDetailsAdminPanelResponse {
    public username: string;
    public standardEmail: string;
    public additionalEmails: AdditionalEmailResponse[];
}

export class AdditionalEmailResponse {
    email: string;
    isVerified: boolean;
}
