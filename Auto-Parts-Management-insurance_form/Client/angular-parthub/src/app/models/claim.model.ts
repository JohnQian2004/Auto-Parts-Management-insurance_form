import { AutoPart } from "./autopart.model";
import { Job } from "./job.model";
import { PurchaseOrderVehicle } from "./purchase.order.vehicle.model";

export class Claim {

  id?: any = 0;
  name: any = "";

  itemNumber?: string;

  operation?: any;

  labor: number = 0;

  laborIncluded: boolean = false;

  paint: number = 0;

  partNumber?: any;

  token?: any;

  comments?: string;

  amount: any;

  quantity: number = 1;

  userId?: number;

  vehicleId?: number;

  createdAt?: Date = new Date();
  updatedAt?: Date = new Date();
  lockedAt?: Date = new Date();

  reason?: string;

  notes: string = "";

  sequenceNumber?: any = 0;

  status?: any = 0 //for lock and unlock

  itemType?: any = 0;

  purchaseOrders: PurchaseOrderVehicle[] = new Array();
  jobs: Job[] = new Array();
  autoparts: AutoPart[] = new Array();

  createJobOrder: boolean = false;
  createPurchaseOrder: boolean = false;

  index?: any = 0;
}