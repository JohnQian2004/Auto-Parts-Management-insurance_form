package com.xoftex.parthub.models;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "intakeways")
// @JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
public class InTakeWay extends AuditModel {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;

    @Size(max = 500)
    private String comments;

    private String name;

    private long userId;

    private long companyId;

    public InTakeWay() {

    }

    public InTakeWay(long id, @Size(max = 500) String notes, String name, long userId, long companyId) {
        this.id = id;
        this.comments = notes;
        this.name = name;
        this.userId = userId;
        this.companyId = companyId;
    }

    public void setId(long id) {
        this.id = id;
    }

    public void setComments(String notes) {
        this.comments = notes;
    }

    public void setName(String name) {
        this.name = name;
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

    public String getComments() {
        return comments;
    }

    public String getName() {
        return name;
    }

    public long getUserId() {
        return userId;
    }

    public long getCompanyId() {
        return companyId;
    }

}
