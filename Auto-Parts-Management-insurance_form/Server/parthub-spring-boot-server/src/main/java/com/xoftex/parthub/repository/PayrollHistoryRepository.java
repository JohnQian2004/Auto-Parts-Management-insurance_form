package com.xoftex.parthub.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.xoftex.parthub.models.PayrollHistory;

@Repository
public interface PayrollHistoryRepository extends JpaRepository<PayrollHistory, Long> {

    List<PayrollHistory> findByYearAndWeekAndCompanyId(int year, int weekNumber, long companyId);

    Optional<PayrollHistory> findByJobId(long jobId);

    Optional<PayrollHistory> findByJobIdAndCompanyId(long jobId, long companyId);

}
