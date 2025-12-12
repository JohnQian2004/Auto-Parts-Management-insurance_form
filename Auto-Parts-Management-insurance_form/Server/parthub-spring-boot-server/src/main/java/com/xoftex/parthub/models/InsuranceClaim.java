package com.xoftex.parthub.models;

import jakarta.persistence.*;
import java.util.Date;

@Entity
@Table(name = "insurance_claims")
public class InsuranceClaim extends AuditModel {
    
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
    
    @Column(name = "claim_number")
    private String claimNumber;      // Insurance claim number
    
    private String status;           // PENDING, APPROVED, DENIED, IN_REVIEW
    
    private String comments;         // Insurance company comments
    
    @Column(name = "claim_date")
    private Date claimDate;
    
    @Column(name = "last_updated")
    private Date lastUpdated;
    
    @Column(name = "is_active")
    private boolean isActive = true;
    
    public InsuranceClaim() {
    }
    
    public InsuranceClaim(String companyUuid, String publicUuid, String privateUuid, Long vehicleId, 
                         String insuranceCompany, String claimNumber, String status, String comments) {
        this.companyUuid = companyUuid;
        this.publicUuid = publicUuid;
        this.privateUuid = privateUuid;
        this.vehicleId = vehicleId;
        this.insuranceCompany = insuranceCompany;
        this.claimNumber = claimNumber;
        this.status = status;
        this.comments = comments;
        this.claimDate = new Date();
        this.lastUpdated = new Date();
        this.isActive = true;
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
    
    public String getClaimNumber() {
        return claimNumber;
    }
    
    public void setClaimNumber(String claimNumber) {
        this.claimNumber = claimNumber;
    }
    
    public String getStatus() {
        return status;
    }
    
    public void setStatus(String status) {
        this.status = status;
    }
    
    public String getComments() {
        return comments;
    }
    
    public void setComments(String comments) {
        this.comments = comments;
    }
    
    public Date getClaimDate() {
        return claimDate;
    }
    
    public void setClaimDate(Date claimDate) {
        this.claimDate = claimDate;
    }
    
    public Date getLastUpdated() {
        return lastUpdated;
    }
    
    public void setLastUpdated(Date lastUpdated) {
        this.lastUpdated = lastUpdated;
    }
    
    public boolean isActive() {
        return isActive;
    }
    
    public void setActive(boolean active) {
        isActive = active;
    }
}
