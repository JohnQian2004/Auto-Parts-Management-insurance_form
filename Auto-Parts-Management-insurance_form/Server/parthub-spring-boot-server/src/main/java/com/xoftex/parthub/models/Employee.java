package com.xoftex.parthub.models;

import java.util.HashSet;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;

@Entity
@Table(name = "employees")
@JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
public class Employee extends AuditModel {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;

    @Column(name = "role_Id")
    private long roleId = 0;

    private String title; // General Manager/manager/Owner/Writer etc.

    private long companyId;

    private String firstName;

    private String lastName;

    private String phone;

    private String email;

    private Long userId;

    private String notes;

    private boolean commissionBased = false;

    private int status = 0; // like suspended removed etc

    @Transient
    private boolean shallResetToken = false;

    @Column(name = "token", length = 36)
    private String token;

    @Transient
    private boolean selected = false;

    // @ManyToMany(mappedBy = "employees")
    // @JsonIgnore
    // @OrderBy("year")
    @Transient
    private Set<Vehicle> vehicles = new HashSet<>();

    @Transient
    private Set<Job> jobs = new HashSet<>();

    @Transient
    private int jobCountsUnfinished = 0;

    @Transient
    private int jobCountsFinished = 0;

    private float hourRate = 0;

    public Employee() {

    }

    public Employee(long id, String title, long companyId, String firstName, String lastName, String phone,
            String email, String notes, Set<Vehicle> vehicles) {
        this.id = id;

        this.title = title;
        this.companyId = companyId;
        this.firstName = firstName;
        this.lastName = lastName;
        this.phone = phone;
        this.email = email;
        this.notes = notes;
        this.vehicles = vehicles;
    }

    public void setId(long id) {
        this.id = id;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public void setCompanyId(long companyId) {
        this.companyId = companyId;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public void setVehicles(Set<Vehicle> vehicles) {
        this.vehicles = vehicles;
    }

    public long getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public long getCompanyId() {
        return companyId;
    }

    public String getFirstName() {
        return firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public String getPhone() {
        return phone;
    }

    public String getEmail() {
        return email;
    }

    public String getNotes() {
        return notes;
    }

    public Set<Vehicle> getVehicles() {
        return vehicles;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public int getStatus() {
        return status;
    }

    public void setStatus(int status) {
        this.status = status;
    }

    public boolean isSelected() {
        return selected;
    }

    public void setSelected(boolean selected) {
        this.selected = selected;
    }

    public long getRoleId() {
        return roleId;
    }

    public void setRoleId(long roleId) {
        this.roleId = roleId;
    }

    public boolean isCommissionBased() {
        return commissionBased;
    }

    public void setCommissionBased(boolean commissionBased) {
        this.commissionBased = commissionBased;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public int getJobCountsUnfinished() {
        return jobCountsUnfinished;
    }

    public void setJobCountsUnfinished(int jobCountsUnfinished) {
        this.jobCountsUnfinished = jobCountsUnfinished;
    }

    public int getJobCountsFinished() {
        return jobCountsFinished;
    }

    public void setJobCountsFinished(int jobCountsFinished) {
        this.jobCountsFinished = jobCountsFinished;
    }

    public Set<Job> getJobs() {
        return jobs;
    }

    public void setJobs(Set<Job> jobs) {
        this.jobs = jobs;
    }

    public boolean isShallResetToken() {
        return shallResetToken;
    }

    public void setShallResetToken(boolean shallResetToken) {
        this.shallResetToken = shallResetToken;
    }

    public float getHourRate() {
        return hourRate;
    }

    public void setHourRate(float hourRate) {
        this.hourRate = hourRate;
    }

}
