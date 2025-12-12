package com.xoftex.parthub.models;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "imagesvehicle")
public class ImageModelVehicle extends AuditModel {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;

    private long employeeId;

    private long userId;
    
    @ManyToOne(cascade = CascadeType.DETACH, fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "vehicle_id", nullable = false)
    @JsonIgnore
    private Vehicle vehicle;

    @Column(name = "doc_type", columnDefinition = "int default 0")
    private int docType = 0; // claim, receipt, registration, claim items; supplyment, etc;

    @Transient
    private long vehicleIdIn;

    @Transient
    private String picByte;

    @Column(name = "showinsearch")
    private boolean showInSearch = false;

    @Size(max = 200)
    private String fileName;

    @Size(max = 500)
    private String description;

    @Transient
    private String userName;
    
    @Column(name = "sequence_number", nullable = true)
    private int sequenceNumber = 0;

    public String getFileName() {
        return fileName;
    }

    public String getUserName() {
        return userName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public long getEmployeeId() {
        return employeeId;
    }

    public void setEmployeeId(long employeeId) {
        this.employeeId = employeeId;
    }

    public void setUserId(long userId) {
        this.userId = userId;
    }

    public long getUserId() {
        return userId;
    }

    public long getId() {
        return id;
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

    public Vehicle getVehicle() {
        return vehicle;
    }

    public long getVehicleIdIn() {
        return vehicleIdIn;
    }

    public boolean isShowInSearch() {
        return showInSearch;
    }

    public void setVehicle(Vehicle vehicle) {
        this.vehicle = vehicle;
    }

    public void setVehicleIdIn(long vehicleIdIn) {
        this.vehicleIdIn = vehicleIdIn;
    }

    public void setShowInSearch(boolean showInSearch) {
        this.showInSearch = showInSearch;
    }

    public ImageModelVehicle() {

    }

    public ImageModelVehicle(long id, Vehicle vehicle, long vehicleIdIn, String picByte, boolean showInSearch) {
        this.id = id;
        this.vehicle = vehicle;
        this.vehicleIdIn = vehicleIdIn;
        this.picByte = picByte;
        this.showInSearch = showInSearch;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public int getSequenceNumber() {
        return sequenceNumber;
    }

    public void setSequenceNumber(int sequenceNumber) {
        this.sequenceNumber = sequenceNumber;
    }

    public int getDocType() {
        return docType;
    }

    public void setDocType(int docType) {
        this.docType = docType;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

}
