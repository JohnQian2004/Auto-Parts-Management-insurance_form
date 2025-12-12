package com.xoftex.parthub.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.xoftex.parthub.models.Insurancer;
 
@Repository
public interface InsurancerRepository extends JpaRepository<Insurancer, Long> {

  List<Insurancer> findByCompanyIdOrderByNameAsc(long companyId);
  
  Optional<Insurancer> findByToken(String token);
  
  Optional<Insurancer> findByName(String name);
}
