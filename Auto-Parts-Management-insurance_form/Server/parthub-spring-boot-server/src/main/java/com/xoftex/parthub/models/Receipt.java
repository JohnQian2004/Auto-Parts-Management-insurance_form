package com.xoftex.parthub.models;


import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "receipts")
public class Receipt extends AuditModel {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;

    private String name;

    private String invoiceNumber;

    private float amount;

    private int quantity = 1;

    private String comments;

    private long userId;

    private long vehicleId;

    private long claimId;

    private long autopartId;
    
    private int status = 0;

    private int itemType = 0;

    
    @Column(name = "token", length = 36)
    // @JsonIgnore
    private String token;
    

    private boolean archived = false; // 0 started 1 once vehicle is archived

    @Column(name = "sequence_number", nullable = true)
    private int sequenceNumber = 0;

    @Size(max = 500)
    private String notes;

    @Transient
    private String reason;

    public Receipt() {

    }

    public long getClaimId() {
        return claimId;
    }

    public void setClaimId(long claimId) {
        this.claimId = claimId;
    }

    public int getItemType() {
        return itemType;
    }

    public Receipt(long id, String name, String invoiceNumber, float amount, String comments, long userId,
            long vehicleId, int status, boolean archived, int sequenceNumber, @Size(max = 500) String notes,
            String reason) {
        this.id = id;
        this.name = name;
        this.invoiceNumber = invoiceNumber;
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

    public void setId(long id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setInvoiceNumber(String invoiceNumber) {
        this.invoiceNumber = invoiceNumber;
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

    public String getInvoiceNumber() {
        return invoiceNumber;
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

    public void setItemType(int itemType) {
        this.itemType = itemType;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public long getAutopartId() {
        return autopartId;
    }

    public void setAutopartId(long autopartId) {
        this.autopartId = autopartId;
    }

}