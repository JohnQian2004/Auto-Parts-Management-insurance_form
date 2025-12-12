package com.xoftex.parthub.models;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "banners")
public class Banner extends AuditModel {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)

    private long id;

    private String title;

    @Size(max = 2000)
    private String content;

    private long userId;

    private boolean active = false;

    public Banner() {

    }

    public void setId(long id) {
        this.id = id;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public void setUserId(long userId) {
        this.userId = userId;
    }

    public void setActive(boolean active) {
        this.active = active;
    }

    public long getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public String getContent() {
        return content;
    }

    public long getUserId() {
        return userId;
    }

    public boolean isActive() {
        return active;
    }

}
