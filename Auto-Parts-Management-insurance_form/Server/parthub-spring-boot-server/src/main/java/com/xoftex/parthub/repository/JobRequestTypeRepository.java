package com.xoftex.parthub.repository;

 

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.xoftex.parthub.models.JobRequestType;
 
@Repository
public interface JobRequestTypeRepository extends JpaRepository<JobRequestType, Long> {

    List<JobRequestType> findByCompanyIdOrderByNameAsc(long compayId);

}
