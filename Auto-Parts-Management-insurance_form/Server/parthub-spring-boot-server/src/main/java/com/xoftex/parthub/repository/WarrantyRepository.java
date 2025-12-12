package com.xoftex.parthub.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.xoftex.parthub.models.Warranty;

@Repository
public interface WarrantyRepository extends JpaRepository<Warranty, Long> {

    List<Warranty> findByCompanyId(long companyId);

    List<Warranty> findByCompanyIdOrderByNameAsc(long companyId);

}
