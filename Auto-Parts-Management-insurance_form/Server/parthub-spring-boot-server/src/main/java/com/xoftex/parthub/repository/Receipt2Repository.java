package com.xoftex.parthub.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.xoftex.parthub.models.Receipt2;

@Repository
public interface Receipt2Repository extends JpaRepository<Receipt2, Long> {

  List<Receipt2> findByVehicleIdOrderByNameAsc(long vehicleId);

  List<Receipt2> findByVehicleId(long vehicleId);

  Optional<Receipt2> findByClaimId(long id);

  int countByVehicleIdNot(long vehicleId);

  Optional<Receipt2> findByAutopartId(long id);

    
}