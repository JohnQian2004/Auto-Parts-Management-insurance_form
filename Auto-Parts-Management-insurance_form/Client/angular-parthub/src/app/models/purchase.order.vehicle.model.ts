
export class PurchaseOrderVehicle {
  id?: any;

  vehicleId?: any;

  companyId?: any;
  vendorId?: any;
  paymentMethodId?: any;
  userId?: any;
  comments?: string;

  autopartId?:any;
  claimId?:any;

  //purchase Order 
  source?: string;

  updatedAt?: any;

  approvedAt?: any;
  approvedBy?: any;

  rejectedAt?: any;
  rejectedBy?: any;

  submittedAt?: any;
  submittedBy?: any;



  purchaseStatus?: any;
  sequenceNumber?: any;
  // vin?: string;
  // year: number = 0;
  // make?: string;
  // model?: string;
  // engine?: string;
  // transmission?: string;

  partName?: string;
  partNumber?: any;

  title!: any;
  description!: any;

  published?: boolean;
  archived?: boolean;

  status: number = 0; //0: created 1: for approval 2: approved 4: 

  price?: any;
  salePrice?: any;
  grade?: any;
  distance?: string;

  shipping?: string;
  warranty?: string;
  stocknumber?: string;

  bussinessName?: string;
  bussinessUrl?: string;

  phone?: string;

  city?: string;
  state?: string;
  zip?: string;

  lat?: any;
  lng?: any;

  createdAt?: any;

  showInSearchImageId?: number;

  showSavedButton?: boolean = false;


  serachCount?: number;

  viewCount?: number;

  totalCount?: number;
  searchCount?: number;

  reason?: any;

  received?: boolean;
  receivedAt?: any;

  ordered?: boolean;
  orderedAt?: any;

  returned?: boolean;
  returnedAt?: any;

  sortStr?: any;

  autoparts:any[] = new Array();
  token?: any;
}