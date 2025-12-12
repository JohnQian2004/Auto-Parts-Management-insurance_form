package com.xoftex.parthub.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

import com.xoftex.parthub.models.SubscriptionStatus;
import com.xoftex.parthub.models.VendorSubscription;

public class VendorSubscriptionDto {
    private Long id;
    private Long vendorId;
    private String vendorName;
    private String vendorEmail;
    private UserDto vendor;
    private Long planId;
    private String planName;
    private String planDescription;
    private Double planPrice;
    private LocalDate startDate;
    private LocalDate endDate;
    private SubscriptionStatus status;
    private String paymentIntentId;
    private String stripeSubscriptionId;
    private String stripeCustomerId;
    private String paymentMethodId;
    private LocalDate trialStartDate;
    private LocalDate trialEndDate;
    private String cancellationReason;
    private Long supersededBySubscriptionId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Constructors
    public VendorSubscriptionDto() {
    }

    public VendorSubscriptionDto(VendorSubscription subscription) {
        this.id = subscription.getId();
        this.vendorId = subscription.getVendorId();
        this.planId = subscription.getPlanId();
        this.startDate = subscription.getStartDate();
        this.endDate = subscription.getEndDate();
        this.status = subscription.getStatus();
        this.paymentIntentId = subscription.getPaymentIntentId();
        this.stripeSubscriptionId = subscription.getStripeSubscriptionId();
        this.stripeCustomerId = subscription.getStripeCustomerId();
        this.paymentMethodId = subscription.getPaymentMethodId();
        this.trialStartDate = subscription.getTrialStartDate();
        this.trialEndDate = subscription.getTrialEndDate();
        this.cancellationReason = subscription.getCancellationReason();
        this.supersededBySubscriptionId = subscription.getSupersededBySubscriptionId();
        this.createdAt = subscription.getCreatedAt();
        this.updatedAt = subscription.getUpdatedAt();

        // Set vendor information if available
        if (subscription.getVendor() != null) {
            this.vendorName = subscription.getVendor().getFirstName() + " " + subscription.getVendor().getLastName();
            this.vendorEmail = subscription.getVendor().getEmail();
            // Note: vendor field will be set separately to avoid circular dependency
        }

        // Set plan information if available
        if (subscription.getPlan() != null) {
            this.planName = subscription.getPlan().getName();
            this.planDescription = subscription.getPlan().getDescription();
            this.planPrice = subscription.getPlan().getPrice().doubleValue();
            System.out.println("DEBUG: Plan info for subscription " + subscription.getId() +
                    ": name=" + this.planName +
                    ", price=" + subscription.getPlan().getPrice() +
                    ", planPrice=" + this.planPrice);
        } else {
            System.out.println("DEBUG: No plan found for subscription " + subscription.getId());
        }
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getVendorId() {
        return vendorId;
    }

    public void setVendorId(Long vendorId) {
        this.vendorId = vendorId;
    }

    public String getVendorName() {
        return vendorName;
    }

    public void setVendorName(String vendorName) {
        this.vendorName = vendorName;
    }

    public String getVendorEmail() {
        return vendorEmail;
    }

    public void setVendorEmail(String vendorEmail) {
        this.vendorEmail = vendorEmail;
    }

    public UserDto getVendor() {
        return vendor;
    }

    public void setVendor(UserDto vendor) {
        this.vendor = vendor;
    }

    public Long getPlanId() {
        return planId;
    }

    public void setPlanId(Long planId) {
        this.planId = planId;
    }

    public String getPlanName() {
        return planName;
    }

    public void setPlanName(String planName) {
        this.planName = planName;
    }

    public String getPlanDescription() {
        return planDescription;
    }

    public void setPlanDescription(String planDescription) {
        this.planDescription = planDescription;
    }

    public Double getPlanPrice() {
        return planPrice;
    }

    public void setPlanPrice(Double planPrice) {
        this.planPrice = planPrice;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    public SubscriptionStatus getStatus() {
        return status;
    }

    public void setStatus(SubscriptionStatus status) {
        this.status = status;
    }

    public String getPaymentIntentId() {
        return paymentIntentId;
    }

    public void setPaymentIntentId(String paymentIntentId) {
        this.paymentIntentId = paymentIntentId;
    }

    public String getStripeSubscriptionId() {
        return stripeSubscriptionId;
    }

    public void setStripeSubscriptionId(String stripeSubscriptionId) {
        this.stripeSubscriptionId = stripeSubscriptionId;
    }

    public String getStripeCustomerId() {
        return stripeCustomerId;
    }

    public void setStripeCustomerId(String stripeCustomerId) {
        this.stripeCustomerId = stripeCustomerId;
    }

    public String getPaymentMethodId() {
        return paymentMethodId;
    }

    public void setPaymentMethodId(String paymentMethodId) {
        this.paymentMethodId = paymentMethodId;
    }

    public LocalDate getTrialStartDate() {
        return trialStartDate;
    }

    public void setTrialStartDate(LocalDate trialStartDate) {
        this.trialStartDate = trialStartDate;
    }

    public LocalDate getTrialEndDate() {
        return trialEndDate;
    }

    public void setTrialEndDate(LocalDate trialEndDate) {
        this.trialEndDate = trialEndDate;
    }

    public String getCancellationReason() {
        return cancellationReason;
    }

    public void setCancellationReason(String cancellationReason) {
        this.cancellationReason = cancellationReason;
    }

    public Long getSupersededBySubscriptionId() {
        return supersededBySubscriptionId;
    }

    public void setSupersededBySubscriptionId(Long supersededBySubscriptionId) {
        this.supersededBySubscriptionId = supersededBySubscriptionId;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}