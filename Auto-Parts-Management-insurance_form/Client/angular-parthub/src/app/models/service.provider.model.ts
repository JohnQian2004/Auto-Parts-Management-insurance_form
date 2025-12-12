export class ServiceProvider {

    id: any = 0;
    companyId: any = 0;

    serviceTypeId?: any ;
    serviceDescription?: any = "";

    name: string = "";

    contactFirstName: string = "";
    contactLastName?: string = "";

    url?: string;

    phone?: string;
    phone2?: string;
    phone3?: string;


    street: string = "";
    city: string = "";
    state?: any;
    zip: string = "";

    email?: string;



    userId?: number;

    archived?: boolean = false;

    createdAt: Date = new Date();
    updatedAt: Date = new Date();

    notes?: string;

    distance: number = 0;

    sortStr: any ="";

    searchCount?:any ;
}