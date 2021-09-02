import { Interface } from "readline";
import { Environment } from "../../environment";
import { ExpressAppWrapper } from "../../http/express-app-wrapper";
import { PasswordRecoveryRouter } from "../../password-recovery/password-recovery-router";
import { RegistrationRouter } from "../../registration/registration-router";
import { ReturnTicketResponse } from "../../tickets/model/return-ticket-response";
import { ValidationError } from "../errors/validation-error";
import { EmailUtil } from "./email-util";
import { VerifyEmailTemplate } from "./models/verify-email-template";
import { Email } from "./models/email";
import { ReturnTicketTemplate } from "./models/return-ticket-template";
import { SetNewTicketHolderTemplate } from "./models/set-new-ticket-holder-template";
import { ForgottenPasswordTemplate } from "./models/forgotten-password-template";
import { TicketAssignmentDeadlineTemplate } from "./models/ticket-assignment-deadline-template";
import { SendEmailToSupportRequest } from "../../support-page/models/send-email-to-support-request";
import { SupportPageController } from "../../support-page/support-page-controller";
import { ConfigService } from "../config-service";
import { ApplicationType } from "../../basic-auth/models/application-type";

const request = require('request-promise');

export interface IEmailSender {
  sendVerificationEmail(email: string, attributes: VerifyEmailTemplate);
  sendForgottenPasswordLink(email: string, attributes: ForgottenPasswordTemplate);
  sendReturnTicketEmail(email: string, attributes: ReturnTicketTemplate);
  sendSetNewTicketHolderEmail(email: string, attributes: SetNewTicketHolderTemplate);
  sendTicketAssignmentDeadlineEmail(email: string, attributes: TicketAssignmentDeadlineTemplate);
  sendEmailToSupport(request: SendEmailToSupportRequest);
}


export class EmailSender implements IEmailSender {
  constructor(private configService: ConfigService) {

  }

  public async sendVerificationEmail(email: string, attributes: VerifyEmailTemplate) {
    const host = Environment.getAppHost();

    let verificationLink = `${host}${ExpressAppWrapper.urlPrefix}${attributes.route}?emailVerificationGuid=${attributes.uuid}&lang=${attributes.lang || 'de'}`;

    if(attributes.additional){
      verificationLink = `${Environment.getWebAppHost()}${attributes.route}?emailVerificationGuid=${attributes.uuid}&lang=${attributes.lang || 'de'}`;
    }

    let verificationEmail = new Email();
    verificationEmail.address = email;
    verificationEmail.templateId = Environment.getVerificationEmailTemplateId();

    let params = {};

    params['firstname'] = attributes.firstname;
    params['lastname'] = attributes.lastname;
    params['verificationlink'] = verificationLink;
    params['lang'] = attributes.lang || 'de';
    await this.sendEmail(verificationEmail, params);

    return verificationLink;
  }

  public async sendForgottenPasswordLink(email: string, attributes: ForgottenPasswordTemplate) {
    let forgottenPasswordEmail = new Email();
    forgottenPasswordEmail.address = email;
    forgottenPasswordEmail.templateId = Environment.getForgottenPasswordEmailTemplateId();
    let host = Environment.getWebAppHost();

    switch (attributes.appType) {
      case ApplicationType.ADMIN_PANEL:
        host = Environment.getAdminPanelHost();
        break;
      case ApplicationType.ORGANIZER:
        host = Environment.getOrganizerHost();
        break;
    
      default:
        break;
    }
    let params = {};
    params['firstname'] = attributes.firstname;
    params['lastname'] = attributes.lastname;
    params['lang'] = attributes.lang || 'de';

    const route = attributes.appType == ApplicationType.ADMIN_PANEL ? '/admin' : attributes.appType == ApplicationType.ORGANIZER ? '/organizer' : '';
    params['forgottenpasswordlink'] = `${host}${route}/auth/resetpassword?uuid=${attributes.uuid}`;
    await this.sendEmail(forgottenPasswordEmail, params);
  }

