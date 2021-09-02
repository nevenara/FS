
export class LocalisationKey {
    public static InvalidShoppingCartForGivenPaymentId = "InvalidShoppingCartForGivenPaymentId"; //"Shopping cart cannot be found for given payment intent id. ";
    public static InvalidDateTimeFormat = "InvalidDateTimeFormat"; //"Invalid date and time format provided. Date and time format must be 'DD.MM.YYYY h.mm'(example: '16.11.2021 19:30').";
    public static UserMustBeOlderThen16 = "UserMustBeOlderThen16"; //"User must be older then 16.";
    public static OnlyMainAndLinkedAccountCanVerifyId = "OnlyMainAndLinkedAccountCanVerifyId";
    public static InvalidCountryName = "InvalidCountryName";
    public static EventDoesNotExist = 'EventDoesNotExist';
    public static LimitPerPageIs50 = 'LimitPerPageIs50';
    public static PleaseProvideAgainIdDocument = 'PleaseProvideAgainIdDocument';
    public static FaceOnIdDocumentDoesNotMatchFaceFromSelfieImage = 'FaceOnIdDocumentDoesNotMatchFaceFromSelfieImage';
    public static IdDocumentFaceCannotBeDetected = 'IdDocumentFaceCannotBeDetected';
    public static SelfieImageFaceCannotBeDetected = 'SelfieImageFaceCannotBeDetected';
    public static PaymentIsStillNotSucceeded = 'PaymentIsStillNotSucceeded';
    public static InvalidTicketId = 'InvalidTicketId';
    public static InvalidPaymentIntentId = 'InvalidPaymentIntentId';
    public static TicketSellerDoesNotHaveStripeAccount = 'TicketSellerDoesNotHaveStripeAccount';
    public static TicketNotAssignedToUser = 'TicketNotAssignedToUser';
    public static BankAccountStripeTokenRequired = 'BankAccountStripeTokenRequired';
    public static IdVerificationFilesAreRequired = 'IdVerificationFilesAreRequired';
    public static UserMustCompleteRegistrationFirst = 'UserMustCompleteRegistrationFirst';
    public static RegistrationSuccessfull = "RegistrationSuccessfull"
    public static EmailMustBeVerifiedForLogin = "EmailMustBeVerifiedForLogin"; // "Email must be verified for login.";
    public static SetSessionError = "SetSessionError";
    public static GetSessionError = "GetSessionError";
    public static LoginFailed = "LoginFailed"; // "Invalid credentials.";
    public static EmailRequired = "EmailRequired";
    public static PhoneRequired = "PhoneRequired";
    public static PasswordsRequired = "PasswordsRequired";
    public static Password1and2MustBeSame = "Password1and2MustBeSame";
    public static EmailVerificationGuidIsRequiredField = "EmailVerificationGuidIsRequiredField";
    public static EmailVerificationLinkNotValid = "EmailVerificationLinkNotValid";
    public static UserNameAndPasswordRequired = "UserNameAndPasswordRequired";
    public static usernameRequired = "usernameRequired";
    public static userIdRequired = "userIdRequired";
    public static genderRequired = "genderRequired";
    public static firstnameRequired = "firstnameRequired";
    public static lastnameRequired = "lastnameRequired";
    public static birthDateRequired = "birthDateRequired";
    public static addressRequired = "addressRequired";
    public static postCodeRequired = "postCodeRequired";
    public static cityRequired = "cityRequired";
    public static countryRequired = "countryRequired";
    public static phoneRequired = "phoneRequired";
    public static InvalidGender = "InvalidGender";
    public static MaxNumberOfOtherEmailsExceeded = "MaxNumberOfOtherEmailsExceeded";
    public static UserNotFound = "UserNotFound";
    public static InvalidPasswordFormat = "InvalidPasswordFormat";
    public static InvalidUsernameFormat = "InvalidUsernameFormat";
    public static TooLongField = "TooLongField";
    public static emailNotUnique = "emailNotUnique"
    public static usernameNotUnique = "usernameNotUnique"
    public static EmailAlreadyRegistered = "EmailAlreadyRegistered";
    public static ExpiryNotSetForRedisKey = "ExpiryNotSetForRedisKey";
    public static RedisShutdownError = "RedisShutdownError";
    public static InvalidImageType = "InvalidImageType";
    public static EmptyFieldUploadProfileImage = "EmptyFieldUploadProfileImage";
    public static ImageTooBig = "ImageTooBig";
    public static EmailIsNotVerified = "EmailIsNotVerified";
    public static DuplicatedEmails = "DuplicatedEmails";
    public static EmailFieldRequired = "EmailFieldRequired";
    public static AdditionalEmailUuidRequired = "AdditionalEmailUuidRequired";
    public static EmailAndPasswordRequired = "EmailAndPasswordRequired";
    public static EmailNotExisting = "EmailNotExisting";
    public static WrongPassword = "WrongPassword";
    public static EmailNotVerified = "EmailNotVerified";
    public static InvalidPhoneFormat = "InvalidPhoneFormat";
    public static relationToMainAccountRequired = "relationToMainAccountRequired";
    public static MaxNumOfLinkedAccountsExceeded = "MaxNumOfLinkedAccountsExceeded";
    public static MainAccountIdOrLinkedAccountIdEmpty = "MainAccountIdOrLinkedAccountIdEmpty";
    
