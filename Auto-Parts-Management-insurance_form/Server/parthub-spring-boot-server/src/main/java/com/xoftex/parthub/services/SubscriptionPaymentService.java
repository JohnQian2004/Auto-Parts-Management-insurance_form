package com.xoftex.parthub.services;

import java.util.List;
import java.util.Optional;

//import com.xoftex.parthub.models.Payment;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.xoftex.parthub.models.SubscriptionPayment;
import com.xoftex.parthub.models.VendorSubscription;
import com.xoftex.parthub.repository.SubscriptionPaymentRepository;
import com.xoftex.parthub.repository.VendorSubscriptionRepository;

@Service
public class SubscriptionPaymentService {
    private final SubscriptionPaymentRepository subscriptionPaymentRepository;
    private final VendorSubscriptionRepository vendorSubscriptionRepository;

    public SubscriptionPaymentService(SubscriptionPaymentRepository subscriptionPaymentRepository,
            VendorSubscriptionRepository vendorSubscriptionRepository) {
        this.subscriptionPaymentRepository = subscriptionPaymentRepository;
        this.vendorSubscriptionRepository = vendorSubscriptionRepository;
    }

    @Transactional
    public SubscriptionPayment create(SubscriptionPayment payment) {
        return subscriptionPaymentRepository.save(payment);
    }

    public List<SubscriptionPayment> findByVendorSubscriptionId(Long vendorSubscriptionId) {
        Optional<VendorSubscription> sub = vendorSubscriptionRepository.findById(vendorSubscriptionId);
        return sub.map(subscriptionPaymentRepository::findByVendorSubscriptionOrderByCreatedAtDesc)
                .orElseGet(List::of);
    }

    public Optional<SubscriptionPayment> findLatestByVendorSubscriptionId(Long vendorSubscriptionId) {
        List<SubscriptionPayment> list = findByVendorSubscriptionId(vendorSubscriptionId);
        return list.isEmpty() ? Optional.empty() : Optional.of(list.get(0));
    }

    // @Transactional
    // public SubscriptionPayment createFromLegacyPayment(Payment legacyPayment,
    // VendorSubscription vendorSubscription) {
    // SubscriptionPayment sp = new SubscriptionPayment();
    // sp.setVendorSubscription(vendorSubscription);
    // sp.setAmount(legacyPayment.getAmount());
    // sp.setCurrency(legacyPayment.getCurrency() != null ?
    // legacyPayment.getCurrency() : "USD");
    // sp.setPaymentStatus(
    // legacyPayment.getPaymentStatus() != null ?
    // legacyPayment.getPaymentStatus().toString() : "SUCCEEDED");
    // sp.setStripeCustomerId(legacyPayment.getStripeCustomerId());
    // sp.setStripePaymentMethodId(legacyPayment.getStripePaymentMethodId());
    // sp.setPaymentIntentId(legacyPayment.getPaymentIntentId());
    // sp.setPaymentMethodType(legacyPayment.getPaymentMethodType());
    // sp.setPaymentMethodLast4(legacyPayment.getPaymentMethodLast4());
    // sp.setProcessedAt(legacyPayment.getProcessedAt());
    // sp.setMetadata(legacyPayment.getMetadata());
    // return subscriptionPaymentRepository.save(sp);
    // }

    public Optional<SubscriptionPayment> findByPaymentIntentId(String paymentIntentId) {
        return subscriptionPaymentRepository.findByPaymentIntentId(paymentIntentId);
    }
}
