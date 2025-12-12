package com.xoftex.parthub.controllers;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.stripe.exception.StripeException;
import com.stripe.model.Price;
import com.stripe.model.Product;
import com.stripe.model.Subscription;
import com.xoftex.parthub.dto.SubscriptionPlanDto;
import com.xoftex.parthub.dto.VendorSubscriptionDto;
import com.xoftex.parthub.models.SubscriptionPayment;
import com.xoftex.parthub.models.SubscriptionPlan;
import com.xoftex.parthub.models.SubscriptionStatus;
import com.xoftex.parthub.models.User;
import com.xoftex.parthub.models.VendorSubscription;
import com.xoftex.parthub.repository.SubscriptionPaymentRepository;
import com.xoftex.parthub.repository.UserRepository;
import com.xoftex.parthub.services.StripeSubscriptionService;
import com.xoftex.parthub.services.SubscriptionPaymentService;
import com.xoftex.parthub.services.SubscriptionService;

@RestController
@RequestMapping("/api/subscription")
public class SubscriptionController {

    @Autowired
    private SubscriptionService subscriptionService;

    @Autowired
    private StripeSubscriptionService stripeSubscriptionService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SubscriptionPaymentRepository subscriptionPaymentRepository;

    @Autowired
    private SubscriptionPaymentService subscriptionPaymentService;

    // @Autowired
    // private StripeCustomerService stripeCustomerService; // unused

    @PostMapping("/create-product")
    @PreAuthorize("hasAnyRole('ADMIN')")
    public ResponseEntity<?> createProduct(@RequestBody CreateProductRequest request) {
        try {
            Product product = stripeSubscriptionService.createProduct(
                    request.getName(),
                    request.getDescription(),
                    null // No metadata for now
            );

            Map<String, String> response = new HashMap<>();
            response.put("productId", product.getId());
            response.put("name", product.getName());

            return ResponseEntity.ok(response);
        } catch (StripeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new MessageResponse("Stripe error: " + e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new MessageResponse("Server error: " + e.getMessage()));
        }
    }

    @PostMapping("/create-price")
    @PreAuthorize("hasAnyRole('ADMIN')")
    public ResponseEntity<?> createPrice(@RequestBody CreatePriceRequest request) {
        try {
            Price price = stripeSubscriptionService.createPrice(
                    request.getProductId(),
                    new BigDecimal(request.getAmount()),
                    request.getCurrency(),
                    request.getInterval(),
                    request.getIntervalCount(),
                    null // No metadata for now
            );

            Map<String, String> response = new HashMap<>();
            response.put("priceId", price.getId());
            response.put("productId", price.getProduct());
            response.put("amount", price.getUnitAmount().toString());

            return ResponseEntity.ok(response);
        } catch (StripeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new MessageResponse("Stripe error: " + e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new MessageResponse("Server error: " + e.getMessage()));
        }
    }

