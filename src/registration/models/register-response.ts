export class RegisterResponse{
    //this will be set only in local dev mode..
    public emailVerificationGuid: string;
    
    // //*
    // //   This field should not be returned to end client
    // //   For testing purpose, before we implement integration with some email client
    // //   we will send this link in provided email for registration.
    // //
    // public verificationUrl: string;

    public message: string;
}