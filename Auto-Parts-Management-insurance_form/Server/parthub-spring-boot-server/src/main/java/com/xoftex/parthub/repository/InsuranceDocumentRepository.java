package com.xoftex.parthub.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.xoftex.parthub.models.InsuranceDocument;

@Repository
public interface InsuranceDocumentRepository extends JpaRepository<InsuranceDocument, Long> {
    
    List<InsuranceDocument> findByCompanyUuidAndPublicUuidOrderBySequenceNumberAsc(
        String companyUuid, String publicUuid);
    
    Optional<InsuranceDocument> findByToken(String token);
    
    List<InsuranceDocument> findByCompanyUuidAndDocTypeId(String companyUuid, Long docTypeId);
    
    List<InsuranceDocument> findByCompanyUuidAndPublicUuidAndDocTypeId(
        String companyUuid, String publicUuid, Long docTypeId);
    
    List<InsuranceDocument> findByCompanyUuid(String companyUuid);
    
    List<InsuranceDocument> findByVehicleId(Long vehicleId);
}