    @GetMapping("/plans/{id}")
    public ResponseEntity<?> getSubscriptionPlanById(@PathVariable Long id) {
        Optional<SubscriptionPlan> plan = subscriptionService.getSubscriptionPlanById(id);
        if (plan.isPresent()) {
            return ResponseEntity.ok(new SubscriptionPlanDto(plan.get()));
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new MessageResponse("Plan not found"));
        }
    }

    @GetMapping("/plans")
    public ResponseEntity<List<SubscriptionPlanDto>> getAllActivePlans() {
        List<SubscriptionPlan> plans = subscriptionService.getAllActivePlans();
        List<SubscriptionPlanDto> planDTOs = plans.stream()
                .map(SubscriptionPlanDto::new)
                .collect(Collectors.toList());
        return new ResponseEntity<>(planDTOs, HttpStatus.OK);
    }

    @GetMapping("/plans/all")
    public ResponseEntity<List<SubscriptionPlanDto>> getAllPlans() {
        List<SubscriptionPlan> plans = subscriptionService.getAllPlans();
        List<SubscriptionPlanDto> planDTOs = plans.stream()
                .map(SubscriptionPlanDto::new)
                .collect(Collectors.toList());
        return new ResponseEntity<>(planDTOs, HttpStatus.OK);
    }

    @GetMapping("/plans/price/{maxPrice}")
    public ResponseEntity<List<SubscriptionPlanDto>> getPlansByMaxPrice(@PathVariable BigDecimal maxPrice) {
        List<SubscriptionPlan> plans = subscriptionService.getPlansByMaxPrice(maxPrice);
        List<SubscriptionPlanDto> planDTOs = plans.stream()
                .map(SubscriptionPlanDto::new)
                .collect(Collectors.toList());
        return new ResponseEntity<>(planDTOs, HttpStatus.OK);
    }

    @GetMapping("/plans/search")
    public ResponseEntity<List<SubscriptionPlanDto>> searchPlansByName(@RequestParam String name) {
        List<SubscriptionPlan> plans = subscriptionService.searchPlansByName(name);
        List<SubscriptionPlanDto> planDTOs = plans.stream()
                .map(SubscriptionPlanDto::new)
                .collect(Collectors.toList());
        return new ResponseEntity<>(planDTOs, HttpStatus.OK);
    }

    @PutMapping("/plans/{id}")
    public ResponseEntity<?> updateSubscriptionPlan(@PathVariable Long id,
            @RequestBody SubscriptionPlan planDetails) {
        try {
            SubscriptionPlan updatedPlan = subscriptionService.updateSubscriptionPlan(id, planDetails);
            return ResponseEntity.ok(new SubscriptionPlanDto(updatedPlan));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new MessageResponse("Server error: " + e.getMessage()));
        }
    }

    @DeleteMapping("/plans/{id}")
    @PreAuthorize("hasAnyRole('ADMIN')")
    public ResponseEntity<?> deleteSubscriptionPlan(@PathVariable Long id) {
        try {
            subscriptionService.deleteSubscriptionPlan(id);
            return ResponseEntity.ok(new MessageResponse("Plan deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new MessageResponse("Server error: " + e.getMessage()));
        }
    }

    @GetMapping("/plans/popular")
    public ResponseEntity<List<SubscriptionPlanDto>> getPopularPlans() {
        List<SubscriptionPlan> plans = subscriptionService.getPopularPlans();
        List<SubscriptionPlanDto> planDTOs = plans.stream()
                .map(SubscriptionPlanDto::new)
                .collect(Collectors.toList());
        return new ResponseEntity<>(planDTOs, HttpStatus.OK);
    }

    @GetMapping("/plans/featured")
    public ResponseEntity<List<SubscriptionPlanDto>> getFeaturedPlans() {
        List<SubscriptionPlan> plans = subscriptionService.getFeaturedPlans();
        List<SubscriptionPlanDto> planDTOs = plans.stream()
                .map(SubscriptionPlanDto::new)
                .collect(Collectors.toList());
        return new ResponseEntity<>(planDTOs, HttpStatus.OK);
    }

    @GetMapping("/plans/duration/{months}")
    public ResponseEntity<List<SubscriptionPlanDto>> getPlansByDuration(@PathVariable Integer months) {
        List<SubscriptionPlan> plans = subscriptionService.getPlansByDuration(months);
        List<SubscriptionPlanDto> planDTOs = plans.stream()
                .map(SubscriptionPlanDto::new)
                .collect(Collectors.toList());
        return new ResponseEntity<>(planDTOs, HttpStatus.OK);
    }

    @GetMapping("/plans/trial")
    public ResponseEntity<List<SubscriptionPlanDto>> getPlansWithTrial() {
        List<SubscriptionPlan> plans = subscriptionService.getPlansWithTrial();
        List<SubscriptionPlanDto> planDTOs = plans.stream()
                .map(SubscriptionPlanDto::new)
                .collect(Collectors.toList());
        return new ResponseEntity<>(planDTOs, HttpStatus.OK);
    }

    @PostMapping("/plans/initialize")
    @PreAuthorize("hasAnyRole('ADMIN')")
    public ResponseEntity<?> initializeDefaultPlans() {
        try {
            subscriptionService.initializeDefaultPlans();
            return ResponseEntity.ok(new MessageResponse("Default plans initialized successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new MessageResponse("Error initializing default plans: " + e.getMessage()));
        }
    }

    @PostMapping("/plans")
    @PreAuthorize("hasAnyRole('ADMIN')")
    public ResponseEntity<?> createSubscriptionPlan(@RequestBody SubscriptionPlan plan) {
        try {
            SubscriptionPlan createdPlan = subscriptionService.createSubscriptionPlan(plan);
            return ResponseEntity.ok(new SubscriptionPlanDto(createdPlan));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new MessageResponse("Error creating subscription plan: " + e.getMessage()));
        }
    }

    // Vendor-only: create a local subscription record without Stripe (for free or
    // trial-only plans)
    // Matches current frontend call pattern: POST
    // /api/subscription?vendorId=2&planId=1&startDate=2025-09-23
    @PostMapping("")
    @PreAuthorize("hasAnyRole('SHOP')")
    public ResponseEntity<?> createVendorSubscriptionLocal(@RequestParam Long vendorId,
            @RequestParam Long planId,
            @RequestParam String startDate) {
        try {
            LocalDate parsed = LocalDate.parse(startDate);
            VendorSubscription vendorSubscription = subscriptionService.createVendorSubscription(
                    vendorId,
                    planId,
                    parsed);
            return ResponseEntity.ok(vendorSubscription);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new MessageResponse("Failed to create vendor subscription: " + e.getMessage()));
        }
    }

    @PostMapping("/vendor-paid")
    @PreAuthorize("hasAnyRole('SHOP')")
    public ResponseEntity<?> createPaidVendorSubscription(@RequestBody CreatePaidVendorSubscriptionRequest request) {
        // Debug authentication
        System.out.println("=== VENDOR-PAID SUBSCRIPTION DEBUG ===");
        System.out.println("Request received for vendor ID: " + request.getVendorId());
        System.out.println("Plan ID: " + request.getPlanId());
        System.out.println("Payment Method ID: " + request.getPaymentMethodId());
        System.out.println("Start Date: " + request.getStartDate());
        System.out.println("Full request object: " + request.toString());
        try {
            // Get the subscription plan to get Stripe price ID
            Optional<SubscriptionPlan> planOpt = subscriptionService.getSubscriptionPlanById(request.getPlanId());
            if (planOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new MessageResponse("Subscription plan not found"));
            }

            SubscriptionPlan plan = planOpt.get();
            if (plan.getStripePriceId() == null || plan.getStripePriceId().isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(new MessageResponse("Plan is not synced with Stripe. Please contact administrator."));
            }

            // Create or get Stripe customer
            String customerId = createOrGetStripeCustomer(request.getVendorId(), request.getPaymentMethodId());

            // Create Stripe subscription
            Subscription stripeSubscription = stripeSubscriptionService.createSubscription(
                    customerId,
                    plan.getStripePriceId());

            // Create local vendor subscription record
            VendorSubscription vendorSubscription = subscriptionService.createVendorSubscription(
                    request.getVendorId(),
                    request.getPlanId(),
                    LocalDate.parse(request.getStartDate()));

            // Update with Stripe subscription ID and customer ID
            vendorSubscription.setStripeSubscriptionId(stripeSubscription.getId());
            vendorSubscription.setPaymentMethodId(request.getPaymentMethodId());
            vendorSubscription.setStripeCustomerId(customerId);

            // Get payment intent ID from Stripe subscription if available
            try {
                if (stripeSubscription.getLatestInvoice() != null) {
                    String invoiceId = stripeSubscription.getLatestInvoice();
                    com.stripe.model.Invoice invoice = com.stripe.model.Invoice.retrieve(invoiceId);
                    if (invoice.getPaymentIntent() != null) {
                        vendorSubscription.setPaymentIntentId(invoice.getPaymentIntent());
                    }
                }
            } catch (Exception e) {
                System.out.println("DEBUG: Could not retrieve payment intent ID: " + e.getMessage());
                // Continue without payment intent ID
            }

            vendorSubscription = subscriptionService.updateVendorSubscription(vendorSubscription);

            System.out.println("DEBUG: VendorSubscription updated:");
            System.out.println("  - Stripe Subscription ID: " + vendorSubscription.getStripeSubscriptionId());
            System.out.println("  - Stripe Customer ID: " + vendorSubscription.getStripeCustomerId());
            System.out.println("  - Payment Intent ID: " + vendorSubscription.getPaymentIntentId());
            System.out.println("  - Payment Method ID: " + vendorSubscription.getPaymentMethodId());

            // Verify the payment method ID was actually saved
            Optional<VendorSubscription> savedSubscriptionOpt = subscriptionService
                    .getVendorSubscriptionById(vendorSubscription.getId());
            if (savedSubscriptionOpt.isPresent()) {
                VendorSubscription savedSubscription = savedSubscriptionOpt.get();
                System.out.println(
                        "DEBUG: Saved subscription payment method ID: " + savedSubscription.getPaymentMethodId());
                System.out.println("DEBUG: Saved subscription ID: " + savedSubscription.getId());
                System.out.println("DEBUG: Saved subscription status: " + savedSubscription.getStatus());
            } else {
                System.out.println("DEBUG: Could not retrieve saved subscription");
            }

            // Also check if there are any existing subscriptions for this vendor
            List<VendorSubscription> existingSubscriptions = subscriptionService
                    .getSubscriptionsByVendor(request.getVendorId());
            System.out.println("DEBUG: Existing subscriptions for vendor " + request.getVendorId() + ": "
                    + existingSubscriptions.size());
            for (VendorSubscription sub : existingSubscriptions) {
                System.out.println(
                        "  - Subscription ID: " + sub.getId() + ", Payment Method ID: " + sub.getPaymentMethodId());
            }

            // Create subscription payment record (detailed pattern like
            // createPaymentRecord)
            SubscriptionPayment sp = createSubscriptionPaymentRecord(vendorSubscription, stripeSubscription,
                    request.getPaymentMethodId(), plan);
            sp = subscriptionPaymentService.create(sp);

            System.out.println("DEBUG: SubscriptionPayment created with ID: " + sp.getId());
            System.out.println("DEBUG: SubscriptionPayment amount: " + sp.getAmount());

            Map<String, Object> response = new HashMap<>();
            response.put("vendorSubscription", vendorSubscription);
            response.put("stripeSubscriptionId", stripeSubscription.getId());
            response.put("status", stripeSubscription.getStatus());
            response.put("subscriptionPaymentId", sp.getId());
            response.put("subscriptionPaymentAmount", sp.getAmount());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new MessageResponse("Error creating paid vendor subscription: " + e.getMessage()));
        }
    }

    private String createOrGetStripeCustomer(Long vendorId, String paymentMethodId) throws Exception {
        try {
            // Get vendor user details
            Optional<User> vendorOpt = userRepository.findById(vendorId);
            if (vendorOpt.isEmpty()) {
                throw new Exception("Vendor not found");
            }

            User vendor = vendorOpt.get();

            // Check if vendor already has a Stripe customer ID
            if (vendor.getStripeCustomerId() != null && !vendor.getStripeCustomerId().isEmpty()) {
                return vendor.getStripeCustomerId();
            }

            // Create new Stripe customer
            com.stripe.model.Customer customer = com.stripe.model.Customer.create(
                    com.stripe.param.CustomerCreateParams.builder()
                            .setEmail(vendor.getEmail())
                            .setName(vendor.getFirstName() + " " + vendor.getLastName())
                            .setPaymentMethod(paymentMethodId)
                            .setInvoiceSettings(
                                    com.stripe.param.CustomerCreateParams.InvoiceSettings.builder()
                                            .setDefaultPaymentMethod(paymentMethodId)
                                            .build())
                            .build());

            // Store Stripe customer ID in user record
            vendor.setStripeCustomerId(customer.getId());
            userRepository.save(vendor);

            return customer.getId();
        } catch (Exception e) {
            throw new Exception("Failed to create Stripe customer: " + e.getMessage());
        }
    }

    private SubscriptionPayment createSubscriptionPaymentRecord(VendorSubscription vendorSubscription,
            Subscription stripeSubscription,
            String paymentMethodId,
            SubscriptionPlan plan) throws Exception {
        try {
            SubscriptionPayment sp = new SubscriptionPayment();
            sp.setVendorSubscription(vendorSubscription);

            // Amount and currency from Stripe subscription if available; fallback to plan
            java.math.BigDecimal amount = null;
            String currency = null;
            if (stripeSubscription.getItems() != null && !stripeSubscription.getItems().getData().isEmpty()) {
                com.stripe.model.SubscriptionItem item = stripeSubscription.getItems().getData().get(0);
                if (item.getPrice() != null) {
                    Long unitAmount = item.getPrice().getUnitAmount();
                    if (unitAmount != null) {
                        amount = java.math.BigDecimal.valueOf(unitAmount).divide(java.math.BigDecimal.valueOf(100));
                    }
                    currency = item.getPrice().getCurrency() != null ? item.getPrice().getCurrency().toUpperCase()
                            : null;
                }
            }
            if (amount == null) {
                if (plan != null && plan.getPrice() != null) {
                    amount = plan.getPrice();
                } else if (plan != null && plan.getTrialPrice() != null) {
                    amount = plan.getTrialPrice();
                } else {
                    amount = java.math.BigDecimal.ZERO;
                }
            }
            if (currency == null) {
                currency = "USD";
            }
            sp.setAmount(amount);
            sp.setCurrency(currency);

            // Status
            sp.setPaymentStatus("SUCCEEDED");

            // Stripe info
            sp.setStripeCustomerId(vendorSubscription.getStripeCustomerId());
            sp.setStripePaymentMethodId(paymentMethodId);
            sp.setPaymentIntentId(vendorSubscription.getPaymentIntentId());

            // Payment method details
            try {
                com.stripe.model.PaymentMethod paymentMethod = com.stripe.model.PaymentMethod.retrieve(paymentMethodId);
                if (paymentMethod.getCard() != null) {
                    sp.setPaymentMethodType("card");
                    sp.setPaymentMethodLast4(paymentMethod.getCard().getLast4());
                }
            } catch (Exception e) {
                System.out.println(
                        "DEBUG: Could not fetch payment method details for SubscriptionPayment: " + e.getMessage());
            }

            // Metadata JSON
            String metadata = String.format(
                    "{\"subscription_id\":\"%s\",\"vendor_id\":%d,\"plan_id\":%d,\"created_via\":\"subscription_payment\"}",
                    stripeSubscription.getId(),
                    vendorSubscription.getVendorId(),
                    vendorSubscription.getPlanId());
            sp.setMetadata(metadata);

            // Processed at now
            sp.setProcessedAt(java.time.LocalDateTime.now());
            return sp;
        } catch (Exception e) {
            throw new Exception("Failed to create subscription payment record: " + e.getMessage());
        }
    }

    // private Payment createPaymentRecord(VendorSubscription vendorSubscription,
    // Subscription stripeSubscription,
    // String paymentMethodId) throws Exception {
    // try {
    // Payment payment = new Payment();

    // // Set basic payment information
    // payment.setVendorSubscription(vendorSubscription);
    // payment.setToken(UUID.randomUUID().toString());
    // payment.setPaymentStatus(PaymentStatus.PAID);
    // payment.setProcessedAt(LocalDateTime.now());

    // // Set Stripe-related information
    // payment.setStripeCustomerId(vendorSubscription.getStripeCustomerId());
    // payment.setStripePaymentMethodId(paymentMethodId);
    // payment.setPaymentIntentId(vendorSubscription.getPaymentIntentId());

    // // Get payment amount from Stripe subscription
    // if (stripeSubscription.getItems() != null &&
    // !stripeSubscription.getItems().getData().isEmpty()) {
    // com.stripe.model.SubscriptionItem item =
    // stripeSubscription.getItems().getData().get(0);
    // if (item.getPrice() != null) {
    // Long unitAmount = item.getPrice().getUnitAmount();
    // if (unitAmount != null) {
    // // Convert from cents to dollars
    // payment.setAmount(BigDecimal.valueOf(unitAmount).divide(BigDecimal.valueOf(100)));
    // }
    // payment.setCurrency(item.getPrice().getCurrency().toUpperCase());
    // }
    // }

    // // Get payment method details from Stripe
    // try {
    // com.stripe.model.PaymentMethod paymentMethod =
    // com.stripe.model.PaymentMethod.retrieve(paymentMethodId);
    // if (paymentMethod.getCard() != null) {
    // payment.setPaymentMethodType("card");
    // payment.setPaymentMethodLast4(paymentMethod.getCard().getLast4());
    // }
    // } catch (Exception e) {
    // System.out.println("DEBUG: Could not fetch payment method details: " +
    // e.getMessage());
    // // Continue without payment method details
    // }

    // // Set metadata as simple JSON string
    // String metadata = String.format(
    // "{\"subscription_id\":\"%s\",\"vendor_id\":%d,\"plan_id\":%d,\"created_via\":\"subscription_payment\"}",
    // stripeSubscription.getId(),
    // vendorSubscription.getVendorId(),
    // vendorSubscription.getPlanId());
    // payment.setMetadata(metadata);

    // System.out.println("DEBUG: Created payment record:");
    // System.out.println(" - Amount: " + payment.getAmount());
    // System.out.println(" - Currency: " + payment.getCurrency());
    // System.out.println(" - Status: " + payment.getPaymentStatus());
    // System.out.println(" - Stripe Customer ID: " +
    // payment.getStripeCustomerId());
    // System.out.println(" - Stripe Payment Method ID: " +
    // payment.getStripePaymentMethodId());
    // System.out.println(" - Payment Method Last 4: " +
    // payment.getPaymentMethodLast4());

    // return payment;
    // } catch (Exception e) {
    // throw new Exception("Failed to create payment record: " + e.getMessage());
    // }
    // }

    @PostMapping("/subscribe")
    @PreAuthorize("hasAnyRole('SHOP')")
    public ResponseEntity<?> createSubscription(@RequestBody CreateSubscriptionRequest request) {
        try {
            Subscription subscription = stripeSubscriptionService.createSubscription(
                    request.getCustomerId(),
                    request.getPriceId());

            // Create local subscription record
            VendorSubscription vendorSubscription = subscriptionService.createVendorSubscription(
                    request.getVendorId(),
                    request.getPlanId(),
                    LocalDate.now() // Use current date as start date
            );

            Map<String, String> response = new HashMap<>();
            response.put("subscriptionId", subscription.getId());
            response.put("status", subscription.getStatus());
            response.put("vendorSubscriptionId", vendorSubscription.getId().toString());

            return ResponseEntity.ok(response);
        } catch (StripeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new MessageResponse("Stripe error: " + e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new MessageResponse("Server error: " + e.getMessage()));
        }
    }

    @PostMapping("/subscribe-trial")
    @PreAuthorize("hasAnyRole('SHOP')")
    public ResponseEntity<?> createSubscriptionWithTrial(@RequestBody CreateSubscriptionWithTrialRequest request) {
        try {
            Subscription subscription = stripeSubscriptionService.createSubscriptionWithTrial(
                    request.getCustomerId(),
                    request.getPriceId(),
                    request.getTrialPeriodDays());

            // Create local subscription record
            VendorSubscription vendorSubscription = subscriptionService.createVendorSubscription(
                    request.getVendorId(),
                    request.getPlanId(),
                    LocalDate.now() // Use current date as start date
            );

            Map<String, String> response = new HashMap<>();
            response.put("subscriptionId", subscription.getId());
            response.put("status", subscription.getStatus());
            response.put("trialEnd", subscription.getTrialEnd().toString());
            response.put("vendorSubscriptionId", vendorSubscription.getId().toString());

            return ResponseEntity.ok(response);
        } catch (StripeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new MessageResponse("Stripe error: " + e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new MessageResponse("Server error: " + e.getMessage()));
        }
    }

    @PostMapping("/{id}/cancel")
    @PreAuthorize("hasAnyRole('SHOP', 'ADMIN')")
    public ResponseEntity<?> cancelSubscription(@PathVariable String id) {
        try {
            Subscription subscription = stripeSubscriptionService.cancelSubscription(id);

            // Update local subscription record
            // Note: We need to find the local subscription by Stripe ID
            // This would require a method in the service to find by Stripe ID
            // For now, we'll just return the Stripe response

            Map<String, String> response = new HashMap<>();
            response.put("subscriptionId", subscription.getId());
            response.put("status", subscription.getStatus());

            return ResponseEntity.ok(response);
        } catch (StripeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new MessageResponse("Stripe error: " + e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new MessageResponse("Server error: " + e.getMessage()));
        }
    }

    @PostMapping("/{id}/cancel-at-period-end")
    @PreAuthorize("hasAnyRole('SHOP', 'ADMIN')")
    public ResponseEntity<?> cancelSubscriptionAtPeriodEnd(@PathVariable String id) {
        try {
            Subscription subscription = stripeSubscriptionService.cancelSubscriptionAtPeriodEnd(id);

            // Update local subscription record
            // Note: We need to find the local subscription by Stripe ID
            // This would require a method in the service to find by Stripe ID
            // For now, we'll just return the Stripe response

            Map<String, String> response = new HashMap<>();
            response.put("subscriptionId", subscription.getId());
            response.put("status", subscription.getStatus());
            response.put("cancelAtPeriodEnd", String.valueOf(subscription.getCancelAtPeriodEnd()));
            response.put("currentPeriodEnd", String.valueOf(subscription.getCurrentPeriodEnd()));

            return ResponseEntity.ok(response);
        } catch (StripeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new MessageResponse("Stripe error: " + e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new MessageResponse("Server error: " + e.getMessage()));
        }
    }

    @PostMapping("/{id}/reactivate")
    @PreAuthorize("hasAnyRole('SHOP', 'ADMIN')")
    public ResponseEntity<?> reactivateSubscription(@PathVariable String id) {
        try {
            Subscription subscription = stripeSubscriptionService.reactivateSubscription(id);

            // Update local subscription record
            // Note: We need to find the local subscription by Stripe ID
            // This would require a method in the service to find by Stripe ID
            // For now, we'll just return the Stripe response

            Map<String, String> response = new HashMap<>();
            response.put("subscriptionId", subscription.getId());
            response.put("status", subscription.getStatus());
            response.put("cancelAtPeriodEnd", String.valueOf(subscription.getCancelAtPeriodEnd()));

            return ResponseEntity.ok(response);
        } catch (StripeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new MessageResponse("Stripe error: " + e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new MessageResponse("Server error: " + e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getVendorSubscriptionById(@PathVariable Long id) {
        Optional<VendorSubscription> subscription = subscriptionService.getVendorSubscriptionById(id);
        if (subscription.isPresent()) {
            return ResponseEntity.ok(subscription.get());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new MessageResponse("Subscription not found"));
        }
    }

    @GetMapping("/vendor/{vendorId}")
    public ResponseEntity<List<VendorSubscriptionDto>> getSubscriptionsByVendor(@PathVariable Long vendorId) {
        List<VendorSubscription> subscriptions = subscriptionService.getSubscriptionsByVendor(vendorId);
        List<VendorSubscriptionDto> subscriptionDtos = subscriptions.stream()
                .map(VendorSubscriptionDto::new)
                .collect(Collectors.toList());
        return new ResponseEntity<>(subscriptionDtos, HttpStatus.OK);
    }

    @GetMapping("/plan/{planId}")
    public ResponseEntity<List<VendorSubscriptionDto>> getSubscriptionsByPlan(@PathVariable Long planId) {
        List<VendorSubscription> subscriptions = subscriptionService.getSubscriptionsByPlan(planId);
        List<VendorSubscriptionDto> subscriptionDtos = subscriptions.stream()
                .map(VendorSubscriptionDto::new)
                .collect(Collectors.toList());
        return new ResponseEntity<>(subscriptionDtos, HttpStatus.OK);
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<VendorSubscriptionDto>> getSubscriptionsByStatus(
            @PathVariable SubscriptionStatus status) {
        List<VendorSubscription> subscriptions = subscriptionService.getSubscriptionsByStatus(status);
        List<VendorSubscriptionDto> subscriptionDtos = subscriptions.stream()
                .map(VendorSubscriptionDto::new)
                .collect(Collectors.toList());
        return new ResponseEntity<>(subscriptionDtos, HttpStatus.OK);
    }

    @GetMapping("/vendor/{vendorId}/active")
    public ResponseEntity<?> getActiveSubscriptionByVendor(@PathVariable Long vendorId) {
        Optional<VendorSubscription> subscription = subscriptionService.getActiveSubscriptionByVendor(vendorId);
        if (subscription.isPresent()) {
            return ResponseEntity.ok(new VendorSubscriptionDto(subscription.get()));
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new MessageResponse("No active subscription found"));
        }
    }

    @GetMapping("/vendor/{vendorId}/current")
    @PreAuthorize("hasAnyRole('SHOP')")
    public ResponseEntity<?> getCurrentActivePlan(@PathVariable Long vendorId) {
        Optional<VendorSubscription> subscription = subscriptionService.getCurrentActivePlan(vendorId);
        if (subscription.isPresent()) {
            return ResponseEntity.ok(new VendorSubscriptionDto(subscription.get()));
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new MessageResponse("No current active plan found"));
        }
    }

    // Admin endpoints
    @GetMapping("/admin/subscriptions/stats")
    @PreAuthorize("hasAnyRole('ADMIN')")
    public ResponseEntity<?> getAdminStats() {
        try {
            Map<String, Object> stats = new HashMap<>();
            stats.put("activeSubscriptions", subscriptionService.getActiveSubscriptionsCount());
            stats.put("monthlyRevenue", subscriptionService.getMonthlyRevenue());
            stats.put("activePlans", subscriptionService.getActivePlansCount());
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new MessageResponse("Error loading admin stats: " + e.getMessage()));
        }
    }

    @GetMapping("/admin/subscriptions")
    @PreAuthorize("hasAnyRole('ADMIN')")
    public ResponseEntity<?> getAllSubscriptions(@RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int limit) {
        try {
            List<VendorSubscription> subscriptions = subscriptionService.getAllSubscriptions(page, limit);
            long total = subscriptionService.getTotalSubscriptionsCount();
            int totalPages = (int) Math.ceil((double) total / limit);

            Map<String, Object> response = new HashMap<>();
            response.put("subscriptions", subscriptions);
            response.put("total", total);
            response.put("page", page);
            response.put("totalPages", totalPages);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new MessageResponse("Error loading subscriptions: " + e.getMessage()));
        }
    }

    @GetMapping("/admin/subscriptions/plans")
    @PreAuthorize("hasAnyRole('ADMIN')")
    public ResponseEntity<?> getSubscriptionPlans() {
        try {
            List<SubscriptionPlan> plans = subscriptionService.getAllSubscriptionPlans();
            return ResponseEntity.ok(plans);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new MessageResponse("Error loading subscription plans: " + e.getMessage()));
        }
    }

    @GetMapping("/vendor/subscriptions/plans")
    @PreAuthorize("hasAnyRole('SHOP')")
    public ResponseEntity<?> getVendorSubscriptionPlans() {
        try {
            List<SubscriptionPlan> plans = subscriptionService.getAllSubscriptionPlans();
            return ResponseEntity.ok(plans);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new MessageResponse("Error loading subscription plans: " + e.getMessage()));
        }
    }

    @GetMapping("/admin/subscriptions/analytics/revenue")
    @PreAuthorize("hasAnyRole('ADMIN')")
    public ResponseEntity<?> getRevenueAnalytics(@RequestParam(defaultValue = "monthly") String period) {
        try {
            Map<String, Object> analytics = subscriptionService.getRevenueAnalytics(period);
            return ResponseEntity.ok(analytics);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new MessageResponse("Error loading revenue analytics: " + e.getMessage()));
        }
    }

    @GetMapping("/admin/subscriptions/analytics/plans")
    @PreAuthorize("hasAnyRole('ADMIN')")
    public ResponseEntity<?> getPlanAnalytics() {
        try {
            List<Map<String, Object>> analytics = subscriptionService.getPlanAnalytics();
            return ResponseEntity.ok(analytics);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new MessageResponse("Error loading plan analytics: " + e.getMessage()));
        }
    }

    @GetMapping("/admin/subscriptions/analytics/growth")
    @PreAuthorize("hasAnyRole('ADMIN')")
    public ResponseEntity<?> getSubscriptionGrowth(@RequestParam(defaultValue = "monthly") String period) {
        try {
            Map<String, Object> growth = subscriptionService.getSubscriptionGrowth(period);
            return ResponseEntity.ok(growth);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new MessageResponse("Error loading subscription growth: " + e.getMessage()));
        }
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateSubscriptionStatus(@PathVariable Long id,
            @RequestParam SubscriptionStatus status) {
        try {
            VendorSubscription subscription = subscriptionService.updateSubscriptionStatus(id, status);
            return ResponseEntity.ok(subscription);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new MessageResponse("Server error: " + e.getMessage()));
        }
    }

    // Request/Response classes

    public static class CreateProductRequest {
        private String name;
        private String description;

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
    }

    public static class CreatePriceRequest {
        private String productId;
        private Long amount;
        private String currency;
        private String interval;
        private Integer intervalCount;

        public String getProductId() {
            return productId;
        }

        public void setProductId(String productId) {
            this.productId = productId;
        }

        public Long getAmount() {
            return amount;
        }

        public void setAmount(Long amount) {
            this.amount = amount;
        }

        public String getCurrency() {
            return currency;
        }

        public void setCurrency(String currency) {
            this.currency = currency;
        }

        public String getInterval() {
            return interval;
        }

        public void setInterval(String interval) {
            this.interval = interval;
        }

        public Integer getIntervalCount() {
            return intervalCount;
        }

        public void setIntervalCount(Integer intervalCount) {
            this.intervalCount = intervalCount;
        }
    }

    public static class CreateSubscriptionRequest {
        private String customerId;
        private String priceId;
        private Long vendorId;
        private Long planId;

        public String getCustomerId() {
            return customerId;
        }

        public void setCustomerId(String customerId) {
            this.customerId = customerId;
        }

        public String getPriceId() {
            return priceId;
        }

        public void setPriceId(String priceId) {
            this.priceId = priceId;
        }

        public Long getVendorId() {
            return vendorId;
        }

        public void setVendorId(Long vendorId) {
            this.vendorId = vendorId;
        }

        public Long getPlanId() {
            return planId;
        }

        public void setPlanId(Long planId) {
            this.planId = planId;
        }
    }

    public static class CreateSubscriptionWithTrialRequest {
        private String customerId;
        private String priceId;
        private Integer trialPeriodDays;
        private Long vendorId;
        private Long planId;

        public String getCustomerId() {
            return customerId;
        }

        public void setCustomerId(String customerId) {
            this.customerId = customerId;
        }

        public String getPriceId() {
            return priceId;
        }

        public void setPriceId(String priceId) {
            this.priceId = priceId;
        }

        public Integer getTrialPeriodDays() {
            return trialPeriodDays;
        }

        public void setTrialPeriodDays(Integer trialPeriodDays) {
            this.trialPeriodDays = trialPeriodDays;
        }

        public Long getVendorId() {
            return vendorId;
        }

        public void setVendorId(Long vendorId) {
            this.vendorId = vendorId;
        }

        public Long getPlanId() {
            return planId;
        }

        public void setPlanId(Long planId) {
            this.planId = planId;
        }
    }

    public static class MessageResponse {
        private String message;

        public MessageResponse(String message) {
            this.message = message;
        }

        public String getMessage() {
            return message;
        }

        public void setMessage(String message) {
            this.message = message;
        }
    }

    // Request class for paid vendor subscriptions
    public static class CreatePaidVendorSubscriptionRequest {
        private Long vendorId;
        private Long planId;
        private String paymentMethodId;
        private String startDate;

        public Long getVendorId() {
            return vendorId;
        }

        public void setVendorId(Long vendorId) {
            this.vendorId = vendorId;
        }

        public Long getPlanId() {
            return planId;
        }

        public void setPlanId(Long planId) {
            this.planId = planId;
        }

        public String getPaymentMethodId() {
            return paymentMethodId;
        }

        public void setPaymentMethodId(String paymentMethodId) {
            this.paymentMethodId = paymentMethodId;
        }

        public String getStartDate() {
            return startDate;
        }

        public void setStartDate(String startDate) {
            this.startDate = startDate;
        }

        @Override
        public String toString() {
            return "CreatePaidVendorSubscriptionRequest{" +
                    "vendorId=" + vendorId +
                    ", planId=" + planId +
                    ", paymentMethodId='" + paymentMethodId + '\'' +
                    ", startDate='" + startDate + '\'' +
                    '}';
        }
    }

    @GetMapping("/test-auth")
    public ResponseEntity<?> testAuth() {
        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Auth test endpoint working",
                "timestamp", System.currentTimeMillis()));
    }

    @GetMapping("/test-payment-method-id")
    @PreAuthorize("hasAnyRole('ADMIN')")
    public ResponseEntity<?> testPaymentMethodId() {
        try {
            // Get all vendor subscriptions and check payment method IDs
            List<VendorSubscription> allSubscriptions = subscriptionService.getAllSubscriptions(0, 1000);
            Map<String, Object> result = new HashMap<>();
            result.put("totalSubscriptions", allSubscriptions.size());

            List<Map<String, Object>> subscriptionDetails = new ArrayList<>();
            for (VendorSubscription sub : allSubscriptions) {
                Map<String, Object> details = new HashMap<>();
                details.put("id", sub.getId());
                details.put("vendorId", sub.getVendor().getId());
                details.put("planId", sub.getPlan().getId());
                details.put("status", sub.getStatus());
                details.put("paymentMethodId", sub.getPaymentMethodId());
                details.put("stripeSubscriptionId", sub.getStripeSubscriptionId());
                details.put("stripeCustomerId", sub.getStripeCustomerId());
                details.put("paymentIntentId", sub.getPaymentIntentId());
                subscriptionDetails.add(details);
            }
            result.put("subscriptions", subscriptionDetails);

            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to test payment method IDs: " + e.getMessage()));
        }
    }

    @GetMapping("/test-subscriptions")
    @PreAuthorize("hasAnyRole('ADMIN')")
    public ResponseEntity<?> testSubscriptions() {
        try {
            List<VendorSubscription> subscriptions = subscriptionService.getAllSubscriptions(1, 10);
            long total = subscriptionService.getTotalSubscriptionsCount();

            System.out.println("DEBUG: Total subscriptions in database: " + total);
            System.out.println("DEBUG: Fetched subscriptions count: " + subscriptions.size());

            if (!subscriptions.isEmpty()) {
                VendorSubscription first = subscriptions.get(0);
                System.out.println("DEBUG: First subscription ID: " + first.getId());
                System.out.println("DEBUG: First subscription vendor: "
                        + (first.getVendor() != null ? first.getVendor().getFirstName() : "NULL"));
                System.out.println("DEBUG: First subscription plan: "
                        + (first.getPlan() != null ? first.getPlan().getName() : "NULL"));
            }

            Map<String, Object> response = new HashMap<>();
            response.put("subscriptions", subscriptions);
            response.put("total", total);
            response.put("page", 1);
            response.put("totalPages", 1);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.out.println("DEBUG: Error in test endpoint: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new MessageResponse("Error in test endpoint: " + e.getMessage()));
        }
    }

    @GetMapping("/test-stripe-endpoint")
    @PreAuthorize("hasAnyRole('ADMIN')")
    public ResponseEntity<?> testStripeEndpoint() {
        System.out.println("DEBUG: Test Stripe endpoint called");
        return ResponseEntity.ok(Map.of(
                "message", "Stripe endpoint is working",
                "timestamp", System.currentTimeMillis()));
    }

    @GetMapping("/payments/subscription/{subscriptionId}")
    @PreAuthorize("hasAnyRole('ADMIN')")
    public ResponseEntity<?> getPaymentsBySubscription(@PathVariable Long subscriptionId) {
        try {
            System.out.println("DEBUG: Fetching payments for subscription: " + subscriptionId);

            List<SubscriptionPayment> payments = subscriptionPaymentRepository
                    .findByVendorSubscriptionId(subscriptionId);

            System.out.println("DEBUG: Found " + payments.size() + " payments for subscription " + subscriptionId);

            return ResponseEntity.ok(payments);
        } catch (Exception e) {
            System.out.println("DEBUG: Error fetching payments: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new MessageResponse("Error fetching payments: " + e.getMessage()));
        }
    }

    @GetMapping("/payment-details/subscription/{subscriptionId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'SHOP')")
    public ResponseEntity<?> getPaymentDetailsBySubscription(@PathVariable Long subscriptionId) {
        try {
            System.out.println("DEBUG: Fetching payment details for subscription: " + subscriptionId);

            List<SubscriptionPayment> payments = subscriptionPaymentRepository
                    .findByVendorSubscriptionId(subscriptionId);

            if (payments.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new MessageResponse("No payment records found for this subscription"));
            }

            // Get the most recent payment
            SubscriptionPayment latestPayment = payments.stream()
                    .max((p1, p2) -> p1.getCreatedAt().compareTo(p2.getCreatedAt()))
                    .orElse(payments.get(0));

            // Build payment details response
            Map<String, Object> paymentDetails = new HashMap<>();
            paymentDetails.put("id", latestPayment.getId());
            paymentDetails.put("amount", latestPayment.getAmount());
            paymentDetails.put("currency", latestPayment.getCurrency());
            paymentDetails.put("status", latestPayment.getPaymentStatus().toString());
            paymentDetails.put("paymentMethodType", latestPayment.getPaymentMethodType());
            paymentDetails.put("paymentMethodLast4", latestPayment.getPaymentMethodLast4());
            paymentDetails.put("stripeCustomerId", latestPayment.getStripeCustomerId());
            paymentDetails.put("stripePaymentMethodId", latestPayment.getStripePaymentMethodId());
            paymentDetails.put("paymentIntentId", latestPayment.getPaymentIntentId());
            paymentDetails.put("processedAt", latestPayment.getProcessedAt());
            paymentDetails.put("createdAt", latestPayment.getCreatedAt());
            paymentDetails.put("metadata", latestPayment.getMetadata());

            // Add payment method details if available
            if (latestPayment.getPaymentMethodLast4() != null) {
                Map<String, Object> paymentMethod = new HashMap<>();
                paymentMethod.put("type", latestPayment.getPaymentMethodType());
                paymentMethod.put("last4", latestPayment.getPaymentMethodLast4());
                paymentDetails.put("paymentMethod", paymentMethod);
            }

            System.out.println("DEBUG: Payment details for subscription " + subscriptionId + ":");
            System.out.println("  - Amount: " + latestPayment.getAmount());
            System.out.println("  - Status: " + latestPayment.getPaymentStatus());
            System.out.println("  - Stripe Customer ID: " + latestPayment.getStripeCustomerId());
            System.out.println("  - Payment Method Last 4: " + latestPayment.getPaymentMethodLast4());

            return ResponseEntity.ok(paymentDetails);
        } catch (Exception e) {
            System.out.println("DEBUG: Error fetching payment details: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new MessageResponse("Error fetching payment details: " + e.getMessage()));
        }
    }

    @GetMapping("/stripe-subscription/{subscriptionId}")
    @PreAuthorize("hasAnyRole('ADMIN')")
    public ResponseEntity<?> getStripeSubscriptionDetails(@PathVariable String subscriptionId) {
        try {
            System.out.println("DEBUG: Stripe subscription endpoint called for: " + subscriptionId);
            System.out.println("DEBUG: Endpoint URL: /api/subscription/stripe-subscription/" + subscriptionId);

            // Get subscription from Stripe
            com.stripe.model.Subscription stripeSubscription = stripeSubscriptionService
                    .getSubscription(subscriptionId);

            if (stripeSubscription == null) {
                System.out.println("DEBUG: Stripe subscription not found: " + subscriptionId);
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new MessageResponse("Stripe subscription not found"));
            }

            // Build response with subscription details
            Map<String, Object> response = new HashMap<>();
            response.put("id", stripeSubscription.getId());
            response.put("status", stripeSubscription.getStatus());
            response.put("currentPeriodStart", stripeSubscription.getCurrentPeriodStart());
            response.put("currentPeriodEnd", stripeSubscription.getCurrentPeriodEnd());
            response.put("amount", stripeSubscription.getItems().getData().get(0).getPrice().getUnitAmount());
            response.put("currency", stripeSubscription.getItems().getData().get(0).getPrice().getCurrency());
            response.put("interval",
                    stripeSubscription.getItems().getData().get(0).getPrice().getRecurring().getInterval());

            // Get payment method details if available
            if (stripeSubscription.getDefaultPaymentMethod() != null) {
                try {
                    com.stripe.model.PaymentMethod paymentMethod = com.stripe.model.PaymentMethod.retrieve(
                            stripeSubscription.getDefaultPaymentMethod());

                    Map<String, Object> paymentMethodDetails = new HashMap<>();
                    if (paymentMethod.getCard() != null) {
                        paymentMethodDetails.put("brand", paymentMethod.getCard().getBrand());
                        paymentMethodDetails.put("last4", paymentMethod.getCard().getLast4());
                        paymentMethodDetails.put("expMonth", paymentMethod.getCard().getExpMonth());
                        paymentMethodDetails.put("expYear", paymentMethod.getCard().getExpYear());
                    }
                    response.put("paymentMethod", paymentMethodDetails);
                } catch (Exception e) {
                    System.out.println("DEBUG: Could not fetch payment method details: " + e.getMessage());
                    response.put("paymentMethod", null);
                }
            }

            System.out.println("DEBUG: Stripe subscription details fetched successfully");
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            System.out.println("DEBUG: Error fetching Stripe subscription details: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new MessageResponse("Error fetching Stripe subscription details: " + e.getMessage()));
        }
    }

    @GetMapping("/analytics/test-auth")
    @PreAuthorize("hasAnyRole('ADMIN', 'SHOP')")
    public ResponseEntity<?> testAnalyticsAuth() {
        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Analytics auth test endpoint working",
                "timestamp", System.currentTimeMillis()));
    }

    @GetMapping("/test-stripe")
    @PreAuthorize("hasAnyRole('ADMIN')")
    public ResponseEntity<?> testStripeConnection() {
        try {
            // Test basic Stripe connectivity
            com.stripe.model.Customer.list(com.stripe.param.CustomerListParams.builder().setLimit(1L).build());
            return ResponseEntity.ok(Map.of("success", true, "message", "Stripe connection successful"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "error", e.getMessage()));
        }
    }

    @GetMapping("/check-stripe-subscription/{subscriptionId}")
    // PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> checkStripeSubscription(@PathVariable String subscriptionId) {
        try {
            Subscription subscription = stripeSubscriptionService.getSubscription(subscriptionId);
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "subscription", Map.of(
                            "id", subscription.getId(),
                            "status", subscription.getStatus(),
                            "canceledAt", subscription.getCanceledAt(),
                            "cancelAtPeriodEnd", subscription.getCancelAtPeriodEnd(),
                            "currentPeriodEnd", subscription.getCurrentPeriodEnd())));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "error", e.getMessage()));
        }
    }

    @GetMapping("/plans/{planId}/subscriber-count")
    @PreAuthorize("hasAnyRole('ADMIN', 'SHOP')")
    public ResponseEntity<?> getSubscriberCountForPlan(@PathVariable Long planId) {
        try {
            Optional<SubscriptionPlan> planOpt = subscriptionService.getSubscriptionPlanById(planId);
            if (planOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            SubscriptionPlan plan = planOpt.get();
            Long subscriberCount = subscriptionService.getSubscriberCountForPlan(planId);

            return ResponseEntity.ok(Map.of(
                    "planId", planId,
                    "planName", plan.getName(),
                    "subscriberCount", subscriberCount));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "error", e.getMessage()));
        }
    }

    @GetMapping("/plans/subscriber-counts")
    @PreAuthorize("hasAnyRole('ADMIN', 'SHOP')")
    public ResponseEntity<?> getAllSubscriberCounts() {
        try {
            Map<Long, Long> subscriberCounts = subscriptionService.getAllSubscriberCounts();
            return ResponseEntity.ok(Map.of(
                    "subscriberCounts", subscriberCounts));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "error", e.getMessage()));
        }
    }

    @PutMapping("/{id}/cancel")
    @PreAuthorize("hasAnyRole('ADMIN', 'SHOP')")
    public ResponseEntity<?> cancelVendorSubscription(@PathVariable Long id) {
        try {
            // Load local subscription to see if there's a Stripe subscription to cancel
            VendorSubscription existing = subscriptionService.getVendorSubscriptionById(id)
                    .orElseThrow(() -> new RuntimeException("Vendor subscription not found with id: " + id));

            String stripeStatus = null;
            System.out.println("Local subscription details:");
            System.out.println("- ID: " + existing.getId());
            System.out.println("- Stripe Subscription ID: " + existing.getStripeSubscriptionId());
            System.out.println("- Status: " + existing.getStatus());

            if (existing.getStripeSubscriptionId() != null && !existing.getStripeSubscriptionId().isEmpty()) {
                try {
                    System.out
                            .println("Attempting to cancel Stripe subscription: " + existing.getStripeSubscriptionId());

                    // First, let's try to retrieve the subscription to see if it exists
                    try {
                        Subscription retrievedSub = stripeSubscriptionService
                                .getSubscription(existing.getStripeSubscriptionId());
                        System.out.println("Retrieved Stripe subscription - Status: " + retrievedSub.getStatus());
                        System.out.println("Cancel at period end: " + retrievedSub.getCancelAtPeriodEnd());
                    } catch (Exception e) {
                        System.err.println("Failed to retrieve Stripe subscription: " + e.getMessage());
                    }

                    // Now attempt to cancel
                    Subscription stripeSub = stripeSubscriptionService
                            .cancelSubscription(existing.getStripeSubscriptionId());
                    stripeStatus = stripeSub.getStatus();
                    System.out.println("Stripe subscription cancelled successfully. Status: " + stripeStatus);
                    System.out.println("Stripe subscription details after cancel:");
                    System.out.println("- ID: " + stripeSub.getId());
                    System.out.println("- Status: " + stripeSub.getStatus());
                    System.out.println("- Canceled at: " + stripeSub.getCanceledAt());
                    System.out.println("- Cancel at period end: " + stripeSub.getCancelAtPeriodEnd());
                    System.out.println("- Current period end: " + stripeSub.getCurrentPeriodEnd());

                    // Let's also retrieve it again to double-check
                    try {
                        Subscription doubleCheck = stripeSubscriptionService
                                .getSubscription(existing.getStripeSubscriptionId());
                        System.out.println("Double-check retrieval - Status: " + doubleCheck.getStatus());
                        System.out.println("Double-check - Canceled at: " + doubleCheck.getCanceledAt());
                    } catch (Exception e) {
                        System.err.println("Failed to double-check subscription: " + e.getMessage());
                    }
                } catch (Exception se) {
                    // If Stripe cancel fails, we still proceed to mark local as cancelled but
                    // report the error
                    stripeStatus = "stripe_cancel_failed: " + se.getMessage();
                    System.err.println("Failed to cancel Stripe subscription: " + se.getMessage());
                    se.printStackTrace();
                }
            } else {
                System.out.println("No Stripe subscription ID found for local subscription: " + id);
            }

            VendorSubscription subscription = subscriptionService.cancelVendorSubscription(id);
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Subscription cancelled immediately",
                    "subscription", subscription,
                    "stripeStatus", stripeStatus));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "error", e.getMessage()));
        }
    }

    // ==================== ANALYTICS ENDPOINTS ====================

    @GetMapping("/analytics/dashboard")
    @PreAuthorize("hasAnyRole('ADMIN', 'SHOP')")
    public ResponseEntity<?> getAnalyticsDashboard() {
        try {
            Map<String, Object> dashboard = new HashMap<>();

            // Basic metrics
            dashboard.put("totalSubscriptions", subscriptionService.getActiveSubscriptionsCount());
            dashboard.put("totalRevenue", subscriptionService.getMonthlyRevenue());
            dashboard.put("activePlans", subscriptionService.getActivePlansCount());

            // Revenue analytics
            dashboard.put("revenueAnalytics", subscriptionService.getRevenueAnalytics("monthly"));

            // Plan analytics
            dashboard.put("planAnalytics", subscriptionService.getPlanAnalytics());

            // Growth analytics
            dashboard.put("growthAnalytics", subscriptionService.getSubscriptionGrowth("monthly"));

            // Recent subscriptions (last 30 days)
            List<VendorSubscription> recentSubscriptions = subscriptionService.getAllSubscriptions(1, 10);
            dashboard.put("recentSubscriptions", recentSubscriptions);

            return ResponseEntity.ok(dashboard);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new MessageResponse("Error loading analytics dashboard: " + e.getMessage()));
        }
    }

    @GetMapping("/analytics/revenue/trends")
    @PreAuthorize("hasAnyRole('ADMIN', 'SHOP')")
    public ResponseEntity<?> getRevenueTrends(@RequestParam(defaultValue = "12") int months) {
        try {
            Map<String, Object> trends = subscriptionService.getRevenueTrends(months);
            return ResponseEntity.ok(trends);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new MessageResponse("Error loading revenue trends: " + e.getMessage()));
        }
    }

    @GetMapping("/analytics/subscriptions/trends")
    @PreAuthorize("hasAnyRole('ADMIN', 'SHOP')")
    public ResponseEntity<?> getSubscriptionTrends(@RequestParam(defaultValue = "12") int months) {
        try {
            Map<String, Object> trends = subscriptionService.getSubscriptionTrends(months);
            return ResponseEntity.ok(trends);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new MessageResponse("Error loading subscription trends: " + e.getMessage()));
        }
    }

    @GetMapping("/analytics/plans/performance")
    @PreAuthorize("hasAnyRole('ADMIN', 'SHOP')")
    public ResponseEntity<?> getPlanPerformance() {
        try {
            Map<String, Object> performance = subscriptionService.getPlanPerformance();
            return ResponseEntity.ok(performance);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new MessageResponse("Error loading plan performance: " + e.getMessage()));
        }
    }

    @GetMapping("/analytics/vendors/insights")
    @PreAuthorize("hasAnyRole('ADMIN', 'SHOP')")
    public ResponseEntity<?> getVendorInsights() {
        try {
            Map<String, Object> insights = subscriptionService.getVendorInsights();
            return ResponseEntity.ok(insights);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new MessageResponse("Error loading vendor insights: " + e.getMessage()));
        }
    }

    @GetMapping("/analytics/churn/analysis")
    @PreAuthorize("hasAnyRole('ADMIN', 'SHOP')")
    public ResponseEntity<?> getChurnAnalysis(@RequestParam(defaultValue = "6") int months) {
        try {
            Map<String, Object> churn = subscriptionService.getChurnAnalysis(months);
            return ResponseEntity.ok(churn);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new MessageResponse("Error loading churn analysis: " + e.getMessage()));
        }
    }

    @GetMapping("/analytics/conversion/funnel")
    @PreAuthorize("hasAnyRole('ADMIN', 'SHOP')")
    public ResponseEntity<?> getConversionFunnel() {
        try {
            Map<String, Object> funnel = subscriptionService.getConversionFunnel();
            return ResponseEntity.ok(funnel);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new MessageResponse("Error loading conversion funnel: " + e.getMessage()));
        }
    }
}