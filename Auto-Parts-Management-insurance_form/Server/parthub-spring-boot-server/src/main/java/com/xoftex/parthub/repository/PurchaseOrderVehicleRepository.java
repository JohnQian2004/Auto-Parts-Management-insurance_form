package com.xoftex.parthub.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.xoftex.parthub.models.PurchaseOrderVehicle;

@Repository
public interface PurchaseOrderVehicleRepository extends JpaRepository<PurchaseOrderVehicle, Long> {

  List<PurchaseOrderVehicle> findByVehicleIdOrderByPartNameAsc(long vehicleId);

  List<PurchaseOrderVehicle> findByVehicleId(long vehicleId);

  List<PurchaseOrderVehicle> findByClaimId(long id);
}
