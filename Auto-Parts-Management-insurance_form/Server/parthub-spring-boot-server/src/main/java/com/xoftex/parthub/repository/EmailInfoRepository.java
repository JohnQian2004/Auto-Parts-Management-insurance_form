package com.xoftex.parthub.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.xoftex.parthub.models.EmailInfo;

@Repository
public interface EmailInfoRepository extends JpaRepository<EmailInfo, Long> {

  List<EmailInfo> findByCompanyId(long companyId);

}
