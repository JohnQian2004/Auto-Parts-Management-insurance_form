package com.xoftex.parthub.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.xoftex.parthub.models.AutopartHistory;

@Repository
public interface AutopartHistoryRepository extends JpaRepository<AutopartHistory, Long> {
    List<AutopartHistory> findByAutopartId(long autopartId);
    
    List<AutopartHistory> findByAutopartIdOrderByCreatedAtDesc(long autopartId);
}