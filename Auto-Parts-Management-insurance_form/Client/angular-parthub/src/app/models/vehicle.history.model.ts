
export class VehicleHistory {

  id?: any;
  type?: number;
  typeString?: any;
  iconClassString?:any;
  colorClassString?:any;
  
  name: any;
  value?: string;
  userId?: number;

  objectKey: any;

  objectContextType?: any = 0; //1: vehicle image 2: part image
  objectContext?: any; //e.g href

  objectString?: any;
  objectName?: any;

  createdAt?: Date;
  updatedAt?: Date;

  userName?: any;

  employeeId?:any;

  iconName?:any;
}