package com.xoftex.parthub.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.xoftex.parthub.models.InsuranceActivityLogs;

@Repository
public interface InsuranceActivityLogsRepository extends JpaRepository<InsuranceActivityLogs, Long> {
    
    List<InsuranceActivityLogs> findByCompanyUuidAndPublicUuidOrderByAccessedAtDesc(
        String companyUuid, String publicUuid);
    
    List<InsuranceActivityLogs> findByCompanyUuid(String companyUuid);
    
    List<InsuranceActivityLogs> findByVehicleId(Long vehicleId);
    
    List<InsuranceActivityLogs> findByActionType(String actionType);
    
    List<InsuranceActivityLogs> findByIsExpiredFalse();
}
