package com.xoftex.parthub.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.xoftex.parthub.models.InTakeWay;


@Repository
public interface InTakeWayRepository extends JpaRepository<InTakeWay, Long> {

    List<InTakeWay> findByCompanyId(long companyId);

	List<InTakeWay> findByCompanyIdOrderByNameAsc(long companyId);

}
