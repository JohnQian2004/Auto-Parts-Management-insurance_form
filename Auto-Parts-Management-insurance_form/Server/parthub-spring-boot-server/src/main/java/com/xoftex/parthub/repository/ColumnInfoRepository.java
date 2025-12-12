package com.xoftex.parthub.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.xoftex.parthub.models.ColumnInfo;
 

@Repository
public interface ColumnInfoRepository extends JpaRepository<ColumnInfo, Long> {

  List<ColumnInfo> findByCompanyIdOrderByNameAsc(long companyId);
}
