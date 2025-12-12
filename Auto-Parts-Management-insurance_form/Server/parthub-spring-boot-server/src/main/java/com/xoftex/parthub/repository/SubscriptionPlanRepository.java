package com.xoftex.parthub.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.xoftex.parthub.models.SubscriptionPlan;

@Repository
public interface SubscriptionPlanRepository extends JpaRepository<SubscriptionPlan, Long> {

    List<SubscriptionPlan> findByIsActiveTrue();

    List<SubscriptionPlan> findByPriceLessThanEqual(java.math.BigDecimal price);

    List<SubscriptionPlan> findByNameContainingIgnoreCase(String name);

    // Additional query methods for enhanced functionality
    List<SubscriptionPlan> findByIsPopularTrue();

    List<SubscriptionPlan> findByIsFeaturedTrue();

    List<SubscriptionPlan> findByMaxUsersLessThanEqual(Integer maxUsers);

    List<SubscriptionPlan> findByDurationMonthsOrderBySortOrder(Integer months);

    List<SubscriptionPlan> findByIsActiveTrueOrderBySortOrder();

    @Query("SELECT sp FROM SubscriptionPlan sp WHERE sp.isActive = true AND sp.trialDays > 0")
    List<SubscriptionPlan> findActivePlansWithTrial();

    @Query("SELECT sp FROM SubscriptionPlan sp WHERE sp.isActive = true AND sp.price <= :maxPrice ORDER BY sp.price ASC")
    List<SubscriptionPlan> findActivePlansByMaxPrice(@Param("maxPrice") java.math.BigDecimal maxPrice);

    @Query("SELECT sp FROM SubscriptionPlan sp WHERE sp.isActive = true AND sp.maxTrips >= :minTrips ORDER BY sp.price ASC")
    List<SubscriptionPlan> findActivePlansByMinTrips(@Param("minTrips") Integer minTrips);

    Long countByIsActiveTrue();
}