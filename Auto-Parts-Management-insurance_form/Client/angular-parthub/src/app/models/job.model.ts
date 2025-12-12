import { Employee } from "./employee.model";
import { ImageModel } from "./imageModel.model";

export class Job {
  [x: string]: any;

  id?: any = 0;
  name?: string;
  errorMessage?: string;
  userName?: any;
  steps?: any = 0;
  stepsPrecent?: any;
  stepDescription?: any;
  stepDescriptionCumulative?: any;
  nextStepDescription?: any;

  comments?: string;

  userId?: number;
  imageModels: ImageModel[] = new Array();
  showInSearchImageId?: any;
  vehicleId?: number;
  serviceId?: number;
  employeeId: number = 0;

  status?: number;
  archived?: number;

  employees?: Employee[] = new Array();
  token?: any;
  targetDate?: Date = new Date();
  startDate?: Date = new Date();
  endDate?: Date = new Date();
  createdAt?: Date = new Date();
  updatedAt?: Date = new Date();
  notifiedAt?: Date = new Date();
  verifiedAt?: Date = new Date()

  price?: any;

  reason?: string;

  notes: string = "";

  jobRequestType: number = 0;
  paymentMethod: number = 0;
  sequenceNumber?: any = 0;

  paiedYear?: any;
  paidWeek?: any;
  paidDate?: any;

  claimId?: any;

  userIdVerified?: any;



  notified?: boolean = false;

  hours?: any = 0;
  
  index?: any = 0;
}