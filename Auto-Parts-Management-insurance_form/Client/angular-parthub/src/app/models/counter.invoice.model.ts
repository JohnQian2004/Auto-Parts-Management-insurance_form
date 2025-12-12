import { Customer } from "./customer.model";

export class CounterInvoice {

  id?: any = 0;
  name?: string;
  type?: string;

  invoiceNumber?: string;

  comments?: string;

  amount: number = 0;

  userId?: number;

  customerId?: number;
  companyId?: number;
  paymentMethod?: number;

  createdAt?: Date = new Date();
  updatedAt?: Date = new Date();

  reason?: string;

  notes: string = "";

  sequenceNumber?: any = 0;

  customer?: Customer = new Customer();

  itemCounts?: number;

  totalCount?: any = 0;
  searchCount?: any = 0;


  headingName = "Item";
  headingDescription = "Description";
  headingQuantity = "Qty";
  headingAmount = "Price($)";
  headingSubtotal = "Subtotal";
  noTax: boolean = false;
  token?:any;
}