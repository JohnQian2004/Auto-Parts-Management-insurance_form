
export class PurchaseOrder {
  id?: any;

  companyId?: any;
  vendorId?: any;
  paymentMethodId?: any;
  userId?: any;
  comments?: string;

  //purchase Order 
  source?: string;
  approvedAt?: any;
  approvedBy?: any;
  purchaseStatus?: any;

  vin?: string;
  year: number = 0;
  make?: string;
  model?: string;
  engine?: string;
  transmission?: string;

  partName?: string;
  partNumber?: any;
  token?: any;
  title!: string;
  description!: string;

  published?: boolean;
  archived?: boolean;

  status?: number; //0: created 1: for approval 2: approved 4: 

  price?: any;
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

  reason?:any;

}