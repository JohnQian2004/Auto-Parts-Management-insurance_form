import { Employee } from "./employee.model";
import { ImageModel } from "./imageModel.model";
import { Vehicle } from "./vehicle.model";

export class Payment {

  id?: any = 0;
  name?: string;
  comments?: string;

  amount?: any = 0;

  userId?: number;

  userIdVerified?: any;
  dateVerified?: Date = new Date();
  notesVerified?: string = "";

  vehicleId?: number;

  paymentTypeId?: number;
  paymentMethodId?: number;

  paymentStatusId: number = 0;

  date?: Date = new Date();

  reason?: string;

  notes: string = "";
  token?: any;

  sequenceNumber?: any = 0;

  createdAt?: Date = new Date();
  updatedAt?: Date = new Date();

  imageModels?: ImageModel[] = new Array();
  showInSearchImageId?: any;

  vehicle?:Vehicle;
  
}