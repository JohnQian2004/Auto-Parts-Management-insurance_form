package com.xoftex.parthub.controllers;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.xoftex.parthub.dto.SubscriptionPaymentDto;
import com.xoftex.parthub.models.SubscriptionPayment;
import com.xoftex.parthub.models.VendorSubscription;
import com.xoftex.parthub.repository.VendorSubscriptionRepository;
import com.xoftex.parthub.services.SubscriptionPaymentService;

@RestController
@RequestMapping("/api/subscription/payments")
public class SubscriptionPaymentController {

    private final SubscriptionPaymentService subscriptionPaymentService;
    private final VendorSubscriptionRepository vendorSubscriptionRepository;

    public SubscriptionPaymentController(SubscriptionPaymentService subscriptionPaymentService,
            VendorSubscriptionRepository vendorSubscriptionRepository) {
        this.subscriptionPaymentService = subscriptionPaymentService;
        this.vendorSubscriptionRepository = vendorSubscriptionRepository;
    }

    @GetMapping("/by-subscription/{vendorSubscriptionId}")
    @PreAuthorize("hasAnyRole('ADMIN','SHOP')")
    public ResponseEntity<?> getBySubscription(@PathVariable Long vendorSubscriptionId) {
        List<SubscriptionPaymentDto> list = subscriptionPaymentService
                .findByVendorSubscriptionId(vendorSubscriptionId)
                .stream().map(SubscriptionPaymentDto::fromEntity)
                .collect(Collectors.toList());
        return ResponseEntity.ok(list);
    }

    @GetMapping("/latest-by-subscription/{vendorSubscriptionId}")
    @PreAuthorize("hasAnyRole('ADMIN','SHOP')")
    public ResponseEntity<?> getLatestBySubscription(@PathVariable Long vendorSubscriptionId) {
        Optional<SubscriptionPaymentDto> latest = subscriptionPaymentService
                .findLatestByVendorSubscriptionId(vendorSubscriptionId)
                .map(SubscriptionPaymentDto::fromEntity);
        return latest.<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.noContent().build());
    }

    // Clone of PaymentController: GET /api/payments/by-intent/{paymentIntentId}
    @GetMapping("/by-intent/{paymentIntentId}")
    @PreAuthorize("hasAnyRole('ADMIN','SHOP')")
    public ResponseEntity<?> getByPaymentIntentId(@PathVariable String paymentIntentId) {
        Optional<SubscriptionPayment> sp = subscriptionPaymentService.findByPaymentIntentId(paymentIntentId);
        return sp.<ResponseEntity<?>>map(p -> ResponseEntity.ok(SubscriptionPaymentDto.fromEntity(p)))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping("/create")
    @PreAuthorize("hasAnyRole('ADMIN','SHOP')")
    public ResponseEntity<?> create(@RequestBody SubscriptionPaymentDto payload) {
        if (payload == null || payload.getVendorSubscriptionId() == null) {
            return ResponseEntity.badRequest().body("vendorSubscriptionId is required");
        }
        Optional<VendorSubscription> subOpt = vendorSubscriptionRepository.findById(payload.getVendorSubscriptionId());
        if (subOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Vendor subscription not found");
        }
        VendorSubscription sub = subOpt.get();
        SubscriptionPayment p = new SubscriptionPayment();
        p.setVendorSubscription(sub);
        p.setAmount(payload.getAmount());
        p.setCurrency(payload.getCurrency());
        p.setPaymentStatus(payload.getPaymentStatus());
        p.setStripeCustomerId(payload.getStripeCustomerId());
        p.setStripePaymentMethodId(payload.getStripePaymentMethodId());
        p.setPaymentIntentId(payload.getPaymentIntentId());
        p.setPaymentMethodType(payload.getPaymentMethodType());
        p.setPaymentMethodLast4(payload.getPaymentMethodLast4());
        p.setProcessedAt(payload.getProcessedAt());
        p.setMetadata(payload.getMetadata());
        SubscriptionPayment saved = subscriptionPaymentService.create(p);
        return ResponseEntity.ok(SubscriptionPaymentDto.fromEntity(saved));
    }
}
