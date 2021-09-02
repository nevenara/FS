import { Stripe } from "stripe";
import { Guard } from "../common/errors/guard";
import { ValidationError } from "../common/errors/validation-error";
import { MultierFile } from "../common/multier-file";
import { LocalisationKey } from "../localisation/localisation-key";
import { UserActivityType } from "../models/user-activity-type";
import { UserStatus } from "../models/user-status";
import { SelfieImageDbObject } from "../selfie-image/selfie-image-db-object";
import { ISelfieImageRepository } from "../selfie-image/selfie-image-repository";
import { IStripeFactory } from "../stripe/stripe-factory";
import { StripeVerificationStatus } from "../stripe/stripe-verification-status";
import { UserActivityLogRequest } from "../user-activity-log/models/user-activity-log-request";
import { IUserActivityLogService } from "../user-activity-log/user-activity-log-service";
import { UserDbObject } from "../user/user-db-object";
import { IUserRepository } from "../user/user-repository";
import { IUserValue } from "../user/user-value";
import { IFaceRecognitionService } from "./face-recognition-service";
import { StripeErrorsTranslator } from "./stripe-errors-translator";
import { StartIdVerificationFlowResponse } from "./models/start-id-verification-flow-response";
import { UserType } from "../models/user-type";
import { LinkedAccountUtil } from "../linked-accounts/linked-account-util";
import { ITicketService } from "../tickets/ticket-service";
import { IImageCompressor } from "../common/image-helper";
import { ILocalisationProvider } from "../localisation/localisation-provider";

const fs = require('fs');
export interface IIdVerificationFlow {
  startIdVerificationFlow(
    user: IUserValue,
    idDocument: MultierFile,
    selfieImage: MultierFile): Promise<StartIdVerificationFlowResponse>;
}

export class IdVerificationFlow implements IIdVerificationFlow {
  constructor(
    private stripeFactory: IStripeFactory,
    private faceRecognitionService: IFaceRecognitionService,
    private userRepository: IUserRepository,
    private selfieImageRepository: ISelfieImageRepository,
    private userActivityLogService: IUserActivityLogService,
    private ticketService: ITicketService,
    private imageCompressor: IImageCompressor,
    private stripeErrorsTranslator: StripeErrorsTranslator,
    private localisationProvider: ILocalisationProvider) {
  }

