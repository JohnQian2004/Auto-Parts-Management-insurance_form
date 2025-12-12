import { ImageModel } from "./imageModel.model";


export class ExpenseType {
  id?: any = 0;
  name?: string;
  comments?: string;
  userId?: number;

  companyId?: number;
  sequenceNumber: number = 0;

  imageModels: ImageModel[] = new Array();

  color?: string;
}