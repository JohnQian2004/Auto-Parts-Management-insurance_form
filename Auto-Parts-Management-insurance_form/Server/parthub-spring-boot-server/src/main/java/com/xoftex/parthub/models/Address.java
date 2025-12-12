package com.xoftex.parthub.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "addresses")
public class Address extends AuditModel {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Integer id;

  @Enumerated(EnumType.STRING)
  @Column(length = 30)
  private EAddressType name;

  @Size(max = 200)
  private String street;

  @Size(max = 200)
  private String city;

  @Size(max = 200)
  private String state;

  @Size(max = 20)
  private String zip;

  @Column(name = "lat")
  private float lat = 0;

  @Column(name = "lng")
  private float lng = 0;

  public Address() {

  }

  public Address(EAddressType name) {
    this.name = name;
  }

  public Integer getId() {
    return id;
  }

  public void setId(Integer id) {
    this.id = id;
  }

  public EAddressType getName() {
    return name;
  }

  public void setName(EAddressType name) {
    this.name = name;
  }

  public String getStreet() {
    return street;
  }

  public String getCity() {
    return city;
  }

  public String getState() {
    return state;
  }

  public String getZip() {
    return zip;
  }

  public void setStreet(String street) {
    this.street = street;
  }

  public void setCity(String city) {
    this.city = city;
  }

  public void setState(String state) {
    this.state = state;
  }

  public void setZip(String zip) {
    this.zip = zip;
  }

  public void setLat(float lat) {

    try {
      this.lat = lat;
    } catch (Exception exception) {

    }

  }

  public void setLng(float lng) {

    try {
      this.lng = lng;
    } catch (Exception exception) {

    }
  }

  public float getLat() {
    return lat;
  }

  public float getLng() {
    return lng;
  }

}