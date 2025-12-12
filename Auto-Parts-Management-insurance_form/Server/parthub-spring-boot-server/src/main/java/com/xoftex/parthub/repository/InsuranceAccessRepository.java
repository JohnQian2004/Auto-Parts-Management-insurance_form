package com.xoftex.parthub.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.xoftex.parthub.models.InsuranceAccess;

@Repository
public interface InsuranceAccessRepository extends JpaRepository<InsuranceAccess, Long> {
    
    Optional<InsuranceAccess> findByCompanyUuidAndPublicUuidAndPrivateUuid(
        String companyUuid, String publicUuid, String privateUuid);
    
    List<InsuranceAccess> findByCompanyUuidAndPublicUuid(String companyUuid, String publicUuid);
    
    List<InsuranceAccess> findByCompanyUuid(String companyUuid);
    
    List<InsuranceAccess> findByVehicleId(Long vehicleId);
    
    List<InsuranceAccess> findByIsActiveTrue();
    
    List<InsuranceAccess> findByExpiresAtBefore(java.util.Date date);
}
