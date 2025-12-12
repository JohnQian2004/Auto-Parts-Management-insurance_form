package com.xoftex.parthub.models;

import jakarta.persistence.*;

@Entity
@Table(name = "saveitems")
public class SavedItem extends AuditModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "user_id")
    private long userId;

    @Column(name = "autopart_id")
    private long autopartId;

    public Integer getId() {
        return id;
    }

    public long getUserId() {
        return userId;
    }

    public long getAutopartId() {
        return autopartId;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public void setUserId(long userId) {
        this.userId = userId;
    }

    public void setAutopartId(long autopartId) {
        this.autopartId = autopartId;
    }

    @Override
    public String toString() {
        return "SavedItem [id=" + id + ", userId=" + userId + ", autopartId=" + autopartId + "]";
    }
 
    
}
