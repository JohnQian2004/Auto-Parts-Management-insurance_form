
import { Vehicle } from './vehicle.model';

export class Status {
  id?: any = 0;
  name?: string;
  comments?: string;
  userId?: number;

  companyId?: number;

  sequenceNumber: number = 0;

  vehicles?: any[] = new Array();

  color?: string;

}