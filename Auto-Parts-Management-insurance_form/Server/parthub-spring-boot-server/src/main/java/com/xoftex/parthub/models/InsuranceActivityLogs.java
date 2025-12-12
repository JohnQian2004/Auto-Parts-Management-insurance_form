package com.xoftex.parthub.models;

import jakarta.persistence.*;
import java.util.Date;

@Entity
@Table(name = "insurance_activity_logs")
public class InsuranceActivityLogs extends AuditModel {
    
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    
    @Column(name = "company_uuid", length = 36)
    private String companyUuid;      // From insurancers table
    
    @Column(name = "public_uuid", length = 36)
    private String publicUuid;       // Vehicle identifier
    
    @Column(name = "private_uuid", length = 36)
    private String privateUuid;      // Access token (never in URL)
    
    private Long vehicleId;
    
    private String insuranceCompany;
    
    @Column(name = "action_type")
    private String actionType; // ACCESS, VIEW, UPDATE, COMMENT, DOCUMENT_UPLOAD, DOCUMENT_UPDATE
    
    @Column(name = "ip_address")
    private String ipAddress;
    
    @Column(name = "accessed_at")
    private Date accessedAt;
    
    @Column(name = "expires_at")
    private Date expiresAt;
    
    @Column(name = "is_expired")
    private boolean isExpired = false;
    
    @Column(name = "document_reference")
    private String documentReference; // Reference to uploaded/updated documents
    
    public InsuranceActivityLogs() {
    }
    
    public InsuranceActivityLogs(String companyUuid, String publicUuid, String privateUuid, Long vehicleId,
                                String insuranceCompany, String actionType, String ipAddress) {
        this.companyUuid = companyUuid;
        this.publicUuid = publicUuid;
        this.privateUuid = privateUuid;
        this.vehicleId = vehicleId;
        this.insuranceCompany = insuranceCompany;
        this.actionType = actionType;
        this.ipAddress = ipAddress;
        this.accessedAt = new Date();
        this.isExpired = false;
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
    
    public String getPrivateUuid() {
        return privateUuid;
    }
    
    public void setPrivateUuid(String privateUuid) {
        this.privateUuid = privateUuid;
    }
    
    public Long getVehicleId() {
        return vehicleId;
    }
    
    public void setVehicleId(Long vehicleId) {
        this.vehicleId = vehicleId;
    }
    
    public String getInsuranceCompany() {
        return insuranceCompany;
    }
    
    public void setInsuranceCompany(String insuranceCompany) {
        this.insuranceCompany = insuranceCompany;
    }
    
    public String getActionType() {
        return actionType;
    }
    
    public void setActionType(String actionType) {
        this.actionType = actionType;
    }
    
    public String getIpAddress() {
        return ipAddress;
    }
    
    public void setIpAddress(String ipAddress) {
        this.ipAddress = ipAddress;
    }
    
    public Date getAccessedAt() {
        return accessedAt;
    }
    
    public void setAccessedAt(Date accessedAt) {
        this.accessedAt = accessedAt;
    }
    
    public Date getExpiresAt() {
        return expiresAt;
    }
    
    public void setExpiresAt(Date expiresAt) {
        this.expiresAt = expiresAt;
    }
    
    public boolean isExpired() {
        return isExpired;
    }
    
    public void setExpired(boolean expired) {
        isExpired = expired;
    }
    
    public String getDocumentReference() {
        return documentReference;
    }
    
    public void setDocumentReference(String documentReference) {
        this.documentReference = documentReference;
    }
}
