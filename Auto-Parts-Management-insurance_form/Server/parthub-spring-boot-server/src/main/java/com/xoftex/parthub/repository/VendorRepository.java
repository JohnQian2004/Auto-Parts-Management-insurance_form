package com.xoftex.parthub.repository;

import java.util.List;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.xoftex.parthub.models.Vendor;
 
@Repository
public interface VendorRepository extends JpaRepository<Vendor, Long> {

  List<Vendor> findByCompanyIdOrderByNameAsc(long companyId);
}
