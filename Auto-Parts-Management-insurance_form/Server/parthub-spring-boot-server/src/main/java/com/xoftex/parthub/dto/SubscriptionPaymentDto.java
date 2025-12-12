package com.xoftex.parthub.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.xoftex.parthub.models.SubscriptionPayment;

public class SubscriptionPaymentDto {
    private Long id;
    private Long vendorSubscriptionId;
    private BigDecimal amount;
    private String currency;
    private String paymentStatus;
    private String stripeCustomerId;
    private String stripePaymentMethodId;
    private String paymentIntentId;
    private String paymentMethodType;
    private String paymentMethodLast4;
    private LocalDateTime processedAt;
    private LocalDateTime createdAt;
    private String metadata;

    public SubscriptionPaymentDto() {
    }

    public static SubscriptionPaymentDto fromEntity(SubscriptionPayment p) {
        SubscriptionPaymentDto dto = new SubscriptionPaymentDto();
        dto.id = p.getId();
        dto.vendorSubscriptionId = p.getVendorSubscription() != null ? p.getVendorSubscription().getId() : null;
        dto.amount = p.getAmount();
        dto.currency = p.getCurrency();
        dto.paymentStatus = p.getPaymentStatus();
        dto.stripeCustomerId = p.getStripeCustomerId();
        dto.stripePaymentMethodId = p.getStripePaymentMethodId();
        dto.paymentIntentId = p.getPaymentIntentId();
        dto.paymentMethodType = p.getPaymentMethodType();
        dto.paymentMethodLast4 = p.getPaymentMethodLast4();
        dto.processedAt = p.getProcessedAt();
        dto.createdAt = p.getCreatedAt();
        dto.metadata = p.getMetadata();
        return dto;
    }

    public Long getId() {
        return id;
    }

    public Long getVendorSubscriptionId() {
        return vendorSubscriptionId;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public String getCurrency() {
        return currency;
    }

    public String getPaymentStatus() {
        return paymentStatus;
    }

    public String getStripeCustomerId() {
        return stripeCustomerId;
    }

    public String getStripePaymentMethodId() {
        return stripePaymentMethodId;
    }

    public String getPaymentIntentId() {
        return paymentIntentId;
    }

    public String getPaymentMethodType() {
        return paymentMethodType;
    }

    public String getPaymentMethodLast4() {
        return paymentMethodLast4;
    }

    public LocalDateTime getProcessedAt() {
        return processedAt;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public String getMetadata() {
        return metadata;
    }
}
