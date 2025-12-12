import { AutoPart } from "./autopart.model";
import { Claim } from "./claim.model";
import { Job } from "./job.model";

import { Receipt } from "./receipt.model";

export class EstimateResponse {

    message: string = "";
    estimates: Claim[] = new Array();
    autoparts: AutoPart[] = new Array();
    jobs: Job[] = new Array();
    receipts: Receipt[] = new Array();
 
}