package com.xoftex.parthub.services;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.xoftex.parthub.models.SubscriptionPlan;
import com.xoftex.parthub.models.SubscriptionStatus;
import com.xoftex.parthub.models.User;
import com.xoftex.parthub.models.VendorSubscription;
import com.xoftex.parthub.repository.SubscriptionPlanRepository;
import com.xoftex.parthub.repository.UserRepository;
import com.xoftex.parthub.repository.VendorSubscriptionRepository;

@Service
@Transactional
public class SubscriptionService {

    @Autowired
    private SubscriptionPlanRepository subscriptionPlanRepository;

    @Autowired
    private VendorSubscriptionRepository vendorSubscriptionRepository;

    @Autowired
    private UserRepository userRepository;

    // Subscription Plan methods
    public SubscriptionPlan createSubscriptionPlan(SubscriptionPlan plan) {
        // Validate price based on plan type
        validatePlan(plan);
        return subscriptionPlanRepository.save(plan);
    }

    private void validatePlan(SubscriptionPlan plan) {
        System.out.println("DEBUG: Validating plan - isTrialOnly: " + plan.getIsTrialOnly() + ", price: "
                + plan.getPrice() + ", durationMonths: " + plan.getDurationMonths());

        // Validate price
        if (plan.getPrice() == null) {
            throw new IllegalArgumentException("Price is required");
        }

        // For trial-only plans, price can be 0 or positive
        if (Boolean.TRUE.equals(plan.getIsTrialOnly())) {
            System.out.println("DEBUG: Plan is trial-only, allowing price >= 0");
            if (plan.getPrice().compareTo(BigDecimal.ZERO) < 0) {
                throw new IllegalArgumentException("Price cannot be negative for trial-only plans");
            }
        } else {
            System.out.println("DEBUG: Plan is regular, requiring price > 0");
            // For regular plans, price must be positive
            if (plan.getPrice().compareTo(BigDecimal.ZERO) <= 0) {
                throw new IllegalArgumentException("Price must be positive for regular subscription plans");
            }
        }

        // Validate duration
        if (plan.getDurationMonths() == null) {
            throw new IllegalArgumentException("Duration is required");
        }

        // For trial-only plans, duration can be 0 or positive
        if (Boolean.TRUE.equals(plan.getIsTrialOnly())) {
            System.out.println("DEBUG: Plan is trial-only, allowing duration >= 0");
            if (plan.getDurationMonths() < 0) {
                throw new IllegalArgumentException("Duration cannot be negative for trial-only plans");
            }
        } else {
            System.out.println("DEBUG: Plan is regular, requiring duration > 0");
            // For regular plans, duration must be positive
            if (plan.getDurationMonths() <= 0) {
                throw new IllegalArgumentException("Duration must be positive for regular subscription plans");
            }
        }
    }

    public Optional<SubscriptionPlan> getSubscriptionPlanById(Long id) {
        return subscriptionPlanRepository.findById(id);
    }

    public List<SubscriptionPlan> getAllActivePlans() {
        return subscriptionPlanRepository.findByIsActiveTrue();
    }

    public List<SubscriptionPlan> getPlansByMaxPrice(java.math.BigDecimal maxPrice) {
        return subscriptionPlanRepository.findByPriceLessThanEqual(maxPrice);
    }

    public List<SubscriptionPlan> searchPlansByName(String name) {
        return subscriptionPlanRepository.findByNameContainingIgnoreCase(name);
    }

