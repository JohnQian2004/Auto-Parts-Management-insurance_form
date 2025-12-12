package com.xoftex.parthub.models;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

import jakarta.persistence.Table;
import jakarta.persistence.Transient;
import jakarta.persistence.UniqueConstraint;

@Entity
@Table(name = "payroll_histories", uniqueConstraints = {
        @UniqueConstraint(columnNames = "job_id") })

public class PayrollHistory extends AuditModel {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;

    private int year = 0;

    private int week = 0; // e.g week 30, 31 or 40 etc

    @Column(name = "job_id")
    private long jobId;

    private long userId;

    private long companyId;

    @Transient
    public Job job;

    @Transient
    public Vehicle vehicle;

    @Transient
    public long employeeId;

    public long getId() {
        return id;
    }

    public int getWeek() {
        return week;
    }

    public long getJobId() {
        return jobId;
    }

    public long getUserId() {
        return userId;
    }

    public void setId(long id) {
        this.id = id;
    }

    public void setWeek(int week) {
        this.week = week;
    }

    public void setJobId(long jobId) {
        this.jobId = jobId;
    }

    public void setUserId(long userId) {
        this.userId = userId;
    }

    public PayrollHistory() {

    }

    public long getCompanyId() {
        return companyId;
    }

    public void setCompanyId(long companyId) {
        this.companyId = companyId;
    }

    public int getYear() {
        return year;
    }

    public void setYear(int year) {
        this.year = year;
    }

}
