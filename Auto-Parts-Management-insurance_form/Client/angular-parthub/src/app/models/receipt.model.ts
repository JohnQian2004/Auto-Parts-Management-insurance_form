
export class Receipt {

  id?: any = 0;
  name?: string;

  invoiceNumber?: string;

  comments?: string;

  amount: any;

  quantity: number = 1;

  userId?: number;

  vehicleId?: number;

  createdAt?: Date = new Date();
  updatedAt?: Date = new Date();

  reason?: string;

  notes: string = "";

  sequenceNumber?: any = 0;
  token?: any;
  itemType?: any = 0;

  claimId?: any = 0;
  autopartId?: any = 0;

}