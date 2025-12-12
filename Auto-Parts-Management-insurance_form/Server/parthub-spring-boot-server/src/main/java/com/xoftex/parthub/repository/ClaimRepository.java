package com.xoftex.parthub.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.xoftex.parthub.models.Claim;

@Repository
public interface ClaimRepository extends JpaRepository<Claim, Long> {

  List<Claim> findByVehicleIdOrderByNameAsc(long vehicleId);

  List<Claim> findByVehicleId(long vehicleId);

  int countByVehicleIdNot(long vehicleId);

}
