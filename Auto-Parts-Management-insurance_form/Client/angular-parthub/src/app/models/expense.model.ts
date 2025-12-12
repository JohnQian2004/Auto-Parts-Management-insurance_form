import { ImageModel } from "./imageModel.model";


export class Expense {

  id?: any = 0;

  companyId?: number;
  userId?: number;
  vendorId: number = 0;
  expenseTypeId: number = 0;
  paymentMethodId: number = 0;

  itemNumber?: any = "";

  amount?: any = 0;

  quantity?: any = 0;

  subtotal?: any = 0;

  token?: any = "";


  name?: string;
  comments?: string;


  sequenceNumber: number = 0;

  reason?: any = "";
  //imageModels: ImageModel[] = new Array();
  createdAt?: any;
  updatedAt?: any;
  
  searchCount: any = 0;

  imageModels: ImageModel[] = new Array();
  showInSearchImageId?: any;

  paid:boolean = false;
  paidAt?: any;

}