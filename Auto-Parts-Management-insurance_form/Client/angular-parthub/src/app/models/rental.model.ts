export class Rental {

    id: any = 0;
    companyId: any = 0;

    name?: string;

    contactFirstName?: string;
    contactLastName?: string;

    url?: string;

    phone?: string;
    phone2?: string;
    phone3?: string;

    email?: string;



    userId?: number;



    createdAt: Date = new Date();
    updatedAt: Date = new Date();

    notes?: string;
}