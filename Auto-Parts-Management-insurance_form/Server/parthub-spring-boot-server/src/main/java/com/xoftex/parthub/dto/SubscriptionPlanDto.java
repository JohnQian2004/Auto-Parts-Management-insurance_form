package com.xoftex.parthub.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.xoftex.parthub.models.SubscriptionPlan;

/**
 * DTO for SubscriptionPlan to avoid lazy loading issues with JPA entities.
 */
public class SubscriptionPlanDto {
    private Long id;
    private String name;
    private String description;
    private BigDecimal price;
    private Integer durationMonths;
    private String stripePriceId;
    private Boolean isActive;
    private Integer maxTrips;
    private String features;
    private Integer sortOrder;
    private Integer trialDays;
    private BigDecimal trialPrice;
    private String trialStripePriceId;
    private Boolean isPopular;
    private Boolean isFeatured;
    private BigDecimal setupFee;
    private BigDecimal cancellationFee;
    private Integer earlyTerminationDays;
    private Boolean autoUpgrade;
    private BigDecimal upgradeDiscountPercent;
    private String customFeatures;
    private String billingCycle;
    private BigDecimal discountPercent;
    private Integer maxTrialUsers;
    private String trialRestrictions;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Default constructor
    public SubscriptionPlanDto() {
    }

    // Constructor from entity
    public SubscriptionPlanDto(SubscriptionPlan plan) {
        if (plan != null) {
            this.id = plan.getId();
            this.name = plan.getName();
            this.description = plan.getDescription();
            this.price = plan.getPrice();
            this.durationMonths = plan.getDurationMonths();
            this.stripePriceId = plan.getStripePriceId();
            this.isActive = plan.getIsActive();
            this.maxTrips = plan.getMaxTrips();
            this.features = plan.getFeatures();
            this.sortOrder = plan.getSortOrder();
            this.trialDays = plan.getTrialDays();
            this.trialPrice = plan.getTrialPrice();
            this.trialStripePriceId = plan.getTrialStripePriceId();
            this.isPopular = plan.getIsPopular();
            this.isFeatured = plan.getIsFeatured();
            this.setupFee = plan.getSetupFee();
            this.cancellationFee = plan.getCancellationFee();
            this.earlyTerminationDays = plan.getEarlyTerminationDays();
            this.autoUpgrade = plan.getAutoUpgrade();
            this.upgradeDiscountPercent = plan.getUpgradeDiscountPercent();
            this.customFeatures = plan.getCustomFeatures();
            this.billingCycle = plan.getBillingCycle();
            this.discountPercent = plan.getDiscountPercent();
            this.maxTrialUsers = plan.getMaxTrialUsers();
            this.trialRestrictions = plan.getTrialRestrictions();
            this.createdAt = plan.getUpdatedAt();
            this.updatedAt = plan.getUpdatedAt();
        }
    }

    // Getters and setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public Integer getDurationMonths() {
        return durationMonths;
    }

    public void setDurationMonths(Integer durationMonths) {
        this.durationMonths = durationMonths;
    }

    public String getStripePriceId() {
        return stripePriceId;
    }

    public void setStripePriceId(String stripePriceId) {
        this.stripePriceId = stripePriceId;
    }

    public Boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }

    public Integer getMaxTrips() {
        return maxTrips;
    }

    public void setMaxTrips(Integer maxTrips) {
        this.maxTrips = maxTrips;
    }

    public String getFeatures() {
        return features;
    }

    public void setFeatures(String features) {
        this.features = features;
    }

    public Integer getSortOrder() {
        return sortOrder;
    }

    public void setSortOrder(Integer sortOrder) {
        this.sortOrder = sortOrder;
    }

    public Integer getTrialDays() {
        return trialDays;
    }

    public void setTrialDays(Integer trialDays) {
        this.trialDays = trialDays;
    }

    public BigDecimal getTrialPrice() {
        return trialPrice;
    }

    public void setTrialPrice(BigDecimal trialPrice) {
        this.trialPrice = trialPrice;
    }

    public String getTrialStripePriceId() {
        return trialStripePriceId;
    }

    public void setTrialStripePriceId(String trialStripePriceId) {
        this.trialStripePriceId = trialStripePriceId;
    }

    public Boolean getIsPopular() {
        return isPopular;
    }

    public void setIsPopular(Boolean isPopular) {
        this.isPopular = isPopular;
    }

    public Boolean getIsFeatured() {
        return isFeatured;
    }

    public void setIsFeatured(Boolean isFeatured) {
        this.isFeatured = isFeatured;
    }

    public BigDecimal getSetupFee() {
        return setupFee;
    }

    public void setSetupFee(BigDecimal setupFee) {
        this.setupFee = setupFee;
    }

    public BigDecimal getCancellationFee() {
        return cancellationFee;
    }

    public void setCancellationFee(BigDecimal cancellationFee) {
        this.cancellationFee = cancellationFee;
    }

    public Integer getEarlyTerminationDays() {
        return earlyTerminationDays;
    }

    public void setEarlyTerminationDays(Integer earlyTerminationDays) {
        this.earlyTerminationDays = earlyTerminationDays;
    }

    public Boolean getAutoUpgrade() {
        return autoUpgrade;
    }

    public void setAutoUpgrade(Boolean autoUpgrade) {
        this.autoUpgrade = autoUpgrade;
    }

    public BigDecimal getUpgradeDiscountPercent() {
        return upgradeDiscountPercent;
    }

    public void setUpgradeDiscountPercent(BigDecimal upgradeDiscountPercent) {
        this.upgradeDiscountPercent = upgradeDiscountPercent;
    }

    public String getCustomFeatures() {
        return customFeatures;
    }

    public void setCustomFeatures(String customFeatures) {
        this.customFeatures = customFeatures;
    }

    public String getBillingCycle() {
        return billingCycle;
    }

    public void setBillingCycle(String billingCycle) {
        this.billingCycle = billingCycle;
    }

    public BigDecimal getDiscountPercent() {
        return discountPercent;
    }

    public void setDiscountPercent(BigDecimal discountPercent) {
        this.discountPercent = discountPercent;
    }

    public Integer getMaxTrialUsers() {
        return maxTrialUsers;
    }

    public void setMaxTrialUsers(Integer maxTrialUsers) {
        this.maxTrialUsers = maxTrialUsers;
    }

    public String getTrialRestrictions() {
        return trialRestrictions;
    }

    public void setTrialRestrictions(String trialRestrictions) {
        this.trialRestrictions = trialRestrictions;
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