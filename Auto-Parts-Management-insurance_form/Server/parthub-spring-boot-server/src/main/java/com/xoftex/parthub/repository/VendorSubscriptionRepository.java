package com.xoftex.parthub.repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.xoftex.parthub.models.SubscriptionPlan;
import com.xoftex.parthub.models.SubscriptionStatus;
import com.xoftex.parthub.models.User;
import com.xoftex.parthub.models.VendorSubscription;

@Repository
public interface VendorSubscriptionRepository extends JpaRepository<VendorSubscription, Long> {

    List<VendorSubscription> findByVendor(User vendor);

    List<VendorSubscription> findByPlan(SubscriptionPlan plan);

    List<VendorSubscription> findByStatus(SubscriptionStatus status);

    List<VendorSubscription> findByEndDateBefore(LocalDate date);

    List<VendorSubscription> findByEndDateAfter(LocalDate date);

    @Query("SELECT vs FROM VendorSubscription vs WHERE vs.vendor = :vendor AND vs.status = 'ACTIVE' AND vs.endDate >= :currentDate")
    Optional<VendorSubscription> findActiveSubscriptionByVendor(@Param("vendor") User vendor,
            @Param("currentDate") LocalDate currentDate);

    @Query("SELECT COUNT(vs) FROM VendorSubscription vs WHERE vs.plan = :plan AND vs.status = 'ACTIVE'")
    Long countActiveSubscriptionsByPlan(@Param("plan") SubscriptionPlan plan);

    List<VendorSubscription> findByVendorAndStatus(User vendor, SubscriptionStatus status);

    Long countByStatus(SubscriptionStatus status);

    @Query("SELECT vs FROM VendorSubscription vs JOIN FETCH vs.vendor JOIN FETCH vs.plan ORDER BY vs.createdAt DESC")
    List<VendorSubscription> findAllWithVendorAndPlan();

    @Query("SELECT vs FROM VendorSubscription vs JOIN FETCH vs.plan WHERE vs.vendor = :vendor ORDER BY vs.createdAt DESC")
    List<VendorSubscription> findByVendorWithPlan(@Param("vendor") User vendor);
}