    public SubscriptionPlan updateSubscriptionPlan(Long id, SubscriptionPlan planDetails) {
        SubscriptionPlan plan = subscriptionPlanRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Subscription plan not found with id: " + id));

        plan.setName(planDetails.getName());
        plan.setDescription(planDetails.getDescription());
        plan.setPrice(planDetails.getPrice());
        plan.setDurationMonths(planDetails.getDurationMonths());
        plan.setMaxTrips(planDetails.getMaxTrips());
        plan.setFeatures(planDetails.getFeatures());
        plan.setIsActive(planDetails.getIsActive());

        // Set new fields
        plan.setStripePriceId(planDetails.getStripePriceId());
        plan.setTrialDays(planDetails.getTrialDays());
        plan.setTrialPrice(planDetails.getTrialPrice());
        plan.setTrialStripePriceId(planDetails.getTrialStripePriceId());
        plan.setMaxUsers(planDetails.getMaxUsers());
        plan.setMaxVehicles(planDetails.getMaxVehicles());
        plan.setMaxJobsPerMonth(planDetails.getMaxJobsPerMonth());
        plan.setSortOrder(planDetails.getSortOrder());
        plan.setIsPopular(planDetails.getIsPopular());
        plan.setIsFeatured(planDetails.getIsFeatured());
        plan.setSetupFee(planDetails.getSetupFee());
        plan.setCancellationFee(planDetails.getCancellationFee());
        plan.setEarlyTerminationDays(planDetails.getEarlyTerminationDays());
        plan.setAutoUpgrade(planDetails.getAutoUpgrade());
        plan.setUpgradeDiscountPercent(planDetails.getUpgradeDiscountPercent());
        plan.setCustomFeatures(planDetails.getCustomFeatures());
        plan.setBillingCycle(planDetails.getBillingCycle());
        plan.setDiscountPercent(planDetails.getDiscountPercent());
        plan.setMaxTrialUsers(planDetails.getMaxTrialUsers());
        plan.setTrialRestrictions(planDetails.getTrialRestrictions());
        plan.setIsTrialOnly(planDetails.getIsTrialOnly());

        // Validate price based on plan type
        validatePlan(plan);

        return subscriptionPlanRepository.save(plan);
    }

    public void deleteSubscriptionPlan(Long id) {
        SubscriptionPlan plan = subscriptionPlanRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Subscription plan not found with id: " + id));

        subscriptionPlanRepository.delete(plan);
    }

    // Enhanced subscription plan methods
    public List<SubscriptionPlan> getPopularPlans() {
        return subscriptionPlanRepository.findByIsPopularTrue();
    }

    public List<SubscriptionPlan> getFeaturedPlans() {
        return subscriptionPlanRepository.findByIsFeaturedTrue();
    }

    public List<SubscriptionPlan> getPlansByDuration(Integer months) {
        return subscriptionPlanRepository.findByDurationMonthsOrderBySortOrder(months);
    }

    public List<SubscriptionPlan> getPlansWithTrial() {
        return subscriptionPlanRepository.findActivePlansWithTrial();
    }

    public List<SubscriptionPlan> getPlansByMinTrips(Integer minTrips) {
        return subscriptionPlanRepository.findActivePlansByMinTrips(minTrips);
    }

    public List<SubscriptionPlan> getAllPlans() {
        return subscriptionPlanRepository.findAll();
    }

    public List<SubscriptionPlan> getPlansByMaxUsers(Integer maxUsers) {
        return subscriptionPlanRepository.findByMaxUsersLessThanEqual(maxUsers);
    }

