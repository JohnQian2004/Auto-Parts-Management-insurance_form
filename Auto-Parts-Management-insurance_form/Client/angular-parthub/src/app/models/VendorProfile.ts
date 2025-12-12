export class VendorProfile {
    id?: number;
    userId?: number;
    companyName: string = '';
    businessLicense: string = '';
    taxId: string = '';
    contactPerson: string = '';
    businessAddress: string = '';
    businessPhone: string = '';
    businessEmail: string = '';
    websiteUrl: string = '';
    businessDescription: string = '';
    verificationStatus: string = 'PENDING';
    verificationDate?: string;
    verifiedById?: number;
    subscriptionPlanId?: number;
    commissionRate: number = 10.00;
    paymentTerms: string = '30_days';
    bankAccountInfo: string = '';
    businessDocuments: string = '';
    createdAt?: string;
    lastModifiedAt?: string;
}