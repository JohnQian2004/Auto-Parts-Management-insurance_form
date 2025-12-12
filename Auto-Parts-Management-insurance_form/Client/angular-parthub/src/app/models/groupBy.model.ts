import { Expense } from "./expense.model";

export class GroupBy {
  count: number = 0;
  status: number = 0;
  name: any;
  sequenceNumber?: any;
  totals: any =0 ;
  expenses: Expense[] = new Array();
  
}