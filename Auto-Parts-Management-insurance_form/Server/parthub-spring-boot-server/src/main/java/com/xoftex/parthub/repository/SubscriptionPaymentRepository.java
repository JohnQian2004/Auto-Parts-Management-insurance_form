package com.xoftex.parthub.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.xoftex.parthub.models.SubscriptionPayment;
import com.xoftex.parthub.models.VendorSubscription;

@Repository
public interface SubscriptionPaymentRepository extends JpaRepository<SubscriptionPayment, Long> {
    List<SubscriptionPayment> findByVendorSubscriptionOrderByCreatedAtDesc(VendorSubscription vendorSubscription);

    Optional<SubscriptionPayment> findByPaymentIntentId(String paymentIntentId);

    @Query("SELECT p FROM SubscriptionPayment p WHERE p.vendorSubscription.id = :subscriptionId")
    List<SubscriptionPayment> findByVendorSubscriptionId(@Param("subscriptionId") Long subscriptionId);

}
