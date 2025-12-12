package com.xoftex.parthub.models;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "imagesexpense")
public class ImageModelExpense extends AuditModel {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;

    // @ManyToOne(cascade = CascadeType.ALL, fetch = FetchType.LAZY, optional =
    // false)
    @ManyToOne(cascade = CascadeType.DETACH, fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "expense_id", nullable = false)
    @JsonIgnore
    private Expense expense;

    private long companyId;

    private long employeeId;

    private long userId;

    @Transient
    private String userName;

    @Size(max = 500)
    private String description;

    @Transient
    private String picByte;

    @Column(name = "sequence_number", nullable = true)
    private int sequenceNumber = 0;

    @Column(name = "showinsearch")
    private boolean showInSearch = false;

    @Size(max = 200)
    private String fileName;

    public ImageModelExpense() {

    }

    public ImageModelExpense(long id, Expense expense, long companyId, long employeeId, long userId, String userName,
            @Size(max = 500) String description, String picByte, int sequenceNumber, boolean showInSearch,
            @Size(max = 200) String fileName) {
        this.id = id;
        this.expense = expense;
        this.companyId = companyId;
        this.employeeId = employeeId;
        this.userId = userId;
        this.userName = userName;
        this.description = description;
        this.picByte = picByte;
        this.sequenceNumber = sequenceNumber;
        this.showInSearch = showInSearch;
        this.fileName = fileName;
    }

    public Expense getExpense() {
        return expense;
    }

    public void setExpense(Expense expense) {
        this.expense = expense;
    }

    public long getCompanyId() {
        return companyId;
    }

    public void setCompanyId(long companyId) {
        this.companyId = companyId;
    }

    public long getId() {
        return id;
    }

    public void setEmployeeId(long employeeId) {
        this.employeeId = employeeId;
    }

    public void setUserId(long userId) {
        this.userId = userId;
    }

    public long getEmployeeId() {
        return employeeId;
    }

    public long getUserId() {
        return userId;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }

    public void setId(long id) {
        this.id = id;
    }

    public void setPicByte(String picByte) {
        this.picByte = picByte;
    }

    public String getPicByte() {
        return picByte;
    }

    public boolean isShowInSearch() {
        return showInSearch;
    }

    public void setShowInSearch(boolean showInSearch) {
        this.showInSearch = showInSearch;
    }

    public int getSequenceNumber() {
        return sequenceNumber;
    }

    public void setSequenceNumber(int sequenceNumber) {
        this.sequenceNumber = sequenceNumber;
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public void ImageModelJob() {
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

}