    // Initialize default plans method
    public void initializeDefaultPlans() {
        // Check if plans already exist
        if (subscriptionPlanRepository.count() > 0) {
            return; // Plans already exist
        }

        // Create basic plan
        SubscriptionPlan basicPlan = new SubscriptionPlan();
        basicPlan.setName("Basic");
        basicPlan.setDescription("Perfect for small vendors starting out");
        basicPlan.setPrice(java.math.BigDecimal.valueOf(29.99));
        basicPlan.setDurationMonths(1);
        basicPlan.setMaxTrips(10);
        basicPlan.setIsActive(true);
        basicPlan.setSortOrder(1);
        basicPlan.setMaxUsers(1);
        basicPlan.setMaxVehicles(1);
        basicPlan.setFeatures("{\"listings\": 10, \"support\": \"email\", \"analytics\": false}");
        subscriptionPlanRepository.save(basicPlan);

        // Create professional plan
        SubscriptionPlan proPlan = new SubscriptionPlan();
        proPlan.setName("Professional");
        proPlan.setDescription("Ideal for growing vendors");
        proPlan.setPrice(java.math.BigDecimal.valueOf(79.99));
        proPlan.setDurationMonths(1);
        proPlan.setMaxTrips(50);
        proPlan.setIsActive(true);
        proPlan.setSortOrder(2);
        proPlan.setIsPopular(true);
        proPlan.setMaxUsers(5);
        proPlan.setMaxVehicles(10);
        proPlan.setMaxJobsPerMonth(100);
        proPlan.setFeatures("{\"listings\": 50, \"support\": \"priority\", \"analytics\": true}");
        subscriptionPlanRepository.save(proPlan);

        // Create enterprise plan
        SubscriptionPlan enterprisePlan = new SubscriptionPlan();
        enterprisePlan.setName("Enterprise");
        enterprisePlan.setDescription("For large vendors with high volume");
        enterprisePlan.setPrice(java.math.BigDecimal.valueOf(199.99));
        enterprisePlan.setDurationMonths(1);
        enterprisePlan.setMaxTrips(200);
        enterprisePlan.setIsActive(true);
        enterprisePlan.setSortOrder(3);
        enterprisePlan.setIsFeatured(true);
        enterprisePlan.setMaxUsers(20);
        enterprisePlan.setMaxVehicles(50);
        enterprisePlan.setMaxJobsPerMonth(500);
        enterprisePlan.setFeatures("{\"listings\": 200, \"support\": \"24/7\", \"analytics\": true, \"custom\": true}");
        subscriptionPlanRepository.save(enterprisePlan);
    }

    // Vendor Subscription methods
    public VendorSubscription createVendorSubscription(Long vendorId, Long planId, LocalDate startDate) {
        Optional<User> vendorOpt = userRepository.findById(vendorId);
        Optional<SubscriptionPlan> planOpt = subscriptionPlanRepository.findById(planId);

        if (vendorOpt.isEmpty() || planOpt.isEmpty()) {
            throw new RuntimeException("Vendor or subscription plan not found");
        }

        User vendor = vendorOpt.get();
        SubscriptionPlan plan = planOpt.get();

        // Calculate end date based on plan type
        LocalDate endDate;
        LocalDate trialStartDate = null;
        LocalDate trialEndDate = null;

        if (Boolean.TRUE.equals(plan.getIsTrialOnly()) || (plan.getTrialDays() != null && plan.getTrialDays() > 0)) {
            // For trial-only plans or plans with trial periods
            if (plan.getTrialDays() != null && plan.getTrialDays() > 0) {
                endDate = startDate.plusDays(plan.getTrialDays());
                trialStartDate = startDate;
                trialEndDate = endDate;
            } else {
                // Trial-only plan without specific trial days, use duration months
                endDate = startDate.plusMonths(plan.getDurationMonths());
            }
        } else {
            // Regular paid plan
            endDate = startDate.plusMonths(plan.getDurationMonths());
        }

        VendorSubscription subscription = new VendorSubscription(vendor, plan, startDate, endDate);

        // Set trial dates if applicable
        if (trialStartDate != null && trialEndDate != null) {
            subscription.setTrialStartDate(trialStartDate);
            subscription.setTrialEndDate(trialEndDate);
        }

        // Save the new subscription first
        VendorSubscription savedSubscription = vendorSubscriptionRepository.save(subscription);

        // Auto-cancel lower priority active subscriptions
        autoCancelLowerPrioritySubscriptions(vendor, savedSubscription);

        return savedSubscription;
    }

