package com.xoftex.parthub.models;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
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
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import jakarta.persistence.Transient;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "expenses")
public class Expense extends AuditModel {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;

    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY, mappedBy = "expense")
    private Set<ImageModelExpense> imageModels = new HashSet<>();

    private String name;

    private long companyId;
    private long vendorId;
    private long paymentMethodId;

    private long userId;
    private long expenseTypeId;

    private String itemNumber;

    private float amount;

    private int quantity = 1;

    private float subtotal;

    private boolean paid;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "paid_at", nullable = true)
    private Date paidAt;

    @Size(max = 500)
    private String comments;

    @Column(name = "token", length = 36)
    // @JsonIgnore
    private String token;

    @Column(name = "sequence_number", nullable = true)
    private int sequenceNumber = 0;

    @Transient
    private String reason;

    @Transient
    public int searchCount;

    @Transient
    public long showInSearchImageId;

    public Expense() {

    }

    public Set<ImageModelExpense> getImageModels() {
        return imageModels;
    }

    public void setImageModels(Set<ImageModelExpense> imageModels) {
        this.imageModels = imageModels;
    }

    public long getShowInSearchImageId() {
        return showInSearchImageId;
    }

    public void setShowInSearchImageId(long showInSearchImageId) {
        this.showInSearchImageId = showInSearchImageId;
    }

    public long getPaymentMethodId() {
        return paymentMethodId;
    }

    public void setPaymentMethodId(long paymentMethodId) {
        this.paymentMethodId = paymentMethodId;
    }

    public int getSearchCount() {
        return searchCount;
    }

    public void setSearchCount(int searchCount) {
        this.searchCount = searchCount;
    }

    public Expense(long id, String name, long companyId, long vendorId, long userId, String itemNumber, float amount,
            int quantity, @Size(max = 500) String comments, String token, int sequenceNumber, String reason) {
        this.id = id;
        this.name = name;
        this.companyId = companyId;
        this.vendorId = vendorId;
        this.userId = userId;
        this.itemNumber = itemNumber;
        this.amount = amount;
        this.quantity = quantity;
        this.comments = comments;
        this.token = token;
        this.sequenceNumber = sequenceNumber;
        this.reason = reason;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public long getCompanyId() {
        return companyId;
    }

    public void setCompanyId(long companyId) {
        this.companyId = companyId;
    }

    public long getVendorId() {
        return vendorId;
    }

    public void setVendorId(long vendorId) {
        this.vendorId = vendorId;
    }

    public long getUserId() {
        return userId;
    }

    public void setUserId(long userId) {
        this.userId = userId;
    }

    public String getItemNumber() {
        return itemNumber;
    }

    public void setItemNumber(String itemNumber) {
        this.itemNumber = itemNumber;
    }

    public float getAmount() {
        return amount;
    }

    public void setAmount(float amount) {
        this.amount = amount;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public String getComments() {
        return comments;
    }

    public void setComments(String comments) {
        this.comments = comments;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public int getSequenceNumber() {
        return sequenceNumber;
    }

    public void setSequenceNumber(int sequenceNumber) {
        this.sequenceNumber = sequenceNumber;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public long getExpenseTypeId() {
        return expenseTypeId;
    }

    public void setExpenseTypeId(long expenseTypeId) {
        this.expenseTypeId = expenseTypeId;
    }

    public float getSubtotal() {
        return subtotal;
    }

    public void setSubtotal(float subtotal) {
        this.subtotal = subtotal;
    }

    public boolean isPaid() {
        return paid;
    }

    public void setPaid(boolean paid) {
        this.paid = paid;
    }

    public Date getPaidAt() {
        return paidAt;
    }

    public void setPaidAt(Date paidAt) {
        this.paidAt = paidAt;
    }

}