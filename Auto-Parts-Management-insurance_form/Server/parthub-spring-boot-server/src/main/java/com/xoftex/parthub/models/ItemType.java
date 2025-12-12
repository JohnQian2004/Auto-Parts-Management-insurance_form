package com.xoftex.parthub.models;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

import jakarta.persistence.Table;

@Entity
@Table(name = "itemtypes")
public class ItemType extends AuditModel {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;

    private String name;

    private String comments;

    private long userId;

    private long companyId = 0;

    private boolean createJobOrder = false;
    
    private boolean createPurchaseOrder = false;

    public ItemType() {

    }

    public ItemType(long id, String name, String comments, long userId, long companyId) {
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

    public boolean isCreateJobOrder() {
        return createJobOrder;
    }

    public void setCreateJobOrder(boolean createJobOrder) {
        this.createJobOrder = createJobOrder;
    }

    public boolean isCreatePurchaseOrder() {
        return createPurchaseOrder;
    }

    public void setCreatePurchaseOrder(boolean createPurchaseOrder) {
        this.createPurchaseOrder = createPurchaseOrder;
    }

}
