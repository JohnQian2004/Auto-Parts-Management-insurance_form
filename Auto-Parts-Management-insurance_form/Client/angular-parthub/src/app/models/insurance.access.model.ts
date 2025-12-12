export class InsuranceAccess {

    id?: any = 0;
    
    companyUuid?: string;      // From insurancers table
    publicUuid?: string;       // Vehicle identifier
    privateUuid?: string;      // Access token (never in URL)
    
    vehicleId?: number;
    insuranceCompany?: string;
    contactEmail?: string;
    expiresAt?: Date;
    isActive: boolean = true;
    
    createdAt?: Date = new Date();
    updatedAt?: Date = new Date();
}
