package com.xoftex.parthub.models;

import java.util.HashSet;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.Entity;

import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;

@Entity
@Table(name = "services")
// @JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
public class Service extends AuditModel {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;

    private String name;
    // private String type;
    private String comments;

    private long userId;

    @Transient
    private Job job;

    private long companyId = 0;

    // @ManyToMany(fetch = FetchType.LAZY, cascade = { CascadeType.PERSIST,
    // CascadeType.DETACH})
    // @ManyToMany(fetch = FetchType.LAZY, cascade = { CascadeType.DETACH })
    // @JoinTable(name = "vehicle_services", joinColumns = @JoinColumn(name =
    // "vehicle_id"), inverseJoinColumns = @JoinColumn(name = "service_id"))
    // @OrderBy("name ASC")
    // @ManyToMany(cascade = { CascadeType.MERGE, CascadeType.PERSIST,
    // CascadeType.REFRESH })
    // @JoinColumn(name = "vehicle_id", nullable = false)
    @ManyToMany(mappedBy = "services")
    @JsonIgnore
    private Set<Vehicle> vehicles = new HashSet<>();

    public long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getComments() {
        return comments;
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

    public Service() {

    }

    public Service(long id, String name, String comments, long userId) {
        this.id = id;
        this.name = name;
        this.comments = comments;
        this.userId = userId;
    }

    public long getUserId() {
        return userId;
    }

    public void setUserId(long userId) {
        this.userId = userId;
    }

    public Job getJob() {
        return job;
    }

    public void setJob(Job job) {
        this.job = job;
    }

    public long getCompanyId() {
        return companyId;
    }

    public void setCompanyId(long companyId) {
        this.companyId = companyId;
    }

    public Set<Vehicle> getVehicles() {
        return vehicles;
    }

    public void setVehicles(Set<Vehicle> vehicles) {
        this.vehicles = vehicles;
    }

}
