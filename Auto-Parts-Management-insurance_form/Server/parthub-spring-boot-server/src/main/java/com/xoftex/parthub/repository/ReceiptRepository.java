package com.xoftex.parthub.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.xoftex.parthub.models.Receipt;

@Repository
public interface ReceiptRepository extends JpaRepository<Receipt, Long> {

  List<Receipt> findByVehicleIdOrderByNameAsc(long vehicleId);

  List<Receipt> findByVehicleId(long vehicleId);

  Optional<Receipt> findByClaimId(long id);

  int countByVehicleIdNot(long vehicleId);

  Optional<Receipt> findByAutopartId(long id);

    
}