    /**
     * Auto-cancel lower priority active subscriptions when a new higher priority
     * subscription is created.
     */
    private void autoCancelLowerPrioritySubscriptions(User vendor, VendorSubscription newSubscription) {
        // Get all active subscriptions for this vendor
        List<VendorSubscription> activeSubscriptions = vendorSubscriptionRepository.findByVendorAndStatus(vendor,
                SubscriptionStatus.ACTIVE);

        // Filter out the new subscription (don't cancel itself)
        activeSubscriptions = activeSubscriptions.stream()
                .filter(sub -> !sub.getId().equals(newSubscription.getId()))
                .collect(Collectors.toList());

        if (activeSubscriptions.isEmpty()) {
            return; // No other active subscriptions to cancel
        }

        int newPlanPriority = newSubscription.getPlan().calculatePriority();

        for (VendorSubscription existingSubscription : activeSubscriptions) {
            int existingPlanPriority = existingSubscription.getPlan().calculatePriority();

            // Cancel if existing plan has lower priority
            if (existingPlanPriority < newPlanPriority) {
                String cancellationReason = determineCancellationReason(newSubscription.getPlan(),
                        existingSubscription.getPlan());

                existingSubscription.setStatus(SubscriptionStatus.CANCELLED);
                existingSubscription.setEndDate(LocalDate.now());
                existingSubscription.setCancellationReason(cancellationReason);
                existingSubscription.setSupersededBySubscriptionId(newSubscription.getId());
                existingSubscription.setUpdatedAt(LocalDateTime.now());

                vendorSubscriptionRepository.save(existingSubscription);

                System.out.println("Auto-cancelled subscription " + existingSubscription.getId() +
                        " (plan: " + existingSubscription.getPlan().getName() +
                        ", priority: " + existingPlanPriority +
                        ") due to new subscription " + newSubscription.getId() +
                        " (plan: " + newSubscription.getPlan().getName() +
                        ", priority: " + newPlanPriority + ")");
            }
        }
    }

    /**
     * Determine the cancellation reason based on plan types and priorities.
     */
    private String determineCancellationReason(SubscriptionPlan newPlan, SubscriptionPlan cancelledPlan) {
        if (Boolean.TRUE.equals(cancelledPlan.getIsTrialOnly()) && !Boolean.TRUE.equals(newPlan.getIsTrialOnly())) {
            return "TRIAL_SUPERSEDED_BY_PAID";
        } else if (cancelledPlan.calculatePriority() < newPlan.calculatePriority()) {
            return "SUPERSEDED_BY_HIGHER_PRIORITY_PLAN";
        } else {
            return "AUTO_CANCELLED";
        }
    }

    public Optional<VendorSubscription> getVendorSubscriptionById(Long id) {
        return vendorSubscriptionRepository.findById(id);
    }

    public VendorSubscription updateVendorSubscription(VendorSubscription subscription) {
        return vendorSubscriptionRepository.save(subscription);
    }

    public VendorSubscription cancelVendorSubscription(Long subscriptionId) {
        return cancelVendorSubscription(subscriptionId, "MANUAL_CANCELLATION");
    }

    public VendorSubscription cancelVendorSubscription(Long subscriptionId, String cancellationReason) {
        Optional<VendorSubscription> subscriptionOpt = vendorSubscriptionRepository.findById(subscriptionId);
        if (subscriptionOpt.isEmpty()) {
            throw new RuntimeException("Subscription not found");
        }

        VendorSubscription subscription = subscriptionOpt.get();
        subscription.setStatus(SubscriptionStatus.CANCELLED);
        // End immediately on cancel
        subscription.setEndDate(LocalDate.now());
        subscription.setCancellationReason(cancellationReason);
        subscription.setUpdatedAt(LocalDateTime.now());

        return vendorSubscriptionRepository.save(subscription);
    }

    public List<VendorSubscription> getSubscriptionsByVendor(Long vendorId) {
        Optional<User> vendorOpt = userRepository.findById(vendorId);
        if (vendorOpt.isPresent()) {
            return vendorSubscriptionRepository.findByVendorWithPlan(vendorOpt.get());
        }
        return List.of();
    }

    public List<VendorSubscription> getSubscriptionsByPlan(Long planId) {
        Optional<SubscriptionPlan> planOpt = subscriptionPlanRepository.findById(planId);
        if (planOpt.isPresent()) {
            return vendorSubscriptionRepository.findByPlan(planOpt.get());
        }
        return List.of();
    }

    public List<VendorSubscription> getSubscriptionsByStatus(SubscriptionStatus status) {
        return vendorSubscriptionRepository.findByStatus(status);
    }

    public Optional<VendorSubscription> getActiveSubscriptionByVendor(Long vendorId) {
        Optional<User> vendorOpt = userRepository.findById(vendorId);
        if (vendorOpt.isPresent()) {
            return vendorSubscriptionRepository.findActiveSubscriptionByVendor(vendorOpt.get(), LocalDate.now());
        }
        return Optional.empty();
    }

