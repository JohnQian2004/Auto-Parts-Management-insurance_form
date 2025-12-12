export class Company {

    id: any = 0;
    type?: number; //place holder
    name?: string;

    url?: string;

    phone?: string;
    email?: string;

    street?: string;

    city?: string;
    state?: string;
    zip?: string;

    userId?: number;

    taxRate: number = 0;

    managementRate: number = 0;

    icon?: any[];
    iconString?: string;

    slogan?: string;

    createdAt: Date = new Date();
    updatedAt: Date = new Date();

    notes?: string;

    status?:any;

    searchCount?:any;
    vehicleTotalCount?:any;
    vehicleInshopCount?:any;
    vehicleArchivedCount?:any;


}