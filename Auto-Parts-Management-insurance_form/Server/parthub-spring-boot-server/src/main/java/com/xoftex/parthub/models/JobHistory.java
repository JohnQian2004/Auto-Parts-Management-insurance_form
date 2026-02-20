package com.xoftex.parthub.models;

import jakarta.persistence.*;

@Entity
@Table(name = "job_histories")
public class JobHistory extends AuditModel {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;

    private int type = 0; // 0) add 1) update 2) delete

    private String name;

    private String value;

    private long userId;

    private long employeeId;

    private long jobId;

    private long objectKey = 0; // Reference to the job that was changed

    @Transient
    private String iconName;

    @Transient
    private String objectName;

    @jakarta.persistence.Column(name = "company_uuid", length = 36)
    private String companyUuid;  // For insurance company tracking

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }

    public long getUserId() {
        return userId;
    }

    public void setUserId(long userId) {
        this.userId = userId;
    }

    public long getJobId() {
        return jobId;
    }

    public void setJobId(long jobId) {
        this.jobId = jobId;
    }

    public int getType() {
        return type;
    }

    public void setType(int type) {
        this.type = type;
    }

    public long getObjectKey() {
        return objectKey;
    }

    public void setObjectKey(long objectKey) {
        this.objectKey = objectKey;
    }

    public String getObjectName() {
        return objectName;
    }

    public void setObjectName(String objectName) {
        this.objectName = objectName;
    }

    public long getEmployeeId() {
        return employeeId;
    }

    public void setEmployeeId(long employeeId) {
        this.employeeId = employeeId;
    }

    public String getIconName() {
        return iconName;
    }

    public void setIconName(String iconName) {
        this.iconName = iconName;
    }

    public String getCompanyUuid() {
        return companyUuid;
    }

    public void setCompanyUuid(String companyUuid) {
        this.companyUuid = companyUuid;
    }
}