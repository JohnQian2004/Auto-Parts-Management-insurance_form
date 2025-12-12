package com.xoftex.parthub.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


import com.xoftex.parthub.models.Status;

@Repository
public interface StatusRepository extends JpaRepository<Status, Long> {

  List<Status> findByCompanyIdOrderByNameAsc(long companyId);
}
