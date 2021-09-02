import { IDbData } from "../db/idb-data";
import { IdVerificationPageType } from "../tickets/model/id-verification-page-type";

export interface IQRUrlParamsValue extends IDbData {
    pageType: IdVerificationPageType;
    urlParams: string;
    selectedId: string;
}
