import { UploadDefaultProfileImageRequest } from "./models/upload-default-profile-image-response";
import { UploadDefaultProfileImageResponse } from "./models/upload-default-profile-image-request";
import { IUserContext } from "../../common/user-context";
import { IProfileImageRepository } from "../../profile-image/profile-image-repository";
import { IAdminSettingsValidator } from "./admin-settings-validator";
import { UserType } from "../../models/user-type";
import { IProfileImageValue } from "../../profile-image/profile-image-value";
import { ProfileImageDbObject } from "../../profile-image/profile-image-db-object";
import { UploadDefaulOrganizerImageRequest } from "./models/upload-default-organizer-image-request";
import { IOrganizerPlaceholderImageRepository } from "../../organizer-placeholder-image/organizer-placeholder-image-repository";
import { IOrganizerPlaceholderImageValue } from "../../organizer-placeholder-image/organizer-placeholder-image-value";
import { OrganizerPlaceholderImageDbObject } from "../../organizer-placeholder-image/organizer-placeholder-image-db-object";

export interface IAdminSettingsController {
    uploadDefaultOrganizerImage(request: UploadDefaulOrganizerImageRequest): Promise<UploadDefaultProfileImageResponse>;
    uploadDefaultProfileImage(request: UploadDefaultProfileImageRequest): Promise<UploadDefaultProfileImageResponse>;
}

export class AdminSettingsController implements IAdminSettingsController {
    constructor(
        private context: IUserContext,
        private profileImageRepository: IProfileImageRepository,
        private organizerImageRepository: IOrganizerPlaceholderImageRepository,
        private adminSettingsValidator: IAdminSettingsValidator
    ) {}
    
    public async uploadDefaultOrganizerImage(request: UploadDefaulOrganizerImageRequest): Promise<UploadDefaultProfileImageResponse> {
        this.context.validateIfAuthenticated();
        this.context.validateAuthorization([UserType.Admin, UserType.SuperAdmin]);

        request.validate(this.context.lang);
        this.adminSettingsValidator.validateUploadDefaultProfileImage(request.image);

        let image: IOrganizerPlaceholderImageValue = await this.organizerImageRepository.getDefaultProfileImage();

        if (image) {
            image.image = request.image['buffer'];
            image.originalname = request.image['originalname'];
            image.mimetype = request.image['mimetype'];
            image.size = request.image['size'];
            
            await this.organizerImageRepository.updateObjectById(image._id, new OrganizerPlaceholderImageDbObject(image));
        }
        else {
            const newImage = new OrganizerPlaceholderImageDbObject();

            newImage.image = request.image['buffer'];
            newImage.isDefaultImage = true;
            newImage.originalname = request.image['originalname'];
            newImage.mimetype = request.image['mimetype'];
            newImage.size = request.image['size'];

            await this.organizerImageRepository.create(newImage);
        }

        return new UploadDefaultProfileImageResponse();
    }

    public async uploadDefaultProfileImage(request: UploadDefaultProfileImageRequest): Promise<UploadDefaultProfileImageResponse> {
        this.context.validateIfAuthenticated();
        this.context.validateAuthorization([UserType.Admin, UserType.SuperAdmin]);

        request.validate(this.context.lang);
        console.log(request.profileImage)
        this.adminSettingsValidator.validateUploadDefaultProfileImage(request.profileImage);

        let profileImage: IProfileImageValue = await this.profileImageRepository.getDefaultProfileImage();

        if (profileImage) {
            profileImage.image = request.profileImage['buffer'];
            profileImage.originalname = request.profileImage['originalname'];
            profileImage.mimetype = request.profileImage['mimetype'];
            profileImage.size = request.profileImage['size'];
            
            await this.profileImageRepository.updateObjectById(profileImage._id, new ProfileImageDbObject(profileImage));
        }
        else {
            const newProfileImage = new ProfileImageDbObject();

            newProfileImage.image = request.profileImage['buffer'];
            newProfileImage.isDefaultImage = true;
            newProfileImage.originalname = request.profileImage['originalname'];
            newProfileImage.mimetype = request.profileImage['mimetype'];
            newProfileImage.size = request.profileImage['size'];

            await this.profileImageRepository.create(newProfileImage);
        }

        return new UploadDefaultProfileImageResponse();
    }
}