    public static LinkedAccountDeleteNotAllowed = "LinkedAccountDeleteNotAllowed";
    public static LinkedAccountIdRequired = "LinkedAccountIdRequired";
    public static CurrentPasswordRequired = "CurrentPasswordRequired";
    public static NewPasswordAndConfirmPasswordRequired = "NewPasswordAndConfirmPasswordRequired";
    public static NewPasswordAndConfirmPasswordDontMatch = "NewPasswordAndConfirmPasswordDontMatch";
    public static DomainIsRequired = "DomainIsRequired";
    public static BlacklistedEmailAlreadyExists = "BlacklistedEmailAlreadyExists";
    public static ForgottenPasswordLinkExpired = "ForgottenPasswordLinkExpired";
    public static MissingFields = "MissingFields";
    public static RegistrationIsAlreadyCompleted = "RegistrationIsAlreadyCompleted";

    public static EmailNotValid = "EmailNotValid";
    public static LinkedAccountDoesntExist = "LinkedAccountDoesntExist";
    public static EmailDoesntExist = "EmailDoesntExist";
    public static MaxNumberOfPlaceholderImagesExceeded = "MaxNumberOfPlaceholderImagesExceeded";
    public static InvalidTicketCategory = "InvalidTicketCategory";
    public static EmptyRequest = "EmptyRequest";
    public static TicketIdRequired = "TicketIdRequired";
    public static ValidPriceRequired = "ValidPriceRequired";
    public static TicketDoesNotExist = "TicketDoesNotExist";
    public static TicketSalePriceNotValid = "TicketSalePriceNotValid";
    
    public static InvalidRequest = "InvalidRequest";
    public static TicketNotPersonalized = "TicketNotPersonalized";
    public static TicketNotForSale = "TicketNotForSale";
    public static ActionNotAllowed = "ActionNotAllowed"; //"Action is not allowed.";
    public static TicketAlreadyReserved = "TicketAlreadyReserved";
    public static TicketReservationExpired = "TicketReservationExpired";
    public static InvalidUser = "InvalidUser";
    public static UserIsNotIdVerified = "UserIsNotIdVerified";
    public static NewOwnerInvalidStatus = "NewOwnerInvalidStatus";
    public static TicketNotWaitingForPersonalization = "TicketNotWaitingForPersonalization";
    public static CannotBuyYourOwnTicket = "CannotBuyYourOwnTicket";
    public static EventNameRequired = "EventNameRequired";
    public static BeginTimeRequired = "BeginTimeRequired";
    public static EventDateRequired = "EventDateRequired";
    public static InvalidBirthDate = "InvalidBirthDate";
    public static InvalidUsernameOrEmailProvided = "InvalidUsernameOrEmailProvided";
    public static MaxNumberOfTicketForEventExceeded = "MaxNumberOfTicketForEventExceeded";
    public static UsernameOrEmailRequired = "UsernameOrEmailRequired";
    public static TicketsRequired = "TicketsRequired";
    public static NotLinkedAccountUser = "NotLinkedAccountUser";
    public static TicketAlreadyPersonalized = "TicketAlreadyPersonalized";
    public static TicketIsNotAvailable = "TicketIsNotAvailable";
    public static TicketIsBlocked = "TicketIsBlocked";
    public static UserIsBlocked = "UserIsBlocked";
    public static verification_document_name_mismatch = `"Unfortunately we could not validate the your data!
    Name does not match with name on the provided document!
    Please make sure all data is clearly readable on the uploaded document.
    Please try again!"`;
    public static verification_document_dob_mismatch = `"Unfortunately we could not validate your data!
    Day of birth does not match with Day of brith on the provided ID document!
    Please make sure all data is clearly readable on the uploaded document.
    Please try again!"`;
    public static verification_document_address_mismatch = `"Unfortunately we could not validate your data!
    Address does not match with address on the provided document!
    Please make sure all data is clearly readable on the uploaded document.
    Please try again!"`;
    public static verification_document_id_number_mismatch = `"Unfortunately we could not validate your provided ID document!
    Please make sure all data is clearly readable on the uploaded document.
    Please try again!"`;
    public static verification_document_fraudulent = `"Unfortunately we could not validate your provided ID document.
    Please contact our Support Team!"`;
    public static verification_document_corrupt = `"Unfortunately we could not validate your provided ID document!
    Please make sure you upload a full color image (resolution: 8000x8000 pxls or smaller, max. filesize: 10MB)
    Please try again!"`;
    public static verification_document_not_signed = `"Unfortunately we could not validate your provided ID document!
    Please make sure the ID document is signed.
    Please try again!"`;
    public static verification_document_missing_back = `"Unfortunately we could not validate your provided ID document!
    Please make sure you upload the back side of ID document.
    Please try again!"`;
    public static verification_document_missing_front = `"Unfortunately we could not validate your provided ID document!
    Please make sure you upload the front side of ID document.
    Please try again!"`;
    public static verification_document_expired = `"Unfortunately we could not validate your provided document!
    ID document must not be expired. Proof of address document must not be older than 6 months!
    Please try again!"`;
    public static verification_document_country_not_supported = `"Unfortunately we could not validate your provided document!
    Please make sure you uploaded a supported document (link to according section in privacy policy)
    Please try again!"`;
    public static verification_failed_keyed_identity = `"Unfortunately we could not validate the your data!
    Please make sure all data is clearly readable on the uploaded document and correspond to the data of the registered user.
    Please try again!"`;
    public static OrganizerDoesntExist = 'OrganizerDoesntExist';
    public static CalendarExportError = 'CalendarExportError';

