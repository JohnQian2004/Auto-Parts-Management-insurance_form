package com.xoftex.parthub.models;

import java.util.Date;
import java.util.HashSet;
import java.util.Set;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "jobs")
// @JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
public class Job extends AuditModel {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;

    private String name;

    @Size(max = 2000)
    private String comments;

    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY, mappedBy = "job")
    private Set<ImageModelJob> imageModels = new HashSet<>();

    private long vehicleId;

    public long getVehicleId() {
        return vehicleId;
    }

    private long userId;

    private long employeeId = 0L;

    private long userIdVerified = 0L; // user_id_verified

    private Date verifiedAt;

    private Date notifiedAt;

    private boolean notified;

    private long serviceId;

    @Column(name = "claim_id")
    private Long claimId = 0L;

    private int status = 0; // 0 started 1 completed

    private boolean archived = false; // 0 started 1 once vehicle is archived

    private Date targetDate;

    private Date startDate;

    private Date endDate;

    private Date paidDate;

    private int price;

    @Column(name = "token", length = 36)
    // @JsonIgnore
    private String token;

    @Transient
    private int paidWeek;

    @Transient
    private int paidYear;

    @Column(name = "sequence_number", nullable = true)
    private int sequenceNumber = 0;

    @Size(max = 500)
    private String notes;

    @Column(name = "payment_method")
    private int paymentMethod = 0;

    @Column(name = "job_request_type")
    private int jobRequestType = 0;

    private int steps;

    private float hours;

    public float getHours() {
        return hours;
    }

    public void setHours(float hours) {
        this.hours = hours;
    }

    @Transient
    private String userName;

    @Transient
    private String reason;

    @Transient
    private Set<Employee> employees = new HashSet<>();

    @Transient
    public int index;
    
    public void setStartDate(Date startDate) {
        this.startDate = startDate;
    }

    public void setSteps(int steps) {
        this.steps = steps;
    }

    public String getToken() {
        return token;
    }

    public void setUserIdVerified(long userIdVerified) {
        this.userIdVerified = userIdVerified;
    }

    public long getUserIdVerified() {
        return userIdVerified;
    }

    public void setVerifiedAt(Date verifiedAt) {
        this.verifiedAt = verifiedAt;
    }

    public void setNotified(boolean notified) {
        this.notified = notified;
    }

    public Date getNotifiedAt() {
        return notifiedAt;
    }

    public Date getVerifiedAt() {
        return verifiedAt;
    }

    public boolean isNotified() {
        return notified;
    }

    public void setPaidWeek(int paidWeek) {
        this.paidWeek = paidWeek;
    }

    public void setPaidYear(int paidYear) {
        this.paidYear = paidYear;
    }

    public int getPaidWeek() {
        return paidWeek;
    }

    public int getPaidYear() {
        return paidYear;
    }

    public void setEndDate(Date endDate) {
        this.endDate = endDate;
    }

    public Date getStartDate() {
        return startDate;
    }

    public Date getEndDate() {
        return endDate;
    }

    public long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getComments() {
        return comments;
    }

    public long getUserId() {
        return userId;
    }

    public long getEmployeeId() {
        return employeeId;
    }

    public long getServiceId() {
        return serviceId;
    }

    public int getStatus() {
        return status;
    }

    public void setId(long id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setComments(String comments) {
        this.comments = comments;
    }

    public void setUserId(long userId) {
        this.userId = userId;
    }

    public void setEmployeeId(long employeeId) {
        this.employeeId = employeeId;
    }

    public void setServiceId(long serviceId) {
        this.serviceId = serviceId;
    }

    public void setStatus(int status) {
        this.status = status;
    }

    public void setPaymentMethod(int paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public void setJobRequestType(int jobRequestType) {
        this.jobRequestType = jobRequestType;
    }

    public int getPaymentMethod() {
        return paymentMethod;
    }

    public int getJobRequestType() {
        return jobRequestType;
    }

    public Job() {

    }

    public Job(long id, String name, String comments, long userId, long employeeId, long serviceId, int status) {
        this.id = id;
        this.name = name;
        this.comments = comments;
        this.userId = userId;
        this.employeeId = employeeId;
        this.serviceId = serviceId;

        this.status = status;
    }

    public Set<Employee> getEmployees() {
        return employees;
    }

    public void setEmployees(Set<Employee> employees) {
        this.employees = employees;
    }

    public Date getTargetDate() {
        return targetDate;
    }

    public void setTargetDate(Date targetDate) {
        this.targetDate = targetDate;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public int getSequenceNumber() {
        return sequenceNumber;
    }

    public void setSequenceNumber(int sequenceNumber) {
        this.sequenceNumber = sequenceNumber;
    }

    public boolean isArchived() {
        return archived;
    }

    public void setArchived(boolean archived) {
        this.archived = archived;
    }

    public int getPrice() {
        return price;
    }

    public void setPrice(int price) {
        this.price = price;
    }

    public Date getPaidDate() {
        return paidDate;
    }

    public void setPaidDate(Date paidDate) {
        this.paidDate = paidDate;
    }

    public Long getClaimId() {
        return claimId;
    }

    public void setClaimId(Long claimId) {
        this.claimId = claimId;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public void setImageModels(Set<ImageModelJob> imageModels) {
        this.imageModels = imageModels;
    }

    public Set<ImageModelJob> getImageModels() {
        return imageModels;
    }

    public void setVehicleId(long vehicleId) {
        this.vehicleId = vehicleId;
    }

    public void setNotifiedAt(Date notifiedAt) {
        this.notifiedAt = notifiedAt;
    }

    public int getSteps() {
        return steps;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

}