    /**
     * Get the current active plan for a vendor based on priority hierarchy.
     * Returns the highest priority active subscription.
     */
    public Optional<VendorSubscription> getCurrentActivePlan(Long vendorId) {
        Optional<User> vendorOpt = userRepository.findById(vendorId);
        if (vendorOpt.isEmpty()) {
            return Optional.empty();
        }

        User vendor = vendorOpt.get();
        List<VendorSubscription> activeSubscriptions = vendorSubscriptionRepository.findByVendorAndStatus(vendor,
                SubscriptionStatus.ACTIVE);

        if (activeSubscriptions.isEmpty()) {
            return Optional.empty();
        }

        // Sort by plan priority (highest first)
        return activeSubscriptions.stream()
                .max((sub1, sub2) -> {
                    int priority1 = sub1.getPlan().calculatePriority();
                    int priority2 = sub2.getPlan().calculatePriority();
                    return Integer.compare(priority1, priority2);
                });
    }

    public VendorSubscription updateSubscriptionStatus(Long id, SubscriptionStatus status) {
        VendorSubscription subscription = vendorSubscriptionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Vendor subscription not found with id: " + id));

        subscription.setStatus(status);
        return vendorSubscriptionRepository.save(subscription);
    }

    public void cancelSubscription(Long id) {
        VendorSubscription subscription = vendorSubscriptionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Vendor subscription not found with id: " + id));

        subscription.setStatus(SubscriptionStatus.CANCELLED);
        vendorSubscriptionRepository.save(subscription);
    }

    public void deleteVendorSubscription(Long id) {
        VendorSubscription subscription = vendorSubscriptionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Vendor subscription not found with id: " + id));

        vendorSubscriptionRepository.delete(subscription);
    }

    // Admin analytics methods
    public long getActiveSubscriptionsCount() {
        return vendorSubscriptionRepository.countByStatus(SubscriptionStatus.ACTIVE);
    }

