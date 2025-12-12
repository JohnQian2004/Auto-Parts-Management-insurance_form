package com.xoftex.parthub.models;

import jakarta.persistence.*;

@Entity
@Table(name = "zipcodes")
public class ZipCode {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(length = 5)
    private String zip;

    @Column(name = "lat")
    private float lat;

    @Column(name = "lng")
    private float lng;

    public Integer getId() {
        return id;
    }

    public String getZip() {
        return zip;
    }

    public float getLat() {
        return lat;
    }

    public float getLng() {
        return lng;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public void setZip(String zip) {
        this.zip = zip;
    }

    public void setLat(float lat) {
        this.lat = lat;
    }

    public void setLng(float lng) {
        this.lng = lng;
    }


    
}
