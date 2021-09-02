import { FaceClient, FaceModels } from "@azure/cognitiveservices-face";
import { CognitiveServicesCredentials } from "@azure/ms-rest-azure-js";

export interface IAzureFaceClient {
    getFaceClient(): FaceClient;
}

export class AzureFaceClient implements IAzureFaceClient {
    constructor() {
    }

    public getFaceClient(): FaceClient {
        const faceKey = process.env["faceKey"];
        const faceEndPoint = process.env["faceEndPoint"];
        const cognitiveServiceCredentials = new CognitiveServicesCredentials(faceKey);
        const client = new FaceClient(cognitiveServiceCredentials, faceEndPoint);

        return client;
    }
}