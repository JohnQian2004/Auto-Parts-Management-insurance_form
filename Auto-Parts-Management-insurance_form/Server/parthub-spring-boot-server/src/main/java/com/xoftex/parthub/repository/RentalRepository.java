package com.xoftex.parthub.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.xoftex.parthub.models.Rental;

@Repository
public interface RentalRepository extends JpaRepository<Rental, Long> {

  List<Rental> findByCompanyIdOrderByNameAsc(long companyId);
}
