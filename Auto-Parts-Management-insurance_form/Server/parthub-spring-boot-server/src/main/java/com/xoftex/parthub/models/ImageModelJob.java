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
@Table(name = "imagesjob")
public class ImageModelJob extends AuditModel {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;

    // @ManyToOne(cascade = CascadeType.ALL, fetch = FetchType.LAZY, optional =
    // false)
    @ManyToOne(cascade = CascadeType.DETACH, fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "job_id", nullable = false)
    @JsonIgnore
    private Job job;

    private long vehicleId;

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

    @Column(name = "doc_type", columnDefinition = "int default 0")
    private int docType = 0; // claim, receipt, registration, claim items; supplyment, etc;

    @Column(name = "showinsearch")
    private boolean showInSearch = false;

    @Size(max = 200)
    private String fileName;

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

    public int getDocType() {
        return docType;
    }

    public void setDocType(int docType) {
        this.docType = docType;
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

    public ImageModelJob() {

    }

    public ImageModelJob(long id, long partId, String picByteIn) {
        this.id = id;
        //  this.jobIdIn = partId;
        this.picByte = picByteIn;
    }

    public boolean isShowInSearch() {
        return showInSearch;
    }

    public void setShowInSearch(boolean showInSearch) {
        this.showInSearch = showInSearch;
    }

    public void setJob(Job job) {
        this.job = job;
    }

    public Job getJob() {
        return job;
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

    public long getVehicleId() {
        return vehicleId;
    }

    public void setVehicleId(long vehicleId) {
        this.vehicleId = vehicleId;
    }

    public ImageModelJob(long id, Job job, long vehicleId, @Size(max = 500) String description,
            String picByte, int sequenceNumber, int docType, boolean showInSearch, @Size(max = 200) String fileName) {
        this.id = id;
        this.job = job;
        this.vehicleId = vehicleId;

        this.description = description;
        this.picByte = picByte;
        this.sequenceNumber = sequenceNumber;
        this.docType = docType;
        this.showInSearch = showInSearch;
        this.fileName = fileName;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

}
