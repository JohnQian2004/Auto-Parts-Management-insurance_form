import { Job } from "./job.model";
import { Vehicle } from "./vehicle.model";


export class PayrollHistory {
  id?: any = 0;
  userId?: number;
  companyId?: number;

  jobId?: number;
  week: number = 0;
  year: number = 0;

  vehicle: Vehicle = new Vehicle();
  job: Job = new Job();

  createdAt?:any;

}