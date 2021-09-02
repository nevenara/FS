import { MultierFile } from "../../common/multier-file";

export class VerifyIdRequest {
    public idDocumentFile: MultierFile; 
    public selfieImage: MultierFile;
    public userId: string;
}
