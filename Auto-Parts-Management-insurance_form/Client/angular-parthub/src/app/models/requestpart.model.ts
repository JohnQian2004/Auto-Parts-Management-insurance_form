 
import { ImageModel } from "./imageModel.model";

export class RequestPart {
  id?: any;

  companyId?: any;
  // vendorId?: any;
  // paymentMethodId?: any;
  userId?: any;
  comments?: any;

  // //purchase Order 
  // source?: string;
  // approvedAt?: any;
  // approvedBy?: any;
  // purchaseStatus?: any;

  vin?: string;
  year: any = 0;
  make?: any;
  model?: any;
  engine?: string;
  transmission?: string;

  partName?: string;
  partNumber?: any;

  title!: string;
  description!: string;

  // published?: boolean;
  // postingAt?: any;

  archived?: boolean;

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
  //imageModels: ImageModel[] = new Array();

  serachCount?: number;

  viewCount?: any = 0;

  totalCount?: number;
  searchCount?: number;

  reason?: any;

  // fitmented?: boolean = false;

  // fitments?: Fitment[] = new Array();

  sortStr?: any;

  token?:any;

  location?: any = 0;
  
}