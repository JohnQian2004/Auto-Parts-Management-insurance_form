export class ParsedLine {
  index: any = 0;
  employeeId?: any = 0;
  wildCard: any = " ";

  oper: any = "";
  line: any = "";
  description: any = "";
  partNumber: any = "";
  isParts: boolean = false;
  qty: any = "";
  labor: any = "";
  extendedPrice: any = "";
  paint: any = "";
  isValid?: boolean = false;
  isSkipped: boolean = false;
  notes: Array<{ index: any, line: any }> = new Array();
}
