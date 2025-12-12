package com.xoftex.parthub.repository;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.xoftex.parthub.models.VehicleHistory;

@Repository
public interface VehicleHistoryRepository extends JpaRepository<VehicleHistory, Long> {
  List<VehicleHistory> findByVehicleId(long vehicleId);

  Optional<VehicleHistory> findTopByVehicleIdOrderByCreatedAtDesc(long vehicleId);

  @Query(value = "SELECT vh.vehicle_id as STATUS, COUNT(*) as count FROM vehicle_histories  vh LEFT JOIN vehicles v ON vh.vehicle_id = v.id  WHERE v.company_id=:companyId AND v.archived=0 GROUP BY vh.vehicle_id ORDER BY count asc", nativeQuery = true)
  List<Object[]> reportVehicleChanges(@Param("companyId") long companyId);

  @Query(value = "SELECT vh.user_id as STATUS, COUNT(*) as count FROM vehicle_histories  vh LEFT JOIN vehicles v ON vh.vehicle_id = v.id  WHERE v.company_id=:companyId AND v.archived=0 GROUP BY vh.user_id ORDER BY count asc", nativeQuery = true)
  List<Object[]> reportUserChanges(@Param("companyId") long companyId);

  List<VehicleHistory> findByVehicleIdAndCreatedAtBetweenOrderByIdDesc(long id, Date start,
        Date end);
}
