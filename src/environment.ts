

export class Environment {
    public static getStripeSecretKey(): string {
        return process.env.STRIPE_Secret;
    }

    public static getCorsWhiteList(): string[] {
        return [
            'http://localhost:4200',
            'http://localhost:4100',
            'http://fansafe-loadbalancer-1226084727.us-east-2.elb.amazonaws.com',
            'http://fansafetest.s3-website.eu-central-1.amazonaws.com',
            'https://d2kl68yne5q79o.cloudfront.net/',
            'http://d26v62pj18pe42.cloudfront.net',
            'http://dbh4v1kyyfr6w.cloudfront.net',
            'http://fansafetestadminpanel.s3.amazonaws.com',
            'http://fansafetestadminpanel.s3-website.eu-central-1.amazonaws.com',
            'http://fansafeorganizator.s3-website.eu-central-1.amazonaws.com']
    }

    public static isProductionMode() {
        return process.env.PRODUCTION;
    }

    public static isInsideDocker() {
        return process.env.DOCKERRUN;
    }

    public static getAppPort(): any {
        return process.env.PORT || '3000';
    }

    public static getMongoConnectionString() {
        return process.env.MONGOURL || "mongodb://localhost:27017";
    }

    public static getRedisHost() {
        return process.env.REDIS_HOST || "127.0.0.1";
    }

    public static getRedisPassword() {
        return process.env.REDIS_PASSWORD || null;
    }

    public static getRedisPort() {
        return process.env.REDIS_PORT || "6379";
    }

    public static getEmailServiceUrl() {
        return process.env.EMAIL_SERVICE_URL || "https://api.sendinblue.com/v3";
    }

    public static getEmailServiceApiKey() {
        return process.env.EMAIL_SERVICE_API_KEY || "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";
    }

    public static getVerificationEmailTemplateId() {
        return process.env.VERIFICATION_EMAIL_TEMPLATE_ID || "1";
    }

    public static getForgottenPasswordEmailTemplateId() {
        return process.env.FORGOTTEN_PASSWORD_EMAIL_TEMPLATE_ID || "2";
    }

    public static getReturnTicketEmailTemplateId() {
        return process.env.RETURN_TICKET_EMAIL_TEMPLATE_ID || "3";
    }

    public static getChangTicketHolderEmailTemplateId() {
        return process.env.CHANGE_TICKETHOLDER_EMAIL_TEMPLATE_ID || "5";
    }

    public static getTicketAssignmentDeadlineEmailTemplateId() {
        return process.env.TICKET_ASSIGNMENT_DEADLINE_EMAIL_TEMPLATE_ID || "4";
    }

    public static getAppHost() {
        //for local development, diferent port should be used(angular one).
        return process.env.APP_HOST || "http://localhost:3000";
    }

    public static getProtocol() {
        return process.env.PROTOCOL || "http://";
    }

    public static getWebAppHost() {
        //for local development, diferent port should be used(angular one).
        return process.env.WEBAPP_HOST || "http://localhost:4200";
    }

    public static getAdminPanelHost() {
        return process.env.ADMINPANEL_HOST || "http://localhost:4200";
    }

    public static getOrganizerHost() {
        return process.env.ORGANIZER_HOST || "http://localhost:4200";
    }
    public static getSessionExpirationInSeconds(): number {
        return parseInt(process.env.SESSION_EXPIRATION_SECONDS || "10800", 10);
    }

    public static getBiometricvision_api_key() {
        return process.env.biometricvision_api_key;
    }
}