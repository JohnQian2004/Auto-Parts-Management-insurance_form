package com.xoftex.parthub.repository;

 

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.xoftex.parthub.models.Service;


@Repository
public interface ServiceRepository extends JpaRepository<Service, Long> {

    List<Service> findAllByOrderByNameAsc();

    List<Service> findByCompanyIdOrderByNameAsc(long compayId);

 
 
}
