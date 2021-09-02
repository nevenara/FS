import { EntityType } from "./entity-type";
import { IBaseModel } from "./base-schema";
import { Model } from "mongoose";
import { ENETUNREACH } from "constants";

const eventModel = require('./schemas/event-schema');
const userValueModel = require("./schemas/user-schema");
const profileImageModel = require("./schemas/profile-image-schema");
const userAdditionalEmails = require("./schemas/user-additional-emails-schema");
const passwordRecoveryRequests = require("./schemas/password-recovery-request-schema");
const blacklistedEmails = require("./schemas/blackilisted-emails-schema");
const ticketValueModel = require("./schemas/ticket-schema");
const ticketPlaceholderImage = require("./schemas/ticket-placeholder-image-schema");
const organizerValueModel = require('./schemas/organizer-schema');
const ticketTransactionModel = require('./schemas/ticket-transaction-schema');
const configModel = require('./schemas/config-schema');
const sessionLogModel = require('./schemas/session-log-schema');
const userActivityLOg = require('./schemas/user-activity-log-schema');
const invalidIdCheck = require('./schemas/invalid-id-check-schema');
const shoppingCart = require('./schemas/shopping-cart-schema');
const ticketAssignmentDeadline = require('./schemas/ticket-assignment-deadline');
const selfieImageModel = require('./schemas/selfie-image-schema');
const faqModel = require('./schemas/faq-schema');
const usersRegisteredVsusersVerifiedPerYearReportResultModel = require('./schemas/users-registered-vs-users-verified-per-year-report-result-schema');
const incomingTicketsVsPersonalizedTicketsPerYearReportResultModel = require('./schemas/incoming-tickets-vs-personalized-tickets-per-year-report-result-schema');
const incomingTicketsPerOrganizerReportResultModel = require('./schemas/incoming-tickets-per-organizer-report-result-schema');
const organizerPlaceholderImageModel = require('./schemas/organizer-placeholder-image-schema');
const faqUserModel = require('./schemas/faq-user-schema');
const seatPlanModel = require('./schemas/seat-plan-schema');
const qrUrlParamsModel = require('./schemas/qr-url-params-schema');
const checkInModel = require('./schemas/check-in-schema'); 

export function getModelFromFactory(type: EntityType) {
    let model: Model<IBaseModel>;

    switch (type) {
        case EntityType.Event:
            model = eventModel;
            break;
        case EntityType.User:
            model = userValueModel;
            break;
        case EntityType.ProfileImage:
            model = profileImageModel;
            break;
        case EntityType.UserAdditionalEmails:
            model = userAdditionalEmails;
            break;
        case EntityType.PasswordRecoveryRequests:
            model = passwordRecoveryRequests;
            break;
        case EntityType.BlacklistedEmails:
            model = blacklistedEmails;
            break;
        case EntityType.Ticket:
            model = ticketValueModel;
            break;
        case EntityType.TicketPlaceholderImage:
            model = ticketPlaceholderImage;
            break;
        case EntityType.Organizer:
            model = organizerValueModel;
            break;
        case EntityType.TicketTransaction:
            model = ticketTransactionModel;
            break;
        case EntityType.Config:
            model = configModel;
            break;
        case EntityType.SessionLog:
            model = sessionLogModel;
            break;
        case EntityType.UserActivityLog:
            model = userActivityLOg;
            break;
        case EntityType.InvalidIdCheck:
            model = invalidIdCheck;
            break;
        case EntityType.ShoppingCart:
            model = shoppingCart;
            break;
        case EntityType.TicketAssignmentDeadline:
            model = ticketAssignmentDeadline;
            break;
        case EntityType.SelfieImage:
            model = selfieImageModel;
            break;
        case EntityType.FAQ:
            model = faqModel;
            break;
        case EntityType.UsersRegisteredVsUsersVerifiedPerYearReportResult:
            model = usersRegisteredVsusersVerifiedPerYearReportResultModel;
            break;
        case EntityType.IncomingTicketsVsPersonalizedTicketsPerYearReportResult:
            model = incomingTicketsVsPersonalizedTicketsPerYearReportResultModel;
            break;
        case EntityType.IncomingTicketsPerOrganizerReportResult:
            model = incomingTicketsPerOrganizerReportResultModel;
            break;
        case EntityType.OrganizerPlaceholderImage:
            model = organizerPlaceholderImageModel;
            break;
        case EntityType.FAQUser:
            model = faqUserModel;
            break;
        case EntityType.SeatPlan:
            model = seatPlanModel;
            break;
        case EntityType.QRUrlParams:
            model = qrUrlParamsModel;
            break;
        case EntityType.CheckIn:
            model = checkInModel;
            break;
    }

    return model;
}