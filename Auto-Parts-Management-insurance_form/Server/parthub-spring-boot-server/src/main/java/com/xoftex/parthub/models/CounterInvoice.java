package com.xoftex.parthub.models;

import java.util.ArrayList;
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
@Table(name = "counterinvoices")
public class CounterInvoice extends AuditModel {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;

    private String type;

    private String name;

    private String invoiceNumber;

    private float amount;

    private String comments;

    private long customerId = 0;

    private long companyId = 0;

    private long userId = 0;

    private int status = 0;

    private String headingName;
    private String headingDescription;
    private String headingQuantity;
    private String headingSubtotal;

    private boolean noTax = false;
        
    @Column(name = "token", length = 36)
    // @JsonIgnore
    private String token;

    @Column(name = "item_counts")
    private int itemCounts = 0;

    @Column(name = "payment_method")
    private int paymentMethod = 0;

    private boolean archived = false; // 0 started 1 once vehicle is archived

    @Column(name = "sequence_number", nullable = true)
    private int sequenceNumber = 0;

    @Size(max = 500)
    private String notes;

    @Transient
    public int totalCount = 0;

    @Transient
    public int searchCount = 0;

    public void setHeadingName(String headingName) {
        this.headingName = headingName;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public void setHeadingDescription(String headingDescription) {
        this.headingDescription = headingDescription;
    }

    public void setHeadingQuantity(String headingQuantity) {
        this.headingQuantity = headingQuantity;
    }

    public void setHeadingSubtotal(String headingSubTotal) {
        this.headingSubtotal = headingSubTotal;
    }

    public void setTotalCount(int totalCount) {
        this.totalCount = totalCount;
    }

    public void setSearchCount(int searchCount) {
        this.searchCount = searchCount;
    }

    public String getHeadingName() {
        return headingName;
    }

    public String getHeadingDescription() {
        return headingDescription;
    }

    public String getHeadingQuantity() {
        return headingQuantity;
    }

    public String getHeadingSubtotal() {
        return headingSubtotal;
    }

    public int getTotalCount() {
        return totalCount;
    }

    public int getSearchCount() {
        return searchCount;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getType() {
        return type;
    }

    public void setItemCounts(int itemCounts) {
        this.itemCounts = itemCounts;
    }

    public int getItemCounts() {
        return itemCounts;
    }

    public void setCompanyId(long companyId) {
        this.companyId = companyId;
    }

    public long getCompanyId() {
        return companyId;
    }

    @Transient
    private String reason;

    @Transient
    private Customer customer = new Customer();

    @Transient
    private List<CounterInvoiceItem> counterInvoiceItems = new ArrayList<CounterInvoiceItem>();

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

    public long getCustomerId() {
        return customerId;
    }

    public long getUserId() {
        return userId;
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

    public void setCustomerId(long customerId) {
        this.customerId = customerId;
    }

    public void setUserId(long userId) {
        this.userId = userId;
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

    public CounterInvoice() {

    }

    public CounterInvoice(long id, String name, String invoiceNumber, float amount, String comments, long customerId,
            long userId, int status, boolean archived, int sequenceNumber, @Size(max = 500) String notes,
            String reason) {
        this.id = id;
        this.name = name;
        this.invoiceNumber = invoiceNumber;
        this.amount = amount;
        this.comments = comments;
        this.customerId = customerId;
        this.userId = userId;
        this.status = status;
        this.archived = archived;
        this.sequenceNumber = sequenceNumber;
        this.notes = notes;
        this.reason = reason;
    }

    public List<CounterInvoiceItem> getCounterInvoiceItems() {
        return counterInvoiceItems;
    }

    public void setCounterInvoiceItems(List<CounterInvoiceItem> counterInvoiceItems) {
        this.counterInvoiceItems = counterInvoiceItems;
    }

    public Customer getCustomer() {
        return customer;
    }

    public void setCustomer(Customer customer) {
        this.customer = customer;
    }

    public int getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(int paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public boolean isNoTax() {
        return noTax;
    }

    public void setNoTax(boolean noTax) {
        this.noTax = noTax;
    }

    public String getToken() {
        return token;
    }

}