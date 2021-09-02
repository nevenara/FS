import { ValidationError } from "../common/errors/validation-error";
import { IUserContext } from "../common/user-context";
import { LocalisationKey } from "../localisation/localisation-key";
import { ILocalisationProvider } from "../localisation/localisation-provider";
import { UserStatus } from "../models/user-status";
import { UserType } from "../models/user-type";
import { IUserRepository } from "../user/user-repository";
import { IIdVerificationFlow } from "./id-verification-flow";
import { StartIdVerificationFlowResponse } from "./models/start-id-verification-flow-response";
import { VerifyIdRequest } from "./models/verify-id-request";
import { VerifyIdResponse } from "./models/verify-id-response";

export interface IIdVerificationController {
    verifyId(request: VerifyIdRequest): Promise<VerifyIdResponse>;
}

export class IdVerificationController implements IIdVerificationController {
    constructor(
        private context: IUserContext,
        private userRepository: IUserRepository,
        private idVerificationFlow: IIdVerificationFlow,
        private localisationProvider: ILocalisationProvider) {
    }

    public async verifyId(request: VerifyIdRequest): Promise<VerifyIdResponse> {
        this.context.validateIfAuthenticated();
        this.context.validateAuthorization([UserType.SuperAdmin, UserType.Admin, UserType.EventManager, UserType.MainAccount]);

        let user =
            await this.userRepository.getUserById(request.userId);

        if (user.status !== UserStatus.RegistrationCompleted
            && user.status !== UserStatus.IdVerified) {
            throw new ValidationError(this.localisationProvider.translate(LocalisationKey.UserMustCompleteRegistrationFirst));
        }

        const startIdVerificationFlowResponse: StartIdVerificationFlowResponse =
            await this.idVerificationFlow.startIdVerificationFlow(user, request.idDocumentFile, request.selfieImage);

        const response = new VerifyIdResponse();

        response.errors =
            startIdVerificationFlowResponse.stripeErrorsTranslated;

        return response;
    }
}