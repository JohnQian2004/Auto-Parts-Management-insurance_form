package com.xoftex.parthub.models;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "pdffiles")
public class PdfFile extends AuditModel {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;

    @ManyToOne(cascade = CascadeType.DETACH, fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "vehicle_id", nullable = false)
    @JsonIgnore
    private Vehicle vehicle;

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

    @Column(name = "token", length = 36)
    //@JsonIgnore
    private String token;

    

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
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

    public PdfFile() {

    }

    public PdfFile(long id, Vehicle vehicle, long vehicleIdIn, String picByte, boolean showInSearch) {
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

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }


}
