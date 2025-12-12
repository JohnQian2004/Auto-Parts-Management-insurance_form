package com.xoftex.parthub.models;

import java.util.Date;

import org.springframework.data.annotation.CreatedDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

import jakarta.persistence.Table;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import jakarta.persistence.Transient;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "feedbacks")
public class Feedback extends AuditModel {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;

    private String name;

    @Size(max = 2000)
    private String comments;

    private long userId;

    private long companyId = 0;

    private boolean viewed = false;

    @Size(max = 2000)
    private String reply;

    private boolean replyViewed = false;

    @Column(name = "token", length = 36)
    private String token;

    @Transient
    private User user;

    @Transient
    private Company company;

    @Transient
    public int searchCount;

    @Transient
    public String reason;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "replyed_at", nullable = true, updatable = true)
    private Date replyedAt = new Date();
 
    public Feedback() {

    }

    @Override
    public String toString() {
        return "Feedback [id=" + id + ", name=" + name + ", comments=" + comments + ", userId=" + userId
                + ", companyId=" + companyId + ", viewed=" + viewed + ", reply=" + reply + ", replyViewed="
                + replyViewed + ", token=" + token + "]";
    }


    
    public Date getReplyedAt() {
        return replyedAt;
    }

    public void setReplyedAt(Date replyedAt) {
        this.replyedAt = replyedAt;
    }


    public void setToken(String token) {
        this.token = token;
    }

    public boolean isViewed() {
        return viewed;
    }

    public String getReply() {
        return reply;
    }

    public boolean isReplyViewed() {
        return replyViewed;
    }

    public void setViewed(boolean read) {
        this.viewed = read;
    }

    public void setReply(String reply) {
        this.reply = reply;
    }

    public void setReplyViewed(boolean replyRead) {
        this.replyViewed = replyRead;
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

    public String getToken() {
        return token;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Company getCompany() {
        return company;
    }

    public void setCompany(Company company) {
        this.company = company;
    }

}
