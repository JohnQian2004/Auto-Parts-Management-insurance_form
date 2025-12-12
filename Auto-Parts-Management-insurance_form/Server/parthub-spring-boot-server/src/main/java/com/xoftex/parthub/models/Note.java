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
@Table(name = "notes")
// @JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
public class Note extends AuditModel {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;

    @Size(max = 500)
    private String notes;

    private String color;

    private long userId;

    private long companyId;
    private long employeeId;
    private long autopartId;
    private long vehicleId;
    private long jobId;
    private boolean archived;

    @Transient
    private int year;

    @Transient
    private String make;

    @Transient
    private String model;

    @Transient
    private String colorVehicle;

    @Transient
    private String jobName;

    @Transient
    private int jobPrice;

    @Transient
    private int jobStatus;

    private String type;

    @Transient
    private String creatorShortName = new String();


    @Column(name = "sequence_number", nullable = true)
    private int sequenceNumber = 0;

    public long getId() {
        return id;
    }

    public String getNotes() {
        return notes;
    }

    public void setYear(int year) {
        this.year = year;
    }

    public void setMake(String make) {
        this.make = make;
    }

    public void setModel(String model) {
        this.model = model;
    }

    public void setJobName(String jobName) {
        this.jobName = jobName;
    }

    public void setType(String messaString) {
        this.type = messaString;
    }

    public String getColor() {
        return color;
    }

    public int getYear() {
        return year;
    }

    public String getMake() {
        return make;
    }

    public String getModel() {
        return model;
    }

    public String getJobName() {
        return jobName;
    }

    public String getType() {
        return type;
    }

    public long getUserId() {
        return userId;
    }

    public long getCompanyId() {
        return companyId;
    }

    public int getSequenceNumber() {
        return sequenceNumber;
    }

    public void setId(long id) {
        this.id = id;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public void setUserId(long userId) {
        this.userId = userId;
    }

    public void setCompanyId(long companyId) {
        this.companyId = companyId;
    }

    public void setSequenceNumber(int sequenceNumber) {
        this.sequenceNumber = sequenceNumber;
    }

    public Note() {

    }

    public Note(long id, @Size(max = 500) String notes, String color, long userId, long companyId, int sequenceNumber) {
        this.id = id;
        this.notes = notes;
        this.color = color;
        this.userId = userId;
        this.companyId = companyId;
        this.sequenceNumber = sequenceNumber;
    }

    public long getEmployeeId() {
        return employeeId;
    }

    public long getAutopartId() {
        return autopartId;
    }

    public long getVehicleId() {
        return vehicleId;
    }

    public void setEmployeeId(long employeeId) {
        this.employeeId = employeeId;
    }

    public void setAutopartId(long autopartId) {
        this.autopartId = autopartId;
    }

    public void setVehicleId(long vehicleId) {
        this.vehicleId = vehicleId;
    }

    public void setJobId(long jobId) {
        this.jobId = jobId;
    }

    public long getJobId() {
        return jobId;
    }

    public void setArchived(boolean archived) {
        this.archived = archived;
    }

    public boolean isArchived() {
        return archived;
    }

    public String getCreatorShortName() {
        return creatorShortName;
    }

    public void setCreatorShortName(String creatorShortName) {
        this.creatorShortName = creatorShortName;
    }

    public String getColorVehicle() {
        return colorVehicle;
    }

    public void setColorVehicle(String colorVehicle) {
        this.colorVehicle = colorVehicle;
    }

    public int getJobPrice() {
        return jobPrice;
    }

    public void setJobPrice(int jobPrice) {
        this.jobPrice = jobPrice;
    }

    public int getJobStatus() {
        return jobStatus;
    }

    public void setJobStatus(int jobStatus) {
        this.jobStatus = jobStatus;
    }

}
