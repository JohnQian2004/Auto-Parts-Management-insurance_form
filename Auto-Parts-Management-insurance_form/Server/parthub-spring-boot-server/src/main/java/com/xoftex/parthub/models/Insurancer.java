package com.xoftex.parthub.models;

import jakarta.persistence.*;

@Entity
@Table(name = "insurancers")
public class Insurancer extends AuditModel {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    private String name; // GEICO
    private String url;

    private Long companyId;

    private String contactFirstName;
    private String contactLastName;

    private String email;

    private String phone;
    private String phone2;
    private String phone3;

    private String notes;

    private Long userId;

    @Column(name = "token", length = 36)
    private String token; // UUID for company-specific routing

    public Insurancer() {

    }

    public Insurancer(Long id, String name, String url, Long companyId, String contactFirstName, String contactLastname,
            String email, String phone, String phone2, String phon3, String notes, Long userId) {
        this.id = id;
        this.name = name;
        this.url = url;
        this.companyId = companyId;
        this.contactFirstName = contactFirstName;
        this.contactLastName = contactLastname;
        this.email = email;
        this.phone = phone;
        this.phone2 = phone2;
        this.phone3 = phon3;
        this.notes = notes;
        this.userId = userId;
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

    public void setCompanyId(Long companyId) {
        this.companyId = companyId;
    }

    public void setContactFirstName(String contactFirstName) {
        this.contactFirstName = contactFirstName;
    }

    public void setContactLastName(String contactLastname) {
        this.contactLastName = contactLastname;
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

    public void setPhone3(String phon3) {
        this.phone3 = phon3;
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

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    
}