  public async sendReturnTicketEmail(email: string, attributes: ReturnTicketTemplate) {
    let returnTicketEmail = new Email();
    returnTicketEmail.address = email;
    returnTicketEmail.templateId = Environment.getReturnTicketEmailTemplateId();

    let params = {};
    params['companyname'] = attributes.companyName;
    params['ticketid'] = attributes.ticketId,
      params['firstname'] = attributes.firstName,
      params['lastname'] = attributes.lastName,
      params['username'] = attributes.fanSafeUsername,
      params['useremail'] = attributes.email,
      params['eventname'] = attributes.eventName,
      params['location'] = attributes.location,
      params['locationname'] = attributes.locationName,
      params['seat'] = attributes.seat,
      params['bookingid'] = attributes.bookingId,
      params['price'] = attributes.ticketPrice,
      params['acceptedreturnpolicy'] = attributes.acceptedReturnPolicy,
      params['date'] = attributes.eventDate
      params['lang'] = attributes.lang || 'de';

    await this.sendEmail(returnTicketEmail, params);
  }

  public async sendSetNewTicketHolderEmail(email: string, attributes: SetNewTicketHolderTemplate) {
    let setNewTicketHolderEmail = new Email();

    //TODO get support email
    setNewTicketHolderEmail.address = 'vujicic.sara@yahoo.com';
    setNewTicketHolderEmail.templateId = Environment.getChangTicketHolderEmailTemplateId();

    let params = {};
    params['ticketholderfirstname'] = attributes.ticketHolderFirstname;
    params['ticketholderlastname'] = attributes.ticketHolderLastName;
    params['ticketholderusername'] = attributes.ticketHolderUsername;
    params['ticketid'] = attributes.ticketId;
    params['firstname'] = attributes.firstName;
    params['lastname'] = attributes.lastName;

    await this.sendEmail(setNewTicketHolderEmail, params);

  }

  public async sendTicketAssignmentDeadlineEmail(email: string, attributes: TicketAssignmentDeadlineTemplate) {
    let ticketAssignmentDeadlineEmail = new Email();
    ticketAssignmentDeadlineEmail.address = email;
    ticketAssignmentDeadlineEmail.templateId = Environment.getTicketAssignmentDeadlineEmailTemplateId();

    let params = {};
    params['ticketid'] = attributes.ticketId;
    params['bookingid'] = attributes.bookingId;
    params['firstname'] = attributes.firstName;
    params['lastname'] = attributes.lastName;
    params['event'] = attributes.event;
    params['date'] = attributes.date;
    params['deadline'] = attributes.deadline;
    params['hours'] = attributes.hours;
    params['type'] = attributes.deadlineType;
    params['lang'] = attributes.lang || 'de';

    await this.sendEmail(ticketAssignmentDeadlineEmail, params);
  }

  public async sendEmailToSupport(req: SendEmailToSupportRequest) {
    const SUPPORT_EMAIL = await this.configService.getConfig('supportEmail');
    const options = {
      method: 'POST',
      url: Environment.getEmailServiceUrl() + EmailUtil.EMAILSURL,
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        'api-key': Environment.getEmailServiceApiKey()
      },
      body: {
        "sender": { "email": req.email.toLowerCase() },
        "to": [{ "email": SUPPORT_EMAIL }],
        "subject": req.subject,
        "textContent": req.message
      },
      json: true
    };

    var result = await request(options);
    console.log(result);
  }



  private async sendEmail(email: Email, params: {}) {
    const options = {
      method: 'POST',
      url: Environment.getEmailServiceUrl() + EmailUtil.EMAILSURL,
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        'api-key': Environment.getEmailServiceApiKey()
      },
      body: {
        to: [{ email: email.address }],
        templateId: +email.templateId,
        params: params
      },
      json: true
    };

    var result = await request(options);
    console.log(result);
  }

}