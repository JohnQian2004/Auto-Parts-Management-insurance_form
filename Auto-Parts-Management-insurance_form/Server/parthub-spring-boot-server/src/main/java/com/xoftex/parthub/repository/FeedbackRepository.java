package com.xoftex.parthub.repository;

import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.xoftex.parthub.models.Feedback;

@Repository
public interface FeedbackRepository extends JpaRepository<Feedback, Long> {

    List<Feedback> findByCompanyIdOrderByNameAsc(long compayId);

    List<Feedback> findByUserIdAndReplyNotNullOrderByNameAsc(long compayId);

    List<Feedback> findAllByOrderByIdDesc(Pageable withPage);

    @Query(value = "SELECT COUNT(*) FROM feedbacks where id > 0 ", nativeQuery = true)
    int countAll();

    List<Feedback> findByViewedOrderByIdAsc(boolean viewed, Pageable withPage);
}
