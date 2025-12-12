
import { Vehicle } from './vehicle.model';

export class Supplement {
  id?: any = 0;

  vehicleId?:any = 0;

  price?: any = 0;

  status?:any =0;
  
  name?: string;
  description?: string;


  userId?: number;
  companyId?: number;


  sequenceNumber: number = 0;

  createdAt: Date = new Date()
  updatedAt: Date = new Date();
  
  reason?:any;
  token?:any;
}