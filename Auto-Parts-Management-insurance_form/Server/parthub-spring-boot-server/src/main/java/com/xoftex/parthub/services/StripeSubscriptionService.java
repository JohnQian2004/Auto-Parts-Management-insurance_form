package com.xoftex.parthub.services;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.Price;
import com.stripe.model.Product;
import com.stripe.model.Subscription;
import com.stripe.param.PriceCreateParams;
import com.stripe.param.ProductCreateParams;
import com.stripe.param.ProductUpdateParams;
import com.stripe.param.SubscriptionCreateParams;
import com.stripe.param.SubscriptionUpdateParams;

import jakarta.annotation.PostConstruct;

/**
 * Service for handling Stripe subscription plan operations.
 * Responsible for creating, updating, and managing Stripe products and prices
 * for subscription plans.
 */
@Service
public class StripeSubscriptionService {

    @Value("${stripe.secret.key}")
    private String secretKey;

    @Value("${stripe.publishable.key}")
    private String publishableKey;

    @PostConstruct
    public void init() {
        Stripe.apiKey = secretKey;
    }

    /**
     * Creates a Stripe Product for a subscription plan
     * 
     * @param name        The product name
     * @param description The product description
     * @param metadata    Additional metadata
     * @return The created Product object
     * @throws StripeException If there's an error with the Stripe API
     */
    public Product createProduct(String name, String description, Map<String, String> metadata) throws StripeException {
        ProductCreateParams.Builder paramsBuilder = ProductCreateParams.builder()
                .setName(name)
                .setDescription(description)
                .setType(ProductCreateParams.Type.SERVICE);

        if (metadata != null && !metadata.isEmpty()) {
            paramsBuilder.putAllMetadata(metadata);
        }

        return Product.create(paramsBuilder.build());
    }

    /**
     * Creates a Stripe Price for a subscription plan
     * 
     * @param productId     The Stripe product ID
     * @param amount        The price amount in dollars
     * @param currency      The currency code (e.g., "usd")
     * @param interval      The billing interval (month, year)
     * @param intervalCount The number of intervals between billings
     * @param metadata      Additional metadata
     * @return The created Price object
     * @throws StripeException If there's an error with the Stripe API
     */
    public Price createPrice(String productId, BigDecimal amount, String currency,
            String interval, Integer intervalCount, Map<String, String> metadata) throws StripeException {

        // Convert amount to cents
        long amountInCents = amount.multiply(new BigDecimal(100)).longValue();

        PriceCreateParams.Builder paramsBuilder = PriceCreateParams.builder()
                .setProduct(productId)
                .setCurrency(currency)
                .setUnitAmount(amountInCents)
                .setRecurring(PriceCreateParams.Recurring.builder()
                        .setInterval(PriceCreateParams.Recurring.Interval.valueOf(interval.toUpperCase()))
                        .setIntervalCount(Long.valueOf(intervalCount))
                        .build());

        if (metadata != null && !metadata.isEmpty()) {
            paramsBuilder.putAllMetadata(metadata);
        }

        return Price.create(paramsBuilder.build());
    }

    /**
     * Updates a Stripe Product
     * 
     * @param productId   The Stripe product ID
     * @param name        The new product name
     * @param description The new product description
     * @return The updated Product object
     * @throws StripeException If there's an error with the Stripe API
     */
    public Product updateProduct(String productId, String name, String description) throws StripeException {
        ProductUpdateParams.Builder paramsBuilder = ProductUpdateParams.builder()
                .setName(name)
                .setDescription(description);

        return Product.retrieve(productId).update(paramsBuilder.build());
    }

    /**
     * Archives a Stripe Product
     * 
     * @param productId The Stripe product ID
     * @return The archived Product object
     * @throws StripeException If there's an error with the Stripe API
     */
    public Product archiveProduct(String productId) throws StripeException {
        ProductUpdateParams params = ProductUpdateParams.builder()
                .setActive(false)
                .build();

        return Product.retrieve(productId).update(params);
    }

    /**
     * Retrieves a Stripe Product
     * 
     * @param productId The Stripe product ID
     * @return The Product object
     * @throws StripeException If there's an error with the Stripe API
     */
    public Product getProduct(String productId) throws StripeException {
        return Product.retrieve(productId);
    }

    /**
     * Retrieves a Stripe Price
     * 
     * @param priceId The Stripe price ID
     * @return The Price object
     * @throws StripeException If there's an error with the Stripe API
     */
    public Price getPrice(String priceId) throws StripeException {
        return Price.retrieve(priceId);
    }

