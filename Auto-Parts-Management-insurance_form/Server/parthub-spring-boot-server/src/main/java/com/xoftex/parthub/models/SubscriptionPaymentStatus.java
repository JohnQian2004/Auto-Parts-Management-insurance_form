package com.xoftex.parthub.models;

public enum SubscriptionPaymentStatus {
    PENDING, // Payment initiated but not yet processed
    PROCESSING, // Payment being processed by payment gateway
    PAID, // Payment successfully captured and confirmed
    FAILED, // Payment rejected or failed during processing
    REFUNDED, // Payment partially or fully refunded to customer
    DISPUTED, // Chargeback initiated by customer
    CANCELLED, // Payment cancelled before completion
    VERIFIED // Payment verified and settled by payment gateway
}