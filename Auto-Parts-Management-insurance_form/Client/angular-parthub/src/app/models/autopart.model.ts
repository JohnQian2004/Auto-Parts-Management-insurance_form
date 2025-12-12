import { Fitment } from "./fitment.model";
import { ImageModel } from "./imageModel.model";

export class AutoPart {
  id?: any;

  companyId?: any;
  vehicleId?: any;
  userName?: any;
  employeeId?: any;

  vendorId?: any;
  paymentMethodId?: any;
  userId?: any;
  comments?: any;

  //purchase Order 
  source?: string;
  approvedAt?: any;
  approvedBy?: any;
  purchaseStatus?: any = undefined;

  vin?: string;
  year: any = 0;
  make?: any;
  model?: any;
  trim?: any;
  submodel?: any;
  engineDesc?: any;

  engine?: string;
  transmission?: string;

  partName?: string;
  partNumber?: any = "";

  title!: any;
  description!: string;

  published?: boolean;
  postingAt?: any;

  archived?: boolean;
  received?: boolean;
  receivedAt?: any;

  ordered?: boolean;
  orderedAt?: any;

  returned?: boolean;
  returnedAt?: any;
  updatedAt?: any;
  status?: number; //0: received 1: return 2: inventory 4: sth

  price?: any;
  salePrice?: any;

  grade?: any;
  distance?: any;

  shipping?: string = "FLP";
  warranty?: string;
  stocknumber?: any = "";

  bussinessName?: string;
  bussinessUrl?: string;

  phone?: string;

  street?: string;
  city?: string;
  state?: string;
  zip?: string;

  lat?: any;
  lng?: any;

  createdAt?: any;

  showInSearchImageId?: any;

  showSavedButton?: boolean = false;

  //picByte: any[];
  imageModels: ImageModel[] = new Array();

  serachCount?: number;

  viewCount?: any = 0;

  totalCount?: number;
  searchCount?: number;

  reason?: any;

  fitmented?: boolean = false;

  fitments?: Fitment[] = new Array();

  sortStr?: any;

  token?: any;

  sequenceNumber?: any = 0;

  purchaseOrderId?: any;
  claimId?: any;

  location?: any = 0;

  quantity?: any = 0;

  index?: any = 0

}