    public BigDecimal getMonthlyRevenue() {
        List<VendorSubscription> activeSubscriptions = vendorSubscriptionRepository
                .findByStatus(SubscriptionStatus.ACTIVE);
        return activeSubscriptions.stream()
                .map(sub -> sub.getPlan().getPrice())
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    public long getActivePlansCount() {
        return subscriptionPlanRepository.countByIsActiveTrue();
    }

    public Long getSubscriberCountForPlan(Long planId) {
        Optional<SubscriptionPlan> planOpt = subscriptionPlanRepository.findById(planId);
        if (planOpt.isEmpty()) {
            return 0L;
        }
        return vendorSubscriptionRepository.countActiveSubscriptionsByPlan(planOpt.get());
    }

    public Map<Long, Long> getAllSubscriberCounts() {
        List<SubscriptionPlan> allPlans = subscriptionPlanRepository.findAll();
        Map<Long, Long> subscriberCounts = new HashMap<>();

        for (SubscriptionPlan plan : allPlans) {
            Long count = vendorSubscriptionRepository.countActiveSubscriptionsByPlan(plan);
            subscriberCounts.put(plan.getId(), count);
        }

        return subscriberCounts;
    }

    public List<VendorSubscription> getAllSubscriptions(int page, int limit) {
        // Fetch subscriptions with vendor and plan data
        List<VendorSubscription> allSubscriptions = vendorSubscriptionRepository.findAllWithVendorAndPlan();
        int start = (page - 1) * limit;
        int end = Math.min(start + limit, allSubscriptions.size());
        return allSubscriptions.subList(start, end);
    }

    public long getTotalSubscriptionsCount() {
        return vendorSubscriptionRepository.count();
    }

    public List<SubscriptionPlan> getAllSubscriptionPlans() {
        List<SubscriptionPlan> plans = subscriptionPlanRepository.findAll();

        // Populate subscriber counts for each plan
        for (SubscriptionPlan plan : plans) {
            Long subscriberCount = vendorSubscriptionRepository.countActiveSubscriptionsByPlan(plan);
            plan.setSubscriberCount(subscriberCount);
        }

        return plans;
    }

    public Map<String, Object> getRevenueAnalytics(String period) {
        Map<String, Object> analytics = new HashMap<>();
        BigDecimal totalRevenue = getMonthlyRevenue();
        analytics.put("totalRevenue", totalRevenue);
        analytics.put("period", period);
        analytics.put("currency", "USD");
        return analytics;
    }

    public List<Map<String, Object>> getPlanAnalytics() {
        List<SubscriptionPlan> plans = getAllSubscriptionPlans();
        return plans.stream().map(plan -> {
            Map<String, Object> planAnalytics = new HashMap<>();
            planAnalytics.put("planId", plan.getId());
            planAnalytics.put("planName", plan.getName());
            planAnalytics.put("subscriberCount", getSubscriptionsByPlan(plan.getId()).size());
            planAnalytics.put("revenue", plan.getPrice());
            planAnalytics.put("conversionRate", 0.15); // Mock data
            planAnalytics.put("churnRate", 0.05); // Mock data
            return planAnalytics;
        }).collect(Collectors.toList());
    }

    public Map<String, Object> getSubscriptionGrowth(String period) {
        Map<String, Object> growth = new HashMap<>();
        long currentSubscriptions = getActiveSubscriptionsCount();
        growth.put("currentSubscriptions", currentSubscriptions);
        growth.put("growthRate", 0.12); // Mock 12% growth
        growth.put("period", period);
        return growth;
    }

    // ==================== ANALYTICS METHODS ====================

    public Map<String, Object> getRevenueTrends(int months) {
        Map<String, Object> trends = new HashMap<>();

        // Mock data for revenue trends over time
        List<Map<String, Object>> monthlyRevenue = new ArrayList<>();
        BigDecimal baseRevenue = getMonthlyRevenue();

        for (int i = months - 1; i >= 0; i--) {
            Map<String, Object> monthData = new HashMap<>();
            monthData.put("month", LocalDate.now().minusMonths(i).getMonth().name());
            monthData.put("revenue", baseRevenue.multiply(BigDecimal.valueOf(0.8 + Math.random() * 0.4)));
            monthData.put("subscriptions", (int) (getActiveSubscriptionsCount() * (0.8 + Math.random() * 0.4)));
            monthlyRevenue.add(monthData);
        }

        trends.put("monthlyRevenue", monthlyRevenue);
        trends.put("totalRevenue", baseRevenue.multiply(BigDecimal.valueOf(months)));
        trends.put("averageMonthlyRevenue", baseRevenue);
        trends.put("growthRate", 0.15); // 15% growth rate

        return trends;
    }

    public Map<String, Object> getSubscriptionTrends(int months) {
        Map<String, Object> trends = new HashMap<>();

        // Mock data for subscription trends
        List<Map<String, Object>> monthlySubscriptions = new ArrayList<>();
        long baseCount = getActiveSubscriptionsCount();

        for (int i = months - 1; i >= 0; i--) {
            Map<String, Object> monthData = new HashMap<>();
            monthData.put("month", LocalDate.now().minusMonths(i).getMonth().name());
            monthData.put("newSubscriptions", (int) (baseCount * 0.1 * (0.5 + Math.random())));
            monthData.put("cancelledSubscriptions", (int) (baseCount * 0.05 * (0.5 + Math.random())));
            monthData.put("netGrowth", (int) (baseCount * 0.05 * (0.5 + Math.random())));
            monthlySubscriptions.add(monthData);
        }

        trends.put("monthlySubscriptions", monthlySubscriptions);
        trends.put("totalGrowth", baseCount * 0.6); // 60% total growth
        trends.put("averageMonthlyGrowth", baseCount * 0.05); // 5% monthly growth

        return trends;
    }

    public Map<String, Object> getPlanPerformance() {
        Map<String, Object> performance = new HashMap<>();

        List<SubscriptionPlan> plans = getAllSubscriptionPlans();
        List<Map<String, Object>> planPerformance = new ArrayList<>();

        for (SubscriptionPlan plan : plans) {
            Map<String, Object> planData = new HashMap<>();
            planData.put("planId", plan.getId());
            planData.put("planName", plan.getName());
            planData.put("subscriberCount", plan.getSubscriberCount());
            planData.put("revenue", plan.getPrice().multiply(BigDecimal.valueOf(plan.getSubscriberCount())));
            planData.put("conversionRate", 0.15 + Math.random() * 0.1); // 15-25% conversion
            planData.put("churnRate", 0.02 + Math.random() * 0.03); // 2-5% churn
            planPerformance.add(planData);
        }

        performance.put("planPerformance", planPerformance);
        performance.put("topPerformingPlan", plans.stream()
                .max((p1, p2) -> Long.compare(p1.getSubscriberCount(), p2.getSubscriberCount()))
                .map(SubscriptionPlan::getName)
                .orElse("N/A"));

        return performance;
    }

    public Map<String, Object> getVendorInsights() {
        Map<String, Object> insights = new HashMap<>();

        // Mock vendor insights
        insights.put("totalVendors", getActiveSubscriptionsCount());
        insights.put("newVendorsThisMonth", (int) (getActiveSubscriptionsCount() * 0.1));
        insights.put("averageSubscriptionValue", getMonthlyRevenue()
                .divide(BigDecimal.valueOf(getActiveSubscriptionsCount()), 2, BigDecimal.ROUND_HALF_UP));
        insights.put("vendorRetentionRate", 0.85); // 85% retention
        insights.put("topVendorSegment", "Small Business"); // Mock data

        // Vendor subscription distribution
        Map<String, Integer> distribution = new HashMap<>();
        distribution.put("Trial", (int) (getActiveSubscriptionsCount() * 0.3));
        distribution.put("Basic", (int) (getActiveSubscriptionsCount() * 0.4));
        distribution.put("Professional", (int) (getActiveSubscriptionsCount() * 0.25));
        distribution.put("Enterprise", (int) (getActiveSubscriptionsCount() * 0.05));
        insights.put("vendorDistribution", distribution);

        return insights;
    }

    public Map<String, Object> getChurnAnalysis(int months) {
        Map<String, Object> churn = new HashMap<>();

        // Mock churn analysis
        churn.put("overallChurnRate", 0.05); // 5% monthly churn
        churn.put("churnedSubscriptions", (int) (getActiveSubscriptionsCount() * 0.05));
        churn.put("retentionRate", 0.95); // 95% retention

        // Churn by plan type
        Map<String, Double> churnByPlan = new HashMap<>();
        churnByPlan.put("Trial", 0.15); // 15% churn for trials
        churnByPlan.put("Basic", 0.08); // 8% churn for basic
        churnByPlan.put("Professional", 0.03); // 3% churn for professional
        churnByPlan.put("Enterprise", 0.01); // 1% churn for enterprise
        churn.put("churnByPlan", churnByPlan);

        // Churn reasons
        Map<String, Integer> churnReasons = new HashMap<>();
        churnReasons.put("Price", 35);
        churnReasons.put("Features", 25);
        churnReasons.put("Support", 20);
        churnReasons.put("Other", 20);
        churn.put("churnReasons", churnReasons);

        return churn;
    }

    public Map<String, Object> getConversionFunnel() {
        Map<String, Object> funnel = new HashMap<>();

        // Mock conversion funnel data
        Map<String, Integer> funnelSteps = new HashMap<>();
        funnelSteps.put("visitors", 10000);
        funnelSteps.put("trialSignups", 1000);
        funnelSteps.put("paidConversions", 150);
        funnelSteps.put("activeSubscribers", 120);

        funnel.put("funnelSteps", funnelSteps);
        funnel.put("trialToPaidConversion", 0.15); // 15% trial to paid
        funnel.put("overallConversion", 0.012); // 1.2% overall conversion

        // Conversion by plan
        Map<String, Double> conversionByPlan = new HashMap<>();
        conversionByPlan.put("Basic", 0.20);
        conversionByPlan.put("Professional", 0.12);
        conversionByPlan.put("Enterprise", 0.08);
        funnel.put("conversionByPlan", conversionByPlan);

        return funnel;
    }
}