package com.xoftex.parthub.models;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

import jakarta.persistence.Table;

@Entity
@Table(name = "doctypes")
public class DocType extends AuditModel {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;

    private String name;

    private String comments;

    private long userId;

    private long companyId = 0;

    @Column(name = "sequence_number")
    private int sequenceNumber;

    @Column(name = "color")
    private String color;
    
    public DocType() {

    }

    public DocType(long id, String name, String comments, long userId, long companyId) {
        this.id = id;
        this.name = name;
        this.comments = comments;
        this.userId = userId;
        this.companyId = companyId;
    }

    public void setId(long id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setComments(String comments) {
        this.comments = comments;
    }

    public void setUserId(long userId) {
        this.userId = userId;
    }

    public void setCompanyId(long companyId) {
        this.companyId = companyId;
    }

    public long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getComments() {
        return comments;
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

    public void setSequenceNumber(int sequenceNumber) {
        this.sequenceNumber = sequenceNumber;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

}
