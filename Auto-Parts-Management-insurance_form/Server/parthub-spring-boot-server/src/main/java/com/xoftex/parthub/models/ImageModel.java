package com.xoftex.parthub.models;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;

@Entity
@Table(name = "images")
public class ImageModel extends AuditModel {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;

    // @ManyToOne(cascade = CascadeType.ALL, fetch = FetchType.LAZY, optional =
    // false)
    @ManyToOne(cascade = CascadeType.DETACH, fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "autopart_id", nullable = false)
    @JsonIgnore
    private Autopart autopart;

    private long employeeId;

    private long userId;
    
    @Transient
    private String userName;

    @Transient
    private long autopartIdIn;

    @Transient
    private String picByte;

    @Column(name = "showinsearch")
    private boolean showInSearch = false;

    public void setAutopartIdIn(long autopartIdIn) {
        this.autopartIdIn = autopartIdIn;
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

    public ImageModel() {

    }

    public ImageModel(long id, long partId, String picByteIn) {
        this.id = id;
        this.autopartIdIn = partId;
        this.picByte = picByteIn;
    }

    public long getAutopartIdIn() {
        return autopartIdIn;
    }

    public Autopart getAutopart() {
        return autopart;
    }

    public void setAutopart(Autopart autopart) {
        this.autopart = autopart;
    }

    public boolean isShowInSearch() {
        return showInSearch;
    }

    public void setShowInSearch(boolean showInSearch) {
        this.showInSearch = showInSearch;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

}
