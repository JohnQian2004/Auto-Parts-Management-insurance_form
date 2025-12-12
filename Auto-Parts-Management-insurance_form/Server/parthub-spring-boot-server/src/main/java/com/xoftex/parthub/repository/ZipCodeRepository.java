package com.xoftex.parthub.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.xoftex.parthub.models.ZipCode;


 
@Repository
public interface ZipCodeRepository extends JpaRepository<ZipCode, Long> {
  Optional<ZipCode> findByZip(String zip);
} 
