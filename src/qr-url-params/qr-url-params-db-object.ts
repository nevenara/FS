import { DbObject } from "../db/db-object";
import { IdVerificationPageType } from "../tickets/model/id-verification-page-type";
import { IQRUrlParamsValue } from "./qr-url-params-value";

export class QRUrlParamsDbObject extends DbObject{
    private qrData: IQRUrlParamsValue;

    constructor(qrValue?: IQRUrlParamsValue){
        super(qrValue);
        this.qrData = this.data as any;
    }

    public get pageType() : IdVerificationPageType {
        return this.qrData.pageType;
    }

    public set pageType(v : IdVerificationPageType) {
        this.qrData.pageType = v;
    }
    
    public get urlParams() : string {
        return this.qrData.urlParams;
    }

    public set urlParams(v : string) {
        this.qrData.urlParams = v;
    }

    public get selectedId() : string {
        return this.qrData.selectedId;
    }

    public set selectedId(v : string) {
        this.qrData.selectedId = v;
    }

  
}
