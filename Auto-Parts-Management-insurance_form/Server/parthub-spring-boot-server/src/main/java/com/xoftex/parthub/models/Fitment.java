package com.xoftex.parthub.models;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

import jakarta.persistence.Table;
import jakarta.persistence.Transient;

@Entity
@Table(name = "fitments")
public class Fitment extends AuditModel {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;

    private long autopartId;

    private int year;

    private String make;

    private String model;

    private String trim;

    private String engine;

    private String partNumber;

    @Transient
    private String description;

    @Transient
    private String location;


    public Fitment() {

    }

    public Fitment(long id, long autopartId, int year, String make, String model, String trim, String partNumber) {
        this.id = id;
        this.autopartId = autopartId;
        this.year = year;
        this.make = make;
        this.model = model;
        this.trim = trim;
        this.partNumber = partNumber;
    }

    public long getId() {
        return id;
    }

    public long getAutopartId() {
        return autopartId;
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

    public String getTrim() {
        return trim;
    }

    public String getPartNumber() {
        return partNumber;
    }

    public void setId(long id) {
        this.id = id;
    }

    public void setAutopartId(long autopartId) {
        this.autopartId = autopartId;
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

    public void setTrim(String trim) {
        this.trim = trim;
    }

    public void setPartNumber(String partNumber) {
        this.partNumber = partNumber;
    }

    public String getEngine() {
        return engine;
    }

    public void setEngine(String engine) {
        this.engine = engine;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

}
