package com.xoftex.parthub.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.xoftex.parthub.models.JobHistory;

@Repository
public interface JobHistoryRepository extends JpaRepository<JobHistory, Long> {
    List<JobHistory> findByJobId(long jobId);
    
    List<JobHistory> findByJobIdOrderByCreatedAtDesc(long jobId);
}