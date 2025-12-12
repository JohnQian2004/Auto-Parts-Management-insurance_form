export class Customer {

    id: any = 0;

    title?: string;

    firstName?: string = "";
    lastName?: any = "";

    phone?: any;
    phone2?: string;
    phone3?: string;

    email?: string;
    street?: string;

    city?: string;
    state?: string;
    zip?: string;

    notes?: string;

    createdAt: Date = new Date();
    updatedAt: Date = new Date();

    companyId?: number = 0;

    archived?: boolean = false;

    serachCount?: number = 0;
    totalCount?: number = 0;
    token?:any;

}