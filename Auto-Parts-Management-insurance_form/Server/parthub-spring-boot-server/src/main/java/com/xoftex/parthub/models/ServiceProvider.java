package com.xoftex.parthub.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "serviceproviders")
public class ServiceProvider extends AuditModel {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    private String name; // Key Maker
    private String url;

    // @ManyToOne(cascade = CascadeType.DETACH, fetch = FetchType.LAZY, optional =
    // false)
    // @JoinColumn(name = "service_type_id", nullable = true)
    // public ServiceType serviceType;
    private Long serviceTypeId;

    @Size(max = 2000)
    private String serviceDescription;

    private Long companyId;

    private String contactFirstName;
    private String contactLastName;

    private String email;

    private String phone;
    private String phone2;
    private String phone3;

    @Size(max = 200)
    private String street;

    @Size(max = 200)
    private String city;

    @Size(max = 200)
    private String state;

    @Size(max = 20)
    private String zip;

    @Size(max = 2000)
    private String notes;

    private Long userId;

    private boolean archived = false;

    @Transient
    public long distance;

    @Transient
    public int searchCount;
    
    public ServiceProvider() {

    }

    public long getDistance() {
        return distance;
    }

    public int getSearchCount() {
        return searchCount;
    }

    public void setDistance(long distance) {
        this.distance = distance;
    }

    public void setSearchCount(int searchCount) {
        this.searchCount = searchCount;
    }

    public void setStreet(String street) {
        this.street = street;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public void setState(String state) {
        this.state = state;
    }

    public void setZip(String zip) {
        this.zip = zip;
    }

    public String getStreet() {
        return street;
    }

    public String getCity() {
        return city;
    }

    public String getState() {
        return state;
    }

    public String getZip() {
        return zip;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public void setServiceTypeId(Long serviceTypeId) {
        this.serviceTypeId = serviceTypeId;
    }

    public void setServiceDescription(String serviceDescription) {
        this.serviceDescription = serviceDescription;
    }

    public void setCompanyId(Long companyId) {
        this.companyId = companyId;
    }

    public void setContactFirstName(String contactFirstName) {
        this.contactFirstName = contactFirstName;
    }

    public void setContactLastName(String contactLastName) {
        this.contactLastName = contactLastName;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public void setPhone2(String phone2) {
        this.phone2 = phone2;
    }

    public void setPhone3(String phone3) {
        this.phone3 = phone3;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getUrl() {
        return url;
    }

    public Long getServiceTypeId() {
        return serviceTypeId;
    }

    public String getServiceDescription() {
        return serviceDescription;
    }

    public Long getCompanyId() {
        return companyId;
    }

    public String getContactFirstName() {
        return contactFirstName;
    }

    public String getContactLastName() {
        return contactLastName;
    }

    public String getEmail() {
        return email;
    }

    public String getPhone() {
        return phone;
    }

    public String getPhone2() {
        return phone2;
    }

    public String getPhone3() {
        return phone3;
    }

    public String getNotes() {
        return notes;
    }

    public Long getUserId() {
        return userId;
    }

    public boolean isArchived() {
        return archived;
    }

    public void setArchived(boolean archived) {
        this.archived = archived;
    }

}