package com.xoftex.parthub.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.xoftex.parthub.models.InsuranceClaim;

@Repository
public interface InsuranceClaimRepository extends JpaRepository<InsuranceClaim, Long> {
    
    List<InsuranceClaim> findByCompanyUuidAndPublicUuid(String companyUuid, String publicUuid);
    
    Optional<InsuranceClaim> findByCompanyUuidAndPublicUuidAndPrivateUuid(
        String companyUuid, String publicUuid, String privateUuid);
    
    List<InsuranceClaim> findByVehicleId(Long vehicleId);
    
    List<InsuranceClaim> findByInsuranceCompany(String insuranceCompany);
    
    List<InsuranceClaim> findByCompanyUuid(String companyUuid);
}
