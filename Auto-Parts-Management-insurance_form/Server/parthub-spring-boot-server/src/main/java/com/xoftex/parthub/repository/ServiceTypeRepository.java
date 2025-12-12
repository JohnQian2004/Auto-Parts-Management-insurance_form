package com.xoftex.parthub.repository;

 

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


import com.xoftex.parthub.models.ServiceType;
 


@Repository
public interface ServiceTypeRepository extends JpaRepository<ServiceType, Long> {

    List<ServiceType> findAllByOrderByNameAsc();


}
