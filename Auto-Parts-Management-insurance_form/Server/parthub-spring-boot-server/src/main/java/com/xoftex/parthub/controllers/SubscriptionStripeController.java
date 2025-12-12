package com.xoftex.parthub.controllers;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.xoftex.parthub.models.SubscriptionPlan;
import com.xoftex.parthub.services.StripeSubscriptionService;
import com.xoftex.parthub.services.SubscriptionService;

/**
 * Controller for handling Stripe integration with subscription plans.
 * Provides endpoints for syncing subscription plans with Stripe.
 */
@RestController
@RequestMapping("/api/subscription/admin/subscriptions/plans")
@CrossOrigin(origins = "*")
public class SubscriptionStripeController {

    @Autowired
    private SubscriptionService subscriptionService;

    @Autowired
    private StripeSubscriptionService stripeSubscriptionService;

    /**
     * Sync a subscription plan with Stripe
     * Creates or updates Stripe product and price for the plan
     */
    @PostMapping("/{planId}/stripe-sync")
    @PreAuthorize("hasAnyRole('ADMIN')")
    public ResponseEntity<?> syncPlanWithStripe(@PathVariable Long planId) {
        try {
            Optional<SubscriptionPlan> planOpt = subscriptionService.getSubscriptionPlanById(planId);
            if (planOpt.isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(createErrorResponse("Subscription plan not found with id: " + planId));
            }

            SubscriptionPlan plan = planOpt.get();

            // Skip trial-only plans (they don't need Stripe integration)
            if (Boolean.TRUE.equals(plan.getIsTrialOnly())) {
                return ResponseEntity.ok(createSuccessResponse(
                        "Trial-only plan does not require Stripe integration",
                        null,
                        null));
            }

            String stripeProductId = plan.getStripeProductId();
            String stripePriceId = plan.getStripePriceId();

            // Create or update Stripe product
            if (stripeProductId == null) {
                // Create new product
                Map<String, String> metadata = stripeSubscriptionService.createPlanMetadata(
                        plan.getId(),
                        plan.getDurationMonths(),
                        plan.getMaxTrips(),
                        plan.getIsTrialOnly());

                var stripeProduct = stripeSubscriptionService.createProduct(
                        plan.getName(),
                        plan.getDescription(),
                        metadata);
                stripeProductId = stripeProduct.getId();
                plan.setStripeProductId(stripeProductId);
            } else {
                // Update existing product
                stripeSubscriptionService.updateProduct(
                        stripeProductId,
                        plan.getName(),
                        plan.getDescription());
            }

            // Create or update Stripe price
            if (stripePriceId == null) {
                // Create new price
                String[] billingInterval = stripeSubscriptionService.getBillingInterval(plan.getDurationMonths());
                Map<String, String> priceMetadata = stripeSubscriptionService.createPlanMetadata(
                        plan.getId(),
                        plan.getDurationMonths(),
                        plan.getMaxTrips(),
                        plan.getIsTrialOnly());

                var stripePrice = stripeSubscriptionService.createPrice(
                        stripeProductId,
                        plan.getPrice(),
                        "usd",
                        billingInterval[0],
                        Integer.parseInt(billingInterval[1]),
                        priceMetadata);
                stripePriceId = stripePrice.getId();
                plan.setStripePriceId(stripePriceId);
            }

            // Update plan sync status
            plan.setStripeSync(true);
            plan.setLastSyncDate(LocalDateTime.now());

            // Save updated plan
            subscriptionService.updateSubscriptionPlan(planId, plan);

            return ResponseEntity.ok(createSuccessResponse(
                    "Plan synchronized with Stripe successfully",
                    stripeProductId,
                    stripePriceId));

        } catch (Exception e) {
            System.err.println("Error syncing plan with Stripe: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest()
                    .body(createErrorResponse("Failed to sync plan with Stripe: " + e.getMessage()));
        }
    }

    /**
     * Update Stripe price for a subscription plan
     */
    @PutMapping("/{planId}/stripe-price")
    @PreAuthorize("hasAnyRole('ADMIN')")
    public ResponseEntity<?> updateStripePrice(@PathVariable Long planId) {
        try {
            Optional<SubscriptionPlan> planOpt = subscriptionService.getSubscriptionPlanById(planId);
            if (planOpt.isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(createErrorResponse("Subscription plan not found with id: " + planId));
            }

            SubscriptionPlan plan = planOpt.get();

            if (plan.getStripePriceId() == null) {
                return ResponseEntity.badRequest()
                        .body(createErrorResponse("Plan is not synced with Stripe. Please sync first."));
            }

            // For now, we'll create a new price since Stripe doesn't allow updating
            // existing prices
            // In production, you might want to archive the old price and create a new one
            String[] billingInterval = stripeSubscriptionService.getBillingInterval(plan.getDurationMonths());
            Map<String, String> priceMetadata = stripeSubscriptionService.createPlanMetadata(
                    plan.getId(),
                    plan.getDurationMonths(),
                    plan.getMaxTrips(),
                    plan.getIsTrialOnly());

            var newStripePrice = stripeSubscriptionService.createPrice(
                    plan.getStripeProductId(),
                    plan.getPrice(),
                    "usd",
                    billingInterval[0],
                    Integer.parseInt(billingInterval[1]),
                    priceMetadata);

            // Update plan with new price ID
            plan.setStripePriceId(newStripePrice.getId());
            plan.setLastSyncDate(LocalDateTime.now());
            subscriptionService.updateSubscriptionPlan(planId, plan);

            return ResponseEntity.ok(createSuccessResponse(
                    "Stripe price updated successfully",
                    plan.getStripeProductId(),
                    newStripePrice.getId()));

        } catch (Exception e) {
            System.err.println("Error updating Stripe price: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest()
                    .body(createErrorResponse("Failed to update Stripe price: " + e.getMessage()));
        }
    }

    /**
     * Archive Stripe product for a subscription plan
     */
    @DeleteMapping("/{planId}/stripe-archive")
    @PreAuthorize("hasAnyRole('ADMIN')")
    public ResponseEntity<?> archiveStripeProduct(@PathVariable Long planId) {
        try {
            Optional<SubscriptionPlan> planOpt = subscriptionService.getSubscriptionPlanById(planId);
            if (planOpt.isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(createErrorResponse("Subscription plan not found with id: " + planId));
            }

            SubscriptionPlan plan = planOpt.get();

            if (plan.getStripeProductId() == null) {
                return ResponseEntity.badRequest()
                        .body(createErrorResponse("Plan is not synced with Stripe."));
            }

            // Archive the Stripe product
            stripeSubscriptionService.archiveProduct(plan.getStripeProductId());

            // Update plan sync status
            plan.setStripeSync(false);
            plan.setLastSyncDate(LocalDateTime.now());
            subscriptionService.updateSubscriptionPlan(planId, plan);

            return ResponseEntity.ok(createSuccessResponse(
                    "Stripe product archived successfully",
                    plan.getStripeProductId(),
                    plan.getStripePriceId()));

        } catch (Exception e) {
            System.err.println("Error archiving Stripe product: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest()
                    .body(createErrorResponse("Failed to archive Stripe product: " + e.getMessage()));
        }
    }

    /**
     * Get Stripe dashboard URL for a plan
     */
    @GetMapping("/{planId}/stripe-dashboard-url")
    @PreAuthorize("hasAnyRole('ADMIN')")
    public ResponseEntity<?> getStripeDashboardUrl(@PathVariable Long planId) {
        try {
            Optional<SubscriptionPlan> planOpt = subscriptionService.getSubscriptionPlanById(planId);
            if (planOpt.isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(createErrorResponse("Subscription plan not found with id: " + planId));
            }

            SubscriptionPlan plan = planOpt.get();

            if (plan.getStripeProductId() == null) {
                return ResponseEntity.badRequest()
                        .body(createErrorResponse("Plan is not synced with Stripe."));
            }

            String dashboardUrl = "https://dashboard.stripe.com/products/" + plan.getStripeProductId();

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("dashboardUrl", dashboardUrl);
            response.put("productId", plan.getStripeProductId());
            response.put("priceId", plan.getStripePriceId());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            System.err.println("Error getting Stripe dashboard URL: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest()
                    .body(createErrorResponse("Failed to get Stripe dashboard URL: " + e.getMessage()));
        }
    }

    /**
     * Sync all active subscription plans with Stripe
     */
    @PostMapping("/stripe-sync-all")
    @PreAuthorize("hasAnyRole('ADMIN')")
    public ResponseEntity<?> syncAllPlansWithStripe() {
        try {
            // Get all active subscription plans
            var allPlans = subscriptionService.getAllSubscriptionPlans();
            var activePlans = allPlans.stream()
                    .filter(plan -> Boolean.TRUE.equals(plan.getIsActive()))
                    .filter(plan -> !Boolean.TRUE.equals(plan.getIsTrialOnly())) // Skip trial-only plans
                    .toList();

            if (activePlans.isEmpty()) {
                return ResponseEntity.ok(createSuccessResponse(
                        "No active plans found to sync with Stripe",
                        null,
                        null));
            }

            int successCount = 0;
            int errorCount = 0;
            StringBuilder errorMessages = new StringBuilder();

            for (SubscriptionPlan plan : activePlans) {
                try {
                    // Sync individual plan
                    syncPlanWithStripeInternal(plan);
                    successCount++;
                } catch (Exception e) {
                    errorCount++;
                    errorMessages.append("Plan '").append(plan.getName()).append("': ").append(e.getMessage())
                            .append("; ");
                }
            }

            String message = String.format("Synced %d plans successfully. %d errors occurred.", successCount,
                    errorCount);
            if (errorCount > 0) {
                message += " Errors: " + errorMessages.toString();
            }

            Map<String, Object> response = new HashMap<>();
            response.put("success", errorCount == 0);
            response.put("message", message);
            response.put("totalPlans", activePlans.size());
            response.put("successCount", successCount);
            response.put("errorCount", errorCount);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            System.err.println("Error syncing all plans with Stripe: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest()
                    .body(createErrorResponse("Failed to sync all plans with Stripe: " + e.getMessage()));
        }
    }

    /**
     * Internal method to sync a single plan with Stripe
     */
    private void syncPlanWithStripeInternal(SubscriptionPlan plan) throws Exception {
        String stripeProductId = plan.getStripeProductId();
        String stripePriceId = plan.getStripePriceId();

        // Create or update Stripe product
        if (stripeProductId == null) {
            // Create new product
            Map<String, String> metadata = stripeSubscriptionService.createPlanMetadata(
                    plan.getId(),
                    plan.getDurationMonths(),
                    plan.getMaxTrips(),
                    plan.getIsTrialOnly());

            var stripeProduct = stripeSubscriptionService.createProduct(
                    plan.getName(),
                    plan.getDescription(),
                    metadata);
            stripeProductId = stripeProduct.getId();
            plan.setStripeProductId(stripeProductId);
        } else {
            // Update existing product
            stripeSubscriptionService.updateProduct(
                    stripeProductId,
                    plan.getName(),
                    plan.getDescription());
        }

        // Create or update Stripe price
        if (stripePriceId == null) {
            // Create new price
            String[] billingInterval = stripeSubscriptionService.getBillingInterval(plan.getDurationMonths());
            Map<String, String> priceMetadata = stripeSubscriptionService.createPlanMetadata(
                    plan.getId(),
                    plan.getDurationMonths(),
                    plan.getMaxTrips(),
                    plan.getIsTrialOnly());

            var stripePrice = stripeSubscriptionService.createPrice(
                    stripeProductId,
                    plan.getPrice(),
                    "usd",
                    billingInterval[0],
                    Integer.parseInt(billingInterval[1]),
                    priceMetadata);
            stripePriceId = stripePrice.getId();
            plan.setStripePriceId(stripePriceId);
        }

        // Update plan sync status
        plan.setStripeSync(true);
        plan.setLastSyncDate(LocalDateTime.now());

        // Save updated plan
        subscriptionService.updateSubscriptionPlan(plan.getId(), plan);
    }

    private Map<String, Object> createSuccessResponse(String message, String stripeProductId, String stripePriceId) {
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", message);
        response.put("stripeProductId", stripeProductId);
        response.put("stripePriceId", stripePriceId);
        return response;
    }

    private Map<String, Object> createErrorResponse(String message) {
        Map<String, Object> response = new HashMap<>();
        response.put("success", false);
        response.put("message", message);
        return response;
    }
}
