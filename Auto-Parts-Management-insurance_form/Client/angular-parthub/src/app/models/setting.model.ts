import { ApprovalStatus } from "./approval.status.model";
import { EmployeeRole } from "./employee.role.model";
import { JobRequestType } from "./job.request.type.model";
import { PaymentMethod } from "./payment.method.model";
import { PaymentStatus } from "./payment.status.model";
import { PaymentType } from "./payment.type.model";
import { Service } from "./service.model";
import { Status } from "./status.model";
import { Location } from "./location.model";
import { Company } from "./company.model";
import { Insurancer } from "./insurancer.model";
import { InTakeWay } from "./in.take.way.model";
import { Rental } from "./rental.model";
import { Vendor } from "./vendor.model";
import { Disclaimer } from "./disclaimer.model";
import { Employee } from "./employee.model";
import { KeyLocation } from "./key.location.model";
import { Warranty } from "./warranty.model";
import { ColumnInfo } from "./column.info.model";
import { ItemType } from "./item.type.model";
import { DocType } from "./doc.type.model";
import { User } from "./user.model";

export class Setting {

  employeeRoles: EmployeeRole[] = new Array();
  paymentMethods: PaymentMethod[] = new Array();
  JobRequestTypes: JobRequestType[] = new Array();
  jobRequestTypes: JobRequestType[] = new Array();
  paymentStatuss: PaymentStatus[] = new Array();
  employees: Employee[] = new Array();
  statuss: Status[] = new Array();
  paymentTypes: PaymentType[] = new Array();
  services: Service[] = new Array();
  approvalStatuss: ApprovalStatus[] = new Array();
  locations: Location[] = new Array();
  keyLocations: KeyLocation[] = new Array();
  insurancers: Insurancer[] = new Array();
  inTakeWays: InTakeWay[] = new Array();
  rentals: Rental[] = new Array();
  vendors: Vendor[] = new Array();
  disclaimers: Disclaimer[] = new Array();

  company: Company = new Company();
  warranties: Warranty[] = new Array();

  columnInfos: ColumnInfo[] = new Array();
  itemTypes: ItemType[] = new Array();
  docTypes: DocType[] = new Array();

  users:Employee[] = new Array();
}