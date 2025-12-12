package com.xoftex.parthub.models;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "comapanies")
public class Company extends AuditModel {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private Long type = new Long(0); // what

    private String name;

    private String email;

    private String url;

    private String phone;

    @Column(columnDefinition = "MEDIUMBLOB")
    private byte[] icon;

    @Transient
    public String iconString;

    private String street;

    private String city;

    private String state;

    private String zip;

    private String notes;

    @Column(name = "token", length = 36)
    @JsonIgnore
    private String token;

    private Long userId;

    private float taxRate; // 0.06

    private float managementRate; // 0.5

    private int status = 0; // 0:active 1: inactive 2: later

    @Transient
    public int searchCount = 0;

    @Transient
    public int vehicleTotalCount = 0;

    @Transient
    public int vehicleInshopCount = 0;

    @Transient
    public int vehicleArchivedCount = 0;

    @Size(max = 2000)
    private String slogan;

    public Company() {

    }

    public void setIconString(String iconString) {
        this.iconString = iconString;
    }

    public Company(Long id, Long type, String name, String url, String phone, byte[] icon, String street, String city,
            String state, String zip, Long userId) {
        this.id = id;
        this.type = type;
        this.name = name;
        this.url = url;
        this.phone = phone;
        this.icon = icon;
        this.street = street;
        this.city = city;
        this.state = state;
        this.zip = zip;
        this.userId = userId;
    }

    public void setManagementRate(float managementRate) {
        this.managementRate = managementRate;
    }

    public void setSlogan(String slogan) {
        this.slogan = slogan;
    }

    public void setTaxRate(float taxRate) {
        this.taxRate = taxRate;
    }

    public float getTaxRate() {
        return taxRate;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setType(Long type) {
        this.type = type;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public void setIcon(byte[] icon) {
        this.icon = icon;
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

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Long getId() {
        return id;
    }

    public Long getType() {
        return type;
    }

    public String getName() {
        return name;
    }

    public String getUrl() {
        return url;
    }

    public String getPhone() {
        return phone;
    }

    public byte[] getIcon() {
        return icon;
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

    public Long getUserId() {
        return userId;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public String getNotes() {
        return notes;
    }

    public String getIconString() {
        return iconString;
    }

    public String getSlogan() {
        return slogan;
    }

    public float getManagementRate() {
        return managementRate;
    }

    public int getStatus() {
        return status;
    }

    public void setStatus(int status) {
        this.status = status;
    }
}
