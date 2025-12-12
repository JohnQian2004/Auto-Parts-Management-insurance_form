import { Job } from "./job.model";

export class Service {
  id?: any = 0;
  name?: string;
  comments?: string;
  userId?: number;

  companyId?: number;
  sequenceNumber: number = 0;
  job: Job = new Job();
}