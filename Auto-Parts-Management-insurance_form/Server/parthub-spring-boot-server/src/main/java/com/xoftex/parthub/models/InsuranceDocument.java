package com.xoftex.parthub.models;

import jakarta.persistence.*;
import java.util.Date;

@Entity
@Table(name = "insurance_documents")
public class InsuranceDocument extends AuditModel {
    
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    
    @Column(name = "company_uuid", length = 36)
    private String companyUuid;      // From insurancers table
    
    @Column(name = "public_uuid", length = 36)
    private String publicUuid;       // Vehicle identifier
    
    private Long vehicleId;
    
    @Column(name = "insurance_claim_id")
    private Long insuranceClaimId;   // Reference to insurance_claims table
    
    // Following existing DocType pattern
    @Column(name = "file_name")
    private String fileName;         // Original uploaded filename
    
    private String description;      // Document description
    
    @Column(name = "token", length = 36)
    private String token;            // UUID for file storage (like PdfFile pattern)
    
    // DocType categorization (following existing system)
    @Column(name = "doc_type_id")
    private Long docTypeId;          // Reference to DocType table
    
    @Column(name = "doc_type_name")
    private String docTypeName;      // Cached DocType name for quick access
    
    // File metadata
    @Column(name = "file_path")
    private String filePath;         // Server file path
    
    @Column(name = "file_size")
    private String fileSize;         // File size in bytes
    
    @Column(name = "mime_type")
    private String mimeType;         // MIME type
    
    private String version;          // Document version
    
    // Insurance company info
    @Column(name = "uploaded_by")
    private String uploadedBy;       // Insurance company name
    
    @Column(name = "uploaded_at")
    private Date uploadedAt;
    
    @Column(name = "last_modified")
    private Date lastModified;
    
    @Column(name = "is_active")
    private boolean isActive = true;
    
    // Following existing pattern for sequence and search
    @Column(name = "sequence_number")
    private int sequenceNumber;
    
    @Column(name = "show_in_search")
    private boolean showInSearch = false;
    
    public InsuranceDocument() {
    }
    
    public InsuranceDocument(String companyUuid, String publicUuid, Long vehicleId, String fileName, 
                           String description, Long docTypeId) {
        this.companyUuid = companyUuid;
        this.publicUuid = publicUuid;
        this.vehicleId = vehicleId;
        this.fileName = fileName;
        this.description = description;
        this.docTypeId = docTypeId;
        this.uploadedAt = new Date();
        this.lastModified = new Date();
        this.isActive = true;
        this.sequenceNumber = 0;
        this.showInSearch = false;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getCompanyUuid() {
        return companyUuid;
    }
    
    public void setCompanyUuid(String companyUuid) {
        this.companyUuid = companyUuid;
    }
    
    public String getPublicUuid() {
        return publicUuid;
    }
    
    public void setPublicUuid(String publicUuid) {
        this.publicUuid = publicUuid;
    }
    
    public Long getVehicleId() {
        return vehicleId;
    }
    
    public void setVehicleId(Long vehicleId) {
        this.vehicleId = vehicleId;
    }
    
    public Long getInsuranceClaimId() {
        return insuranceClaimId;
    }
    
    public void setInsuranceClaimId(Long insuranceClaimId) {
        this.insuranceClaimId = insuranceClaimId;
    }
    
    public String getFileName() {
        return fileName;
    }
    
    public void setFileName(String fileName) {
        this.fileName = fileName;
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public String getToken() {
        return token;
    }
    
    public void setToken(String token) {
        this.token = token;
    }
    
    public Long getDocTypeId() {
        return docTypeId;
    }
    
    public void setDocTypeId(Long docTypeId) {
        this.docTypeId = docTypeId;
    }
    
    public String getDocTypeName() {
        return docTypeName;
    }
    
    public void setDocTypeName(String docTypeName) {
        this.docTypeName = docTypeName;
    }
    
    public String getFilePath() {
        return filePath;
    }
    
    public void setFilePath(String filePath) {
        this.filePath = filePath;
    }
    
    public String getFileSize() {
        return fileSize;
    }
    
    public void setFileSize(String fileSize) {
        this.fileSize = fileSize;
    }
    
    public String getMimeType() {
        return mimeType;
    }
    
    public void setMimeType(String mimeType) {
        this.mimeType = mimeType;
    }
    
    public String getVersion() {
        return version;
    }
    
    public void setVersion(String version) {
        this.version = version;
    }
    
    public String getUploadedBy() {
        return uploadedBy;
    }
    
    public void setUploadedBy(String uploadedBy) {
        this.uploadedBy = uploadedBy;
    }
    
    public Date getUploadedAt() {
        return uploadedAt;
    }
    
    public void setUploadedAt(Date uploadedAt) {
        this.uploadedAt = uploadedAt;
    }
    
    public Date getLastModified() {
        return lastModified;
    }
    
    public void setLastModified(Date lastModified) {
        this.lastModified = lastModified;
    }
    
    public boolean isActive() {
        return isActive;
    }
    
    public void setActive(boolean active) {
        isActive = active;
    }
    
    public int getSequenceNumber() {
        return sequenceNumber;
    }
    
    public void setSequenceNumber(int sequenceNumber) {
        this.sequenceNumber = sequenceNumber;
    }
    
    public boolean isShowInSearch() {
        return showInSearch;
    }
    
    public void setShowInSearch(boolean showInSearch) {
        this.showInSearch = showInSearch;
    }
}
