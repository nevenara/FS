import { IdVerificationPageType } from "./id-verification-page-type";

export class GenerateQrCodeRequest {
    pageType: IdVerificationPageType;
    urlParams: string;
    selectedId: string;
}