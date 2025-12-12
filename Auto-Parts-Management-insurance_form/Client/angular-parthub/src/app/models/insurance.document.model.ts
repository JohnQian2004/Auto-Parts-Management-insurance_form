export class InsuranceDocument {

    id?: any = 0;
    
    companyUuid?: string;      // From insurancers table
    publicUuid?: string;       // Vehicle identifier
    vehicleId?: number;
    insuranceClaimId?: number; // Reference to insurance_claims table
    
    // Following existing DocType pattern
    fileName?: string;         // Original uploaded filename
    description?: string;      // Document description
    token?: string;            // UUID for file storage (like PdfFile pattern)
    
    // DocType categorization (following existing system)
    docTypeId?: number;        // Reference to DocType table
    docTypeName?: string;      // Cached DocType name for quick access
    
    // File metadata
    filePath?: string;         // Server file path
    fileSize?: string;         // File size in bytes
    mimeType?: string;         // MIME type
    version?: string;          // Document version
    
    // Insurance company info
    uploadedBy?: string;       // Insurance company name
    uploadedAt?: Date = new Date();
    lastModified?: Date = new Date();
    isActive: boolean = true;
    
    // Following existing pattern for sequence and search
    sequenceNumber: number = 0;
    showInSearch: boolean = false;
    
    createdAt?: Date = new Date();
    updatedAt?: Date = new Date();
}
