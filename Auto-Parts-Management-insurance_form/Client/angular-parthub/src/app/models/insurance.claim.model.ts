export class InsuranceClaim {

    id?: any = 0;
    
    companyUuid?: string;      // From insurancers table
    publicUuid?: string;       // Vehicle identifier
    privateUuid?: string;      // Access token (never in URL)
    
    vehicleId?: number;
    insuranceCompany?: string;
    claimNumber?: string;      // Insurance claim number
    status?: string;           // PENDING, APPROVED, DENIED, IN_REVIEW
    comments?: string;         // Insurance company comments
    
    claimDate?: Date = new Date();
    lastUpdated?: Date = new Date();
    isActive: boolean = true;
    
    createdAt?: Date = new Date();
    updatedAt?: Date = new Date();
}
