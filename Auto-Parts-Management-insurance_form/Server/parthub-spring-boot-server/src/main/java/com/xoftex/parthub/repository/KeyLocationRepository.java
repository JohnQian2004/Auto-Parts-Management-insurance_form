package com.xoftex.parthub.repository;

import java.util.List;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.xoftex.parthub.models.KeyLocation;
 

@Repository
public interface KeyLocationRepository extends JpaRepository<KeyLocation, Long> {

  List<KeyLocation> findByCompanyIdOrderByNameAsc(long companyId);
}