  public async startIdVerificationFlow(
    user: IUserValue,
    idDocument: MultierFile,
    selfieImage: MultierFile): Promise<StartIdVerificationFlowResponse> {
    Guard.isTruthy(user.stripeAccountId, 'User must have stripe account id set.');
    Guard.isTruthy(idDocument, 'Id document must be sent.');
    Guard.isTruthy(selfieImage, 'Selfie image must be sent.');

    if (user.usertype !== UserType.MainAccount && user.usertype !== UserType.LinkedAccount) {
      throw new ValidationError(this.localisationProvider.translate(LocalisationKey.OnlyMainAndLinkedAccountCanVerifyId));
    }

    if (!LinkedAccountUtil.olderThanSixteen(user.birthDate)) {
      throw new ValidationError(this.localisationProvider.translate(LocalisationKey.UserMustBeOlderThen16));
    }

    const response = new StartIdVerificationFlowResponse();
    const stripe = this.stripeFactory.createStripe();

    let account: Stripe.Account = await stripe.accounts.retrieve(null, {
      stripeAccount: user.stripeAccountId
    });

    response.stripeErrors = account.requirements.errors;

    if (user.status === UserStatus.Blocked) {
      throw new ValidationError(this.localisationProvider.translate(LocalisationKey.UserIsBlocked));
    }

    if (user.status === UserStatus.IdVerified
      && !account.requirements.currently_due.find(n => { return n === 'individual.verification.document' })) {
      return response;
    }

    // if (account.individual.verification.status === StripeVerificationStatus.verified) {
    //   //STATUS IS VERIFIED 
    //   //WE HAD TO PROVE ADDRESS BY PROVIDING DRIVER LICENCE OR ELECTRIC BILL

    //   //PASSPORT WAS ALSO REQUIRED...
    //   return response;
    // }

    //TODO THIS IS DISABLED TEMPORARY BECAUSE AZURE SUBSCRIBTION HAS EXPIRED
    const recognizeRespose =
      await this.faceRecognitionService.recognizeSelfieAndIDDocument(idDocument, selfieImage);

    if (!recognizeRespose.isIdentical) {
      throw new ValidationError(this.localisationProvider.translate(LocalisationKey.FaceOnIdDocumentDoesNotMatchFaceFromSelfieImage));
    }

    //user must have status IdNotVerified and stripe account id...
    //that should be the case after complete registration process is finished.

    //we need to have user's passport and a selfie image..

    //residence document is also needed...

    //https://stripe.com/docs/connect/identity-verification

    //https://stripe.com/docs/connect/identity-verification-api

    if (account.requirements.currently_due.find(n => { return n === 'individual.verification.document' })) {
      const file = await stripe.files.create({
        purpose: 'identity_document',
        file: {
          data: idDocument.buffer,
          name: idDocument.filename || idDocument.originalname,
          type: idDocument.mimetype,
        },
      }, {
        stripeAccount: user.stripeAccountId,
      });

      const updatedIdDocument = await stripe.accounts.updatePerson(
        user.stripeAccountId,
        account.individual.id,
        {
          verification: {
            document: {
              front: file.id,
            },
          },
        }
      );

      response.stripeErrors = updatedIdDocument.requirements.errors
    }

    if (response.stripeErrors.length === 0) {
      account = await stripe.accounts.retrieve(null, {
        stripeAccount: user.stripeAccountId
      });

      const requiresIdDocument =
        account.requirements.currently_due.find(n => { return n === 'individual.verification.document' });

      if (requiresIdDocument) {
        throw new ValidationError(this.localisationProvider.translate(LocalisationKey.PleaseProvideAgainIdDocument));
      }

      const logRequest = new UserActivityLogRequest();
      logRequest.previousStripeAccountStatus = user.stripeAccountStatus;

      user.status = UserStatus.IdVerified;
      user.stripeAccountStatus = account.individual.verification.status;
      user.faceMatchStatus = recognizeRespose.isIdentical;
      user.faceMatchScore = recognizeRespose.confidence;
      user.stripeErrors = null;
      await this.userRepository.updateObjectById(user._id, new UserDbObject(user));

      //insert into activity logs
      logRequest.newStripeAccountStatus = user.stripeAccountStatus;
      logRequest.userId = user._id;
      logRequest.activityType = UserActivityType.IdVerified;
      await this.userActivityLogService.log(logRequest);

      if (user.usertype === UserType.MainAccount) {
        await this.ticketService.personalizeMainAccountTickets(user);
      } else if (user.usertype === UserType.LinkedAccount) {
        await this.ticketService.personalizeLinkedAccountTickets(user);
      }
    }else{
      user.stripeErrors = this.stripeErrorsTranslator.translate(response.stripeErrors);
      response.stripeErrorsTranslated = user.stripeErrors;
      await this.userRepository.updateObjectById(user._id, new UserDbObject(user));
    }

    const smallImage = await this.imageCompressor.compressImage(selfieImage.buffer);

    const selfiеImageDb = new SelfieImageDbObject();
    selfiеImageDb.image = smallImage;
    selfiеImageDb.userId = user._id;
    selfiеImageDb.mimetype = selfieImage.mimetype;
    selfiеImageDb.originalname = selfieImage.originalname;
    selfiеImageDb.size = selfieImage.size;

    await this.selfieImageRepository.create(selfiеImageDb);

    return response;
    // //THIS NEEDS TO BE MOVED TO API FOR PAYMENT SETTINGS
    // if (account.requirements.currently_due.find(n => { return n === 'individual.verification.additional_document' })) {
    //   const file = await stripe.files.create({
    //     purpose: 'additional_verification',
    //     file: {
    //       data: idDocument.buffer,
    //       name: idDocument.filename || idDocument.originalname,
    //       type: idDocument.mimetype,
    //     },
    //   }, {
    //     stripeAccount: user.stripeAccountId,
    //   });

    //   const updatedIdDocument = await stripe.accounts.updatePerson(
    //     user.stripeAccountId,
    //     account.individual.id,
    //     {
    //       verification: {
    //         additional_document: {
    //           front: file.id
    //         }
    //       },
    //     }
    //   );

    // response.stripeErrors = updatedIdDocument.requirements.errors
  }
}