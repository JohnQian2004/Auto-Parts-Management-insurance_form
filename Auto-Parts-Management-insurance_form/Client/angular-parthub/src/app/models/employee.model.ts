import { Job } from "./job.model";
import { Vehicle } from "./vehicle.model";

export class Employee {

    id: any = 0;
    companyId?: number;
    roleId?: number;

    roleName?: any;
    rolePrecentage?: any;

    type?: number; //place holder
    title?: string;


    firstName?: any = "";
    lastName?: any = "";

    phone?: string;
    email?: string;



    userId?: number;


    url?: any;
    createdAt: Date = new Date();
    updatedAt: Date = new Date();

    notes?: string;

    status?: number = 0;

    selected?: boolean;

    jobId?: number = 0;

    jobs?: any[] = new Array();

    commissionBased?: boolean = false;

    token?: any = "";

    vehicles?: Vehicle[] = new Array();

    jobCountsUnfinished?: any = 0;

    jobCountsFinished?: any = 0;

    shallResetToken?:boolean = false;

    hourRate?:any = 0;

}