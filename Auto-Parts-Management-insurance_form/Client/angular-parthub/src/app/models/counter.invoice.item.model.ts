
export class CounterInvoiceItem {

  id?: any = 0;
  name?: string;

  invoiceNumber?: string;

  comments?: string;

  quantity: number = 1;
  
  amount: number = 0;

  userId?: number;

  counterInvoiceId?: number;

  createdAt?: Date = new Date();
  updatedAt?: Date = new Date();

  reason?: string;

  notes: string = "";

  sequenceNumber?: any = 0;
  token?:any;
}