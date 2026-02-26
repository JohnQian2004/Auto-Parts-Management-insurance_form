package com.xoftex.parthub.models;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "smsmessages")
public class SmsMessage extends AuditModel {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;

    @Column(name = "vehicle_id")
    private long vehicleId;

    @Column(name = "user_id")
    private long userId;

    @Column(name = "phone_number")
    private String phoneNumber;

    @Size(max = 1600)
    @Column(name = "message")
    private String message;

    @Column(name = "direction")
    private String direction; // "outbound" or "inbound"

    @Column(name = "status")
    private String status; // "sent", "delivered", "failed", "received"

    @Column(name = "twilio_sid")
    private String twilioSid;

    @Column(name = "vehicle_status")
    private String vehicleStatus;

    @Column(name = "error_message")
    private String errorMessage;

    public SmsMessage() {
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public long getVehicleId() {
        return vehicleId;
    }

    public void setVehicleId(long vehicleId) {
        this.vehicleId = vehicleId;
    }

    public long getUserId() {
        return userId;
    }

    public void setUserId(long userId) {
        this.userId = userId;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getDirection() {
        return direction;
    }

    public void setDirection(String direction) {
        this.direction = direction;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getTwilioSid() {
        return twilioSid;
    }

    public void setTwilioSid(String twilioSid) {
        this.twilioSid = twilioSid;
    }

    public String getVehicleStatus() {
        return vehicleStatus;
    }

    public void setVehicleStatus(String vehicleStatus) {
        this.vehicleStatus = vehicleStatus;
    }

    public String getErrorMessage() {
        return errorMessage;
    }

    public void setErrorMessage(String errorMessage) {
        this.errorMessage = errorMessage;
    }
}
