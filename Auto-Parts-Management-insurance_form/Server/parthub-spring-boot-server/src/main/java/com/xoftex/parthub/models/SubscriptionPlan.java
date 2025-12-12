package com.xoftex.parthub.models;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Entity
@Table(name = "subscription_plans")
@JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
public class SubscriptionPlan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Plan name is required")
    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @NotNull(message = "Price is required")
    @Column(name = "price", nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    @NotNull(message = "Duration is required")
    @Column(name = "duration_months", nullable = false)
    private Integer durationMonths;

    @Column(name = "max_trips")
    private Integer maxTrips;

    @Column(name = "features", columnDefinition = "JSON")
    private String features;

    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    // Stripe integration fields
    @Column(name = "stripe_product_id")
    private String stripeProductId;

    @Column(name = "stripe_price_id")
    private String stripePriceId;

    @Column(name = "stripe_sync")
    private Boolean stripeSync = false;

    // Transient field for subscriber count (not persisted)
    @Transient
    private Long subscriberCount = 0L;

    @Column(name = "last_sync_date")
    private LocalDateTime lastSyncDate;

    @Column(name = "trial_days")
    private Integer trialDays;

    @Column(name = "trial_price", precision = 10, scale = 2)
    private BigDecimal trialPrice;

    @Column(name = "trial_stripe_price_id")
    private String trialStripePriceId;

    @Column(name = "is_trial_only")
    private Boolean isTrialOnly = false;

    // Advanced plan configuration
    @Column(name = "max_users")
    private Integer maxUsers;

    @Column(name = "max_vehicles")
    private Integer maxVehicles;

    @Column(name = "max_jobs_per_month")
    private Integer maxJobsPerMonth;

    @Column(name = "sort_order")
    private Integer sortOrder;

    @Column(name = "is_popular")
    private Boolean isPopular = false;

    @Column(name = "is_featured")
    private Boolean isFeatured = false;

    // Financial fields
    @Column(name = "setup_fee", precision = 10, scale = 2)
    private BigDecimal setupFee;

    @Column(name = "cancellation_fee", precision = 10, scale = 2)
    private BigDecimal cancellationFee;

    @Column(name = "early_termination_days")
    private Integer earlyTerminationDays;

    @Column(name = "auto_upgrade")
    private Boolean autoUpgrade = false;

    @Column(name = "upgrade_discount_percent", precision = 5, scale = 2)
    private BigDecimal upgradeDiscountPercent;

    // Customization fields
    @Column(name = "custom_features", columnDefinition = "TEXT")
    private String customFeatures;

    @Column(name = "billing_cycle")
    private String billingCycle;

    @Column(name = "discount_percent", precision = 5, scale = 2)
    private BigDecimal discountPercent;

    @Column(name = "max_trial_users")
    private Integer maxTrialUsers;

    @Column(name = "trial_restrictions", columnDefinition = "TEXT")
    private String trialRestrictions;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Plan priority for hierarchy (higher number = higher priority)
    @Column(name = "priority")
    private Integer priority = 1;

    // Constructors
    public SubscriptionPlan() {
    }

    public SubscriptionPlan(String name, BigDecimal price, Integer durationMonths) {
        this.name = name;
        this.price = price;
        this.durationMonths = durationMonths;
    }

    // Getters and Setters
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
        if (features == null || features.trim().isEmpty()) {
            this.features = null;
        } else {
            // If it's not valid JSON, wrap it in quotes to make it valid JSON
            String trimmed = features.trim();
            if (!trimmed.startsWith("{") && !trimmed.startsWith("[") && !trimmed.startsWith("\"")) {
                // It's a plain string, wrap it in quotes to make it valid JSON
                this.features = "\"" + trimmed.replace("\"", "\\\"") + "\"";
            } else {
                this.features = features;
            }
        }
    }

    public Boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    // Stripe integration getters and setters
    public String getStripeProductId() {
        return stripeProductId;
    }

    public void setStripeProductId(String stripeProductId) {
        this.stripeProductId = stripeProductId;
    }

    public String getStripePriceId() {
        return stripePriceId;
    }

    public void setStripePriceId(String stripePriceId) {
        this.stripePriceId = stripePriceId;
    }

    public Boolean getStripeSync() {
        return stripeSync;
    }

    public void setStripeSync(Boolean stripeSync) {
        this.stripeSync = stripeSync;
    }

    public LocalDateTime getLastSyncDate() {
        return lastSyncDate;
    }

    public void setLastSyncDate(LocalDateTime lastSyncDate) {
        this.lastSyncDate = lastSyncDate;
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

    public Boolean getIsTrialOnly() {
        return isTrialOnly;
    }

    public void setIsTrialOnly(Boolean isTrialOnly) {
        this.isTrialOnly = isTrialOnly;
    }

    // Advanced plan configuration getters and setters
    public Integer getMaxUsers() {
        return maxUsers;
    }

    public void setMaxUsers(Integer maxUsers) {
        this.maxUsers = maxUsers;
    }

    public Integer getMaxVehicles() {
        return maxVehicles;
    }

    public void setMaxVehicles(Integer maxVehicles) {
        this.maxVehicles = maxVehicles;
    }

    public Integer getMaxJobsPerMonth() {
        return maxJobsPerMonth;
    }

    public void setMaxJobsPerMonth(Integer maxJobsPerMonth) {
        this.maxJobsPerMonth = maxJobsPerMonth;
    }

    public Integer getSortOrder() {
        return sortOrder;
    }

    public void setSortOrder(Integer sortOrder) {
        this.sortOrder = sortOrder;
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

    // Financial fields getters and setters
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

    // Customization fields getters and setters
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

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public Long getSubscriberCount() {
        return subscriberCount;
    }

    public void setSubscriberCount(Long subscriberCount) {
        this.subscriberCount = subscriberCount;
    }

    public Integer getPriority() {
        return priority;
    }

    public void setPriority(Integer priority) {
        this.priority = priority;
    }

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    // Custom validation method for price
    public boolean isValidPrice() {
        if (price == null) {
            return false;
        }
        // For trial-only plans, price can be 0 or positive
        if (Boolean.TRUE.equals(isTrialOnly)) {
            return price.compareTo(BigDecimal.ZERO) >= 0;
        }
        // For regular plans, price must be positive
        return price.compareTo(BigDecimal.ZERO) > 0;
    }

    // Calculate plan priority based on business rules
    public int calculatePriority() {
        // Trial-only plans have lowest priority
        if (Boolean.TRUE.equals(isTrialOnly)) {
            return 1;
        }

        // Paid plans: higher duration = higher priority
        if (durationMonths != null) {
            if (durationMonths >= 12) {
                return 4; // Annual plans
            } else if (durationMonths >= 6) {
                return 3; // Semi-annual plans
            } else if (durationMonths >= 3) {
                return 2; // Quarterly plans
            } else {
                return 2; // Monthly plans
            }
        }

        // Default priority
        return 1;
    }

    @Override
    public String toString() {
        return "SubscriptionPlan{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", price=" + price +
                ", durationMonths=" + durationMonths +
                ", isActive=" + isActive +
                ", stripePriceId='" + stripePriceId + '\'' +
                ", trialDays=" + trialDays +
                ", isPopular=" + isPopular +
                ", isFeatured=" + isFeatured +
                '}';
    }
}