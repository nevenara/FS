import { IAzureFaceClient } from "../common/azure-client";

//https://www.npmjs.com/package/@azure/cognitiveservices-face
import { FaceClient, FaceModels } from "@azure/cognitiveservices-face";
import { MultierFile } from "../common/multier-file";
import { FaceDetectWithStreamResponse, FaceVerifyFaceToFaceResponse } from "@azure/cognitiveservices-face/esm/models";
import { ValidationError } from "../common/errors/validation-error";
import { LocalisationKey } from "../localisation/localisation-key";
import { RecognizeSelfieAndIDDocumentResponse } from "./models/recognize-selfie-id-document-response";
import { ILocalisationProvider } from "../localisation/localisation-provider";

export interface IFaceRecognitionService {
    recognizeSelfieAndIDDocument(
        idDocument: MultierFile,
        selfieImage: MultierFile,
        detectionModel?: string
    ): Promise<RecognizeSelfieAndIDDocumentResponse>
}

export class FaceRecognitionService implements IFaceRecognitionService {
    private static limitSize: number = 6000000;

    constructor(private azureFaceClient: IAzureFaceClient, private localisationProvider: ILocalisationProvider) { }

    public async recognizeSelfieAndIDDocument(
        idDocument: MultierFile,
        selfieImage: MultierFile,
        detectionModel?: string
    ): Promise<RecognizeSelfieAndIDDocumentResponse> {

        //https://docs.microsoft.com/en-us/rest/api/cognitiveservices/face/facelist/addfacefromstream
        if (idDocument.size > FaceRecognitionService.limitSize
            || selfieImage.size > FaceRecognitionService.limitSize) {
            throw new ValidationError(this.localisationProvider.translate(LocalisationKey.FileSizeRecognitionServiceFailedValidation));
        }

        // Verify - compare two images if the same person or not.
        // Verify(client, IMAGE_BASE_URL, RECOGNITION_MODEL3).Wait();
        const faceClient: FaceClient = this.azureFaceClient.getFaceClient();

        const resultPromises: Promise<FaceDetectWithStreamResponse>[] = [];

        resultPromises.push(faceClient.face.detectWithStream(selfieImage.buffer, {
            returnFaceId: true,
            detectionModel: detectionModel === '1' ? 'detection_01' : 'detection_02',
            recognitionModel: "recognition_03"
        }));

        resultPromises.push(faceClient.face.detectWithStream(
            idDocument.buffer,
            {
                returnFaceId: true,
                detectionModel: detectionModel === '1' ? 'detection_01' : 'detection_02',
                recognitionModel: "recognition_03"
            }
        ));

        const awaitRes: FaceDetectWithStreamResponse[] = await Promise.all(resultPromises);

        const selfieImageFaceDetect: FaceDetectWithStreamResponse =
            awaitRes[0];


        if (selfieImageFaceDetect.length === 0) {
            throw new ValidationError(this.localisationProvider.translate(LocalisationKey.SelfieImageFaceCannotBeDetected));
        }

        const idDocFaceDetect: FaceDetectWithStreamResponse = awaitRes[1];

        if (idDocFaceDetect.length === 0) {
            throw new ValidationError(this.localisationProvider.translate(LocalisationKey.IdDocumentFaceCannotBeDetected));
        }

        const verifyFaceResponse: FaceVerifyFaceToFaceResponse =
            await faceClient.face.verifyFaceToFace(
                idDocFaceDetect[0].faceId,
                selfieImageFaceDetect[0].faceId,
                {

                });

        const response = new RecognizeSelfieAndIDDocumentResponse();
        response.isIdentical = verifyFaceResponse.isIdentical;
        response.confidence = verifyFaceResponse.confidence;
        return response;
    }
}