package com.xoftex.parthub.repository;

 

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.xoftex.parthub.models.ApprovalStatus;

 
@Repository
public interface ApprovalStatusRepository extends JpaRepository<ApprovalStatus, Long> {

    List<ApprovalStatus> findByCompanyIdOrderByNameAsc(long compayId);

}
