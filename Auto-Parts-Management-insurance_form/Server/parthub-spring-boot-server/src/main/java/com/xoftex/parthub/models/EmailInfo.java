package com.xoftex.parthub.models;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "emailinfos")
public class EmailInfo extends AuditModel {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;
    // smtp.server.address=mail.office365.com
    // smtp.server.port=587
    // smtp.server.username=admin@partslinks.com
    // smtp.server.password=Erikandrew2!

    private long companyId = 0;

    private String domainName = "";

    private long userId = 0;

    private String smtpServerAddress;

    private int smtpServerPort;

    private String smtpServerUsername;

    private String smtpServerPassword;

    public EmailInfo() {

    }

    public long getCompanyId() {
        return companyId;
    }

    public void setCompanyId(long companyId) {
        this.companyId = companyId;
    }

    public String getSmtpServerAddress() {
        return smtpServerAddress;
    }

    public void setSmtpServerAddress(String smtpServerAddress) {
        this.smtpServerAddress = smtpServerAddress;
    }

    public int getSmtpServerPort() {
        return smtpServerPort;
    }

    public void setSmtpServerPort(int smtpServerPort) {
        this.smtpServerPort = smtpServerPort;
    }

    public String getSmtpServerUsername() {
        return smtpServerUsername;
    }

    public void setSmtpServerUsername(String smtpServerUsername) {
        this.smtpServerUsername = smtpServerUsername;
    }

    public String getSmtpServerPassword() {
        return smtpServerPassword;
    }

    public void setSmtpServerPassword(String smtpServerPassword) {
        this.smtpServerPassword = smtpServerPassword;
    }

    public long getUserId() {
        return userId;
    }

    public void setUserId(long userId) {
        this.userId = userId;
    }

    public String getDomainName() {
        return domainName;
    }

    public void setDomainName(String domainName) {
        this.domainName = domainName;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

}
