import { Guard } from "../common/errors/guard";
import { IUserContext } from "../common/user-context";
import { IQRUrlParamsRepository } from "./qr-url-params-repository";
import { IQRUrlParamsValue } from "./qr-url-params-value";

export interface IQRUrlParamsController {
    getUrlParamsById(id: string): Promise<IQRUrlParamsValue>
}

export class QRUrlParamsController implements IQRUrlParamsController{
    constructor(
        private context: IUserContext,
        private qrUrlParamsRepository: IQRUrlParamsRepository
    ){}
    public async getUrlParamsById(id: string): Promise<IQRUrlParamsValue> {
        this.context.validateIfAuthenticated();
        Guard.isTruthy(id, 'id is required');

        const params = await this.qrUrlParamsRepository.getUrlParamsById(id);

        return params;
    }


}