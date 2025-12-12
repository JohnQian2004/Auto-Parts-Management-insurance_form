export class ImageModel {
  id?: any;
  autopartId?: any;
  vehicleId?: any;
  jobId?: any;
  employeeId?: any;
  userId?: any;
  userName?: any;

  size?: number;
  fileName?: string;

  fileType?: any;

  published?: boolean;
  picByte?: any[];

  showInSearch?: boolean;

  sequenceNumber?: any = 0;

  description?: any = "";

  createdAt?: any;

  toggle?: boolean = false;

  docType?: any = 0;
  docTypeName: any = "";
  reason?: any;

  paymentId?: any = 0;

  expenseId?: any = 0;
}