    /**
     * Creates metadata for subscription plan
     * 
     * @param planId         The subscription plan ID
     * @param durationMonths The plan duration in months
     * @param maxTrips       The maximum trips allowed
     * @param isTrialOnly    Whether this is a trial-only plan
     * @return Metadata map
     */
    public Map<String, String> createPlanMetadata(Long planId, Integer durationMonths, Integer maxTrips,
            Boolean isTrialOnly) {
        Map<String, String> metadata = new HashMap<>();
        metadata.put("plan_id", planId.toString());
        metadata.put("duration_months", durationMonths.toString());
        metadata.put("max_trips", maxTrips != null ? maxTrips.toString() : "0");
        metadata.put("is_trial_only", isTrialOnly != null ? isTrialOnly.toString() : "false");
        metadata.put("created_at", LocalDateTime.now().toString());
        return metadata;
    }

    /**
     * Determines the billing interval based on duration months
     * 
     * @param durationMonths The duration in months
     * @return Array with [interval, intervalCount]
     */
    public String[] getBillingInterval(Integer durationMonths) {
        if (durationMonths == null || durationMonths <= 0) {
            return new String[] { "month", "1" };
        }

        if (durationMonths == 1) {
            return new String[] { "month", "1" };
        } else if (durationMonths == 3) {
            return new String[] { "month", "3" };
        } else if (durationMonths == 6) {
            return new String[] { "month", "6" };
        } else if (durationMonths == 12) {
            return new String[] { "year", "1" };
        } else {
            // For other durations, use months
            return new String[] { "month", durationMonths.toString() };
        }
    }

    /**
     * Creates a Stripe subscription
     * 
     * @param customerId The Stripe customer ID
     * @param priceId    The Stripe price ID
     * @return The created Subscription object
     * @throws StripeException If there's an error with the Stripe API
     */
    public Subscription createSubscription(String customerId, String priceId) throws StripeException {
        SubscriptionCreateParams params = SubscriptionCreateParams.builder()
                .setCustomer(customerId)
                .addItem(SubscriptionCreateParams.Item.builder()
                        .setPrice(priceId)
                        .build())
                .build();

        return Subscription.create(params);
    }

    /**
     * Creates a Stripe subscription with trial period
     * 
     * @param customerId The Stripe customer ID
     * @param priceId    The Stripe price ID
     * @param trialDays  The number of trial days
     * @return The created Subscription object
     * @throws StripeException If there's an error with the Stripe API
     */
    public Subscription createSubscriptionWithTrial(String customerId, String priceId, Integer trialDays)
            throws StripeException {
        SubscriptionCreateParams params = SubscriptionCreateParams.builder()
                .setCustomer(customerId)
                .addItem(SubscriptionCreateParams.Item.builder()
                        .setPrice(priceId)
                        .build())
                .setTrialPeriodDays(Long.valueOf(trialDays))
                .build();

        return Subscription.create(params);
    }

    /**
     * Cancels a Stripe subscription immediately
     * 
     * @param subscriptionId The Stripe subscription ID
     * @return The cancelled Subscription object
     * @throws StripeException If there's an error with the Stripe API
     */
    public Subscription getSubscription(String subscriptionId) throws StripeException {
        return Subscription.retrieve(subscriptionId);
    }

    public Subscription cancelSubscription(String subscriptionId) throws StripeException {
        // Cancel immediately using the proper Stripe API method
        Subscription subscription = Subscription.retrieve(subscriptionId);
        System.out.println("Before cancel - Status: " + subscription.getStatus());

        // Use the delete method for immediate cancellation
        Subscription canceledSub = subscription.cancel();
        System.out.println("After cancel - Status: " + canceledSub.getStatus());
        System.out.println("Canceled at: " + canceledSub.getCanceledAt());

        return canceledSub;
    }

    /**
     * Cancels a Stripe subscription at the end of the current period
     * 
     * @param subscriptionId The Stripe subscription ID
     * @return The updated Subscription object
     * @throws StripeException If there's an error with the Stripe API
     */
    public Subscription cancelSubscriptionAtPeriodEnd(String subscriptionId) throws StripeException {
        SubscriptionUpdateParams params = SubscriptionUpdateParams.builder()
                .setCancelAtPeriodEnd(true)
                .build();

        return Subscription.retrieve(subscriptionId).update(params);
    }

    /**
     * Reactivates a cancelled Stripe subscription
     * 
     * @param subscriptionId The Stripe subscription ID
     * @return The reactivated Subscription object
     * @throws StripeException If there's an error with the Stripe API
     */
    public Subscription reactivateSubscription(String subscriptionId) throws StripeException {
        SubscriptionUpdateParams params = SubscriptionUpdateParams.builder()
                .setCancelAtPeriodEnd(false)
                .build();

        return Subscription.retrieve(subscriptionId).update(params);
    }
}