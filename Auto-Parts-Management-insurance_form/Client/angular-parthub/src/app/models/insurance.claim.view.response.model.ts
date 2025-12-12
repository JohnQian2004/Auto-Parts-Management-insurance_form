import { Vehicle } from "./vehicle.model";
import { InsuranceClaim } from "./insurance.claim.model";
import { InsuranceDocument } from "./insurance.document.model";

export class InsuranceClaimViewResponse {

    vehicle?: Vehicle;
    insuranceClaims?: InsuranceClaim[];
    documents?: InsuranceDocument[];
}
