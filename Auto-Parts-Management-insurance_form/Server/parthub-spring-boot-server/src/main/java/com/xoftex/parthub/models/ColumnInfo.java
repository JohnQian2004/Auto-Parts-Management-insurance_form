package com.xoftex.parthub.models;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

import jakarta.persistence.Table;

@Entity
@Table(name = "columninfos")
public class ColumnInfo extends AuditModel {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;

    private boolean enabled=true;

    private String name;

    private String comments;

    private String header;

    private int width;

    private String tooltip;

    private String fieldName;

    private boolean collection = false;


    private long userId;

    private long companyId = 0;


    @Column(name = "sequence_number")
    private int sequenceNumber;

    @Column(name = "color")
    private String color;

    
    public ColumnInfo() {
    }

    public void setId(long id) {
        this.id = id;
    }

    public void setEnabled(boolean enabled) {
        this.enabled = enabled;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setComments(String comments) {
        this.comments = comments;
    }

    public void setHeader(String header) {
        this.header = header;
    }

    public void setWidth(int width) {
        this.width = width;
    }

    public void setTooltip(String tooltip) {
        this.tooltip = tooltip;
    }

    public void setFieldName(String fieldName) {
        this.fieldName = fieldName;
    }

    public void setCollection(boolean isCollection) {
        this.collection = isCollection;
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

    public void setColor(String color) {
        this.color = color;
    }

    public long getId() {
        return id;
    }

    public boolean isEnabled() {
        return enabled;
    }

    public String getName() {
        return name;
    }

    public String getComments() {
        return comments;
    }

    public String getHeader() {
        return header;
    }

    public int getWidth() {
        return width;
    }

    public String getTooltip() {
        return tooltip;
    }

    public String getFieldName() {
        return fieldName;
    }

    public boolean isCollection() {
        return collection;
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

    public String getColor() {
        return color;
    }
   

    
}