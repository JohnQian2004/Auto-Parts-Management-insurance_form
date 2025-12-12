package com.xoftex.parthub.models;

import jakarta.persistence.*;
import java.util.Date;

@Entity
@Table(name = "insurance_access")
public class InsuranceAccess extends AuditModel {
    
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
    
    @Column(name = "contact_email")
    private String contactEmail;
    
    @Column(name = "expires_at")
    private Date expiresAt;
    
    @Column(name = "is_active")
    private boolean isActive = true;
    
    public InsuranceAccess() {
    }
    
    public InsuranceAccess(String companyUuid, String publicUuid, String privateUuid, Long vehicleId,
                          String insuranceCompany, String contactEmail, Date expiresAt) {
        this.companyUuid = companyUuid;
        this.publicUuid = publicUuid;
        this.privateUuid = privateUuid;
        this.vehicleId = vehicleId;
        this.insuranceCompany = insuranceCompany;
        this.contactEmail = contactEmail;
        this.expiresAt = expiresAt;
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
    
    public String getContactEmail() {
        return contactEmail;
    }
    
    public void setContactEmail(String contactEmail) {
        this.contactEmail = contactEmail;
    }
    
    public Date getExpiresAt() {
        return expiresAt;
    }
    
    public void setExpiresAt(Date expiresAt) {
        this.expiresAt = expiresAt;
    }
    
    public boolean isActive() {
        return isActive;
    }
    
    public void setActive(boolean active) {
        isActive = active;
    }
}