    public static ConfigsRequired = 'ConfigsRequired';
    public static ConfigParamRequired = 'ConfigParamRequired';
    public static ConfigValueRequired = 'ConfigValueRequired';
    public static ConfigParamDoesntExist = 'ConfigParamDoesntExist';
    public static BadCronApiKey = 'Incorrect cron api key.';
    public static ResidanceDocumentIsRequired = 'ResidanceDocumentIsRequired';
    public static FileSizeRecognitionServiceFailedValidation = 'FileSizeRecognitionServiceFailedValidation';
    public static UserCannotBeFoundForGivenStripeAccountId = 'UserCannotBeFoundForGivenStripeAccountId';
    public static InvalidReasonForDeactivation = 'InvalidReasonForDeactivation';
    public static DeletingLinkedAccountNotAllowed = 'DeletingLinkedAccountNotAllowed';
    public static SameUserSelected = 'SameUserSelected';
    public static ProfileImageNotSet = 'ProfileImageNotSet';
    public static MainAccounNotFound = 'MainAccounNotFound';
    public static InvalidOrganizerStatus = 'InvalidOrganizerStatus';
    public static emailRequired = 'emailRequired';
    public static companyNameRequired = 'companyNameRequired';
    public static contactPersonRequired = 'contactPersonRequired';
    public static CompanyNameNotUnique = 'CompanyNameNotUnique';
    public static OrganizerImageNotSet = 'Organizer image not set';
    public static usernameNotUniqueAdminPanel = "usernameNotUniqueAdminPanel"
    public static emailNotUniqueAdminPanel = "emailNotUniqueAdminPanel"
    public static InvalidPermissions = "InvalidPermissions";
    public static SeatPlanDoesntExist = 'SeatPlanDoesntExist';
    public static UserDoesNotHaveStripeAccountId = "UserDoesNotHaveStripeAccountId"
    public static ChangingTicketHolderDueIsPassed = 'ChangingTicketHolderDueIsPassed';
    public static TooMuchData = 'TooMuchData';
    public static RevenueSharingIsNotANumber = "RevenueSharingIsNotANumber";  
    public static UserDoesNotExist = "UserDoesNotExist"; 
    public static ApplicationTypeNotDefined = "ApplicationTypeNotDefined";
    public static InvalidApplicationType = "InvalidApplicationType"; 
    public static AgeNotAllowed = "AgeNotAllowed";
    public static InvalidLang = "InvalidLang";
    public static eventIdRequired = 'EventIdRequired';
    public static qrUuidRequired = "qrUuidRequired";
    public static checkInIdRequired = "checkInIdRequired";
    public static checkInDoesNotExist = "checkInDoesNotExist";
}