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
@Table(name = "payments")
// @JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
public class Payment extends AuditModel {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;

    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY, mappedBy = "payment")
    private Set<ImageModelPayment> imageModels = new HashSet<>();

    private String name;

    private String comments;

    private long userId;

    private long userIdVerified;

    private Date dateVerified;

    @Size(max = 500)
    private String notesVerified;

    private long paymentTypeId = 0;

    private float amount;

    private long vehicleId;

    private long paymentStatusId = 0; // 0 started 1 completed

    private long paymentMethodId = 0;

    private Date date;

    @Column(name = "token", length = 36)
    // @JsonIgnore
    private String token;

    @Column(name = "sequence_number", nullable = true)
    private int sequenceNumber = 0;

    @Size(max = 500)
    private String notes;

    @Transient
    private String reason;

    @Transient
    private Vehicle vehicle;

    

    public Payment() {

    }

    public Payment(long id, String name, String comments, long userId, long paymentTypeId, float amount, long vehicleId,
            long paymentStatusId, Date date, int sequenceNumber, @Size(max = 500) String notes, String reason) {
        this.id = id;
        this.name = name;
        this.comments = comments;
        this.userId = userId;
        this.paymentTypeId = paymentTypeId;
        this.amount = amount;
        this.vehicleId = vehicleId;
        this.paymentStatusId = paymentStatusId;
        this.date = date;
        this.sequenceNumber = sequenceNumber;
        this.notes = notes;
        this.reason = reason;
    }

    public void setUserIdVerified(long userIdVerified) {
        this.userIdVerified = userIdVerified;
    }

    public void setDateVerified(Date dateVerified) {
        this.dateVerified = dateVerified;
    }

    public long getUserIdVerified() {
        return userIdVerified;
    }

    public Date getDateVerified() {
        return dateVerified;
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

    public void setPaymentTypeId(long paymentTypeId) {
        this.paymentTypeId = paymentTypeId;
    }

    public void setAmount(float amount) {
        this.amount = amount;
    }

    public void setVehicleId(long vehicleId) {
        this.vehicleId = vehicleId;
    }

    public void setPaymentStatusId(long paymentStatusId) {
        this.paymentStatusId = paymentStatusId;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    public void setSequenceNumber(int sequenceNumber) {
        this.sequenceNumber = sequenceNumber;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public void setReason(String reason) {
        this.reason = reason;
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

    public long getPaymentTypeId() {
        return paymentTypeId;
    }

    public float getAmount() {
        return amount;
    }

    public long getVehicleId() {
        return vehicleId;
    }

    public long getPaymentStatusId() {
        return paymentStatusId;
    }

    public Date getDate() {
        return date;
    }

    public int getSequenceNumber() {
        return sequenceNumber;
    }

    public String getNotes() {
        return notes;
    }

    public String getReason() {
        return reason;
    }

    public long getPaymentMethodId() {
        return paymentMethodId;
    }

    public void setPaymentMethodId(long paymentMethodId) {
        this.paymentMethodId = paymentMethodId;
    }

    public String getNotesVerified() {
        return notesVerified;
    }

    public void setNotesVerified(String notesVerified) {
        this.notesVerified = notesVerified;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public Set<ImageModelPayment> getImageModels() {
        return imageModels;
    }

    public void setImageModels(Set<ImageModelPayment> imageModels) {
        this.imageModels = imageModels;
    }

    public Vehicle getVehicle() {
        return vehicle;
    }

    public void setVehicle(Vehicle vehicle) {
        this.vehicle = vehicle;
    }

}
