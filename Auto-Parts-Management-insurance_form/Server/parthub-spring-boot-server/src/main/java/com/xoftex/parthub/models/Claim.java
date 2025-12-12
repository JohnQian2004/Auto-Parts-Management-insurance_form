package com.xoftex.parthub.models;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;

import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

import jakarta.persistence.Table;
import jakarta.persistence.Transient;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "claims")
public class Claim extends AuditModel {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;

    private String name;

    private String itemNumber;

    private String operation;

    private float labor;

    private boolean laborIncluded = false;

    private float paint;

    private String partNumber;

    private float amount;

    private int quantity = 1;

    private String comments;

    private long userId;

    private long vehicleId;

    private int status = 0; // lock and unlocked

    private int itemType = 0;

    @Column(name = "token", length = 36)
    // @JsonIgnore
    private String token;

    @Column(name = "locked_at", nullable = true)
    private Date lockedAt = new Date();

    private boolean archived = false; // 0 started 1 once vehicle is archived

    @Column(name = "sequence_number", nullable = true)
    private int sequenceNumber = 0;

    @Size(max = 500)
    private String notes;

    @Transient
    private String reason;

    @Transient
    public List<PurchaseOrderVehicle> purchaseOrders = new ArrayList<PurchaseOrderVehicle>();

    @Transient
    public List<Job> jobs = new ArrayList<Job>();

    @Transient
    public List<Autopart> autoparts = new ArrayList<Autopart>();

    @Transient
    public int index;
    
    public Claim() {

    }

    public void setToken(String token) {
        this.token = token;
    }

    public Claim(long id, String name, String invoiceNumber, float amount, String comments, long userId,
            long vehicleId, int status, boolean archived, int sequenceNumber, @Size(max = 500) String notes,
            String reason) {
        this.id = id;
        this.name = name;
        this.itemNumber = invoiceNumber;
        this.amount = amount;
        this.comments = comments;
        this.userId = userId;
        this.vehicleId = vehicleId;
        this.status = status;
        this.archived = archived;
        this.sequenceNumber = sequenceNumber;
        this.notes = notes;
        this.reason = reason;
    }

    public void setPurchaseOrders(List<PurchaseOrderVehicle> purchaseOrders) {
        this.purchaseOrders = purchaseOrders;
    }

    public void setJobs(List<Job> jobs) {
        this.jobs = jobs;
    }

    public List<PurchaseOrderVehicle> getPurchaseOrders() {
        return purchaseOrders;
    }

    public List<Job> getJobs() {
        return jobs;
    }

    public void setOperation(String operation) {
        this.operation = operation;
    }

    public void setLabor(float labor) {
        this.labor = labor;
    }

    public void setLaborIncluded(boolean laborIncluded) {
        this.laborIncluded = laborIncluded;
    }

    public void setPaint(float paint) {
        this.paint = paint;
    }

    public void setPartNumber(String partNumber) {
        this.partNumber = partNumber;
    }

    public String getOperation() {
        return operation;
    }

    public float getLabor() {
        return labor;
    }

    public boolean isLaborIncluded() {
        return laborIncluded;
    }

    public float getPaint() {
        return paint;
    }

    public String getPartNumber() {
        return partNumber;
    }

    public void setId(long id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setItemNumber(String invoiceNumber) {
        this.itemNumber = invoiceNumber;
    }

    public void setAmount(float amount) {
        this.amount = amount;
    }

    public void setComments(String comments) {
        this.comments = comments;
    }

    public void setUserId(long userId) {
        this.userId = userId;
    }

    public void setVehicleId(long vehicleId) {
        this.vehicleId = vehicleId;
    }

    public void setStatus(int status) {
        this.status = status;
    }

    public void setArchived(boolean archived) {
        this.archived = archived;
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

    public String getItemNumber() {
        return itemNumber;
    }

    public float getAmount() {
        return amount;
    }

    public String getComments() {
        return comments;
    }

    public long getUserId() {
        return userId;
    }

    public long getVehicleId() {
        return vehicleId;
    }

    public int getStatus() {
        return status;
    }

    public boolean isArchived() {
        return archived;
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

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public Date getLockedAt() {
        return lockedAt;
    }

    public void setLockedAt(Date lockedAt) {
        this.lockedAt = lockedAt;
    }

    public int getItemType() {
        return itemType;
    }

    public void setItemType(int itemType) {
        this.itemType = itemType;
    }

    public String getToken() {
        return token;
    }

}