import Stripe from "stripe";
import { LocalisationKey } from "../localisation/localisation-key";
import { StartIdVerificationFlowResponse } from "./models/start-id-verification-flow-response";

export class StripeErrorsTranslator {
    public translate(stripeErrors: Array<Stripe.Person.Requirements.Error>): string[] {
        const errors: string[] = [];

        if (stripeErrors
            && stripeErrors.length) {

            stripeErrors.forEach(element => {
                switch (element.code) {
                    case 'verification_document_name_mismatch':
                        errors.push(LocalisationKey.verification_document_name_mismatch);
                        break;
                    case 'verification_document_dob_mismatch':
                        errors.push(LocalisationKey.verification_document_dob_mismatch);
                        break;
                    case 'verification_document_address_mismatch':
                        errors.push(LocalisationKey.verification_document_address_mismatch);
                        break;
                    case 'verification_document_id_number_mismatch':
                        errors.push(LocalisationKey.verification_document_id_number_mismatch);
                        break;
                    case 'verification_document_fraudulent':
                    case 'verification_document_manipulated':
                    case 'verification_failed_other':
                    case 'verification_document_failed_other':
                        errors.push(LocalisationKey.verification_document_fraudulent);
                        break;
                    case 'verification_document_corrupt':
                    case 'verification_document_failed_copy':
                    case 'verification_document_failed_greyscale':
                    case 'verification_document_not_uploaded':
                    case 'verification_document_too_large':
                        errors.push(LocalisationKey.verification_document_corrupt);
                        break;
                    case 'verification_document_not_signed':
                        errors.push(LocalisationKey.verification_document_not_signed);
                        break;
                    case 'verification_document_missing_back':
                        errors.push(LocalisationKey.verification_document_missing_back);
                        break;
                    case 'verification_document_missing_front':
                        errors.push(LocalisationKey.verification_document_missing_front);
                        break;
                    case 'verification_document_expired':
                    case 'verification_document_issue_or_expiry_date_missing':
                        errors.push(LocalisationKey.verification_document_expired);
                        break;
                    case 'verification_document_country_not_supported':
                    case 'verification_document_invalid':
                    case 'verification_document_type_not_supported':
                        errors.push(LocalisationKey.verification_document_country_not_supported);
                        break;
                    case 'verification_failed_keyed_identity':
                        errors.push(LocalisationKey.verification_failed_keyed_identity);
                            
                    break;
                    default:
                        throw new Error(`Not supported stripe error found: ${element.code}`);
                }
            });
        }

        return errors;